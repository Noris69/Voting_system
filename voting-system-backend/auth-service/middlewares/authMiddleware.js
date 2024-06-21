const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const user = await User.findOne({ 'tokens.token': token });
        if (!user) {
            return res.status(401).send('Invalid token');
        }
        req.user = user;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}


async function adminMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            return res.status(401).send('Invalid token');
        }

        if (user.role === 'admin') {
            req.user = user;
            next();
        } else {
            res.status(403).send('Access denied. Admins only.');
        }
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
}



module.exports = { authMiddleware, adminMiddleware };
