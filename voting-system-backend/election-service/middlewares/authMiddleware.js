const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

async function adminMiddleware(req, res, next) {
    try {
        const user = await User.findById(req.user.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).send('Access denied. Admins only.');
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { authMiddleware, adminMiddleware };
