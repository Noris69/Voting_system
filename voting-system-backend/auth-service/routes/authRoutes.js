const express = require('express');
const { registerUser, loginUser, logoutUser, verify2FA } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/verify-2fa', verify2FA);

module.exports = router;
