const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Register a new user
async function registerUser(req, res) {
    console.log("registerUser called");
    try {
        const { username, password, email, full_name } = req.body;

        // Vérifiez si l'utilisateur ou l'email existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send('Email already exists');
        }

        const password_hash = await bcrypt.hash(password, 10);

        // Générer un secret 2FA pour l'utilisateur
        const secret = speakeasy.generateSecret({ name: `Ydays_Voting_System (${username})` });

        const user = new User({ username, password_hash, email, full_name, two_factor_secret: secret.base32 });
        await user.save();

        // Générer un code QR pour que l'utilisateur puisse le scanner avec Google Authenticator
        const otpauth_url = secret.otpauth_url;
        qrcode.toDataURL(otpauth_url, (err, data_url) => {
            if (err) {
                console.error('Error generating QR code:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).send({ user, qr_code: data_url });
        });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).send('Internal Server Error');
    }
}

// Login an existing user
// Login an existing user
async function loginUser(req, res) {
    console.log("loginUser called");
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
            res.status(200).send({ token, user: { _id: user._id, username: user.username, role: user.role } });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Internal Server Error');
    }
}

// Verify 2FA token
async function verify2FA(req, res) {
    console.log("verify2FA called with:", req.body);
    try {
        const { userId, token } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        const verified = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: 'base32',
            token
        });

        if (verified) {
            res.status(200).send('2FA verification successful');
        } else {
            res.status(400).send('Invalid 2FA token');
        }
    } catch (err) {
        console.error('2FA verification error:', err.message);
        res.status(500).send('Internal Server Error');
    }
}

// Logout a user (assuming a token-based approach)
async function logoutUser(req, res) {
    console.log("logoutUser called");
    res.status(200).send('User logged out');
}


module.exports = {
    registerUser,
    loginUser,
    verify2FA,
    logoutUser
};
