const User = require('../models/User');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const twilio = require('twilio');
const Sms77Client = require('sms77-client');


// Charger les variables d'environnement
require('dotenv').config();

// Twilio configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sms77 = new Sms77Client(process.env.SMS77_API_KEY);


// Get all users
async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Fonction pour générer un username
const generateUsername = (fullName) => {
    return fullName.toLowerCase().replace(/\s/g, '_') + Math.floor(Math.random() * 1000);
};

// Fonction pour générer un mot de passe aléatoire
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};

// Fonction pour envoyer un email
const sendEmail = async (email, subject, html, attachments) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: html,
        attachments: attachments
    };

    await transporter.sendMail(mailOptions);
};

// Fonction pour envoyer un SMS via sms77.io
const sendSMS = async (phoneNumber, message) => {
    const isValidPhoneNumber = /^\+\d{10,14}$/.test(phoneNumber); // Regex simple pour valider les numéros internationaux
    if (!isValidPhoneNumber) {
        throw new Error(`Invalid phone number format: ${phoneNumber}`);
    }

    try {
        const response = await sms77.sms({
            to: phoneNumber,
            text: message
        });

        if (response.success) {
            console.log('SMS sent successfully');
        } else {
            console.error('Failed to send SMS:', response.error);
            throw new Error(response.error);
        }
    } catch (error) {
        console.error(`Failed to send SMS to ${phoneNumber}:`, error.message);
        throw error;
    }
};

// Importer des utilisateurs depuis un fichier JSON
async function importUsers(req, res) {
    console.log('Received data:', req.body);
    const users = req.body;

    if (!Array.isArray(users)) {
        return res.status(400).send('Invalid data format. Expected an array of users.');
    }

    for (const user of users) {
        const { full_name, email, phone_number } = user;
        const username = generateUsername(full_name);
        const password = generatePassword();
        const password_hash = await bcrypt.hash(password, 10);
        const secret = speakeasy.generateSecret({ name: `Ydays_Voting_System (${username})` });

        const newUser = new User({
            username,
            password_hash,
            email,
            full_name,
            role: 'user',
            two_factor_secret: secret.base32
        });

        await newUser.save();

        const otpauth_url = secret.otpauth_url;
        const qrCodeDataUrl = await qrcode.toDataURL(otpauth_url);

        // Envoyer l'e-mail avec la pièce jointe
        const emailHtml = `
            <p>Welcome to Ydays Voting System!</p>
            <p>Here are your login details:</p>
            <p>Username: ${username}</p>
            <p>Please use the following QR code to set up your 2FA:</p>
            <img src="cid:qrCode" alt="QR Code" />
        `;

        const emailAttachments = [
            {
                filename: 'qrcode.png',
                content: qrCodeDataUrl.split("base64,")[1],
                encoding: 'base64',
                cid: 'qrCode'
            }
        ];

        await sendEmail(email, 'Your Account Details', emailHtml, emailAttachments);

        // Envoyer le mot de passe par SMS
        const smsMessage = `Your Ydays Voting System password is: ${password}`;
        try {
            await sendSMS(phone_number, smsMessage);
        } catch (err) {
            console.error(`Failed to send SMS to ${phone_number}:`, err.message);
            return res.status(400).send(`Failed to send SMS to ${phone_number}: ${err.message}`);
        }
    }

    res.status(200).send('Users imported successfully');
}

async function getUserData(userId) {
    try {
        const user = await User.findById(userId);
        console.log(user); // Ensure the role is correct here
        return user;
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching user data');
    }
}

// Get user by ID
async function getUserById(req, res) {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Update user role
async function updateUserRole(req, res) {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).send('Invalid role');
        }
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    importUsers
};
