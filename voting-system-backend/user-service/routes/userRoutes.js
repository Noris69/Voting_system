const express = require('express');
const { getAllUsers, getUserById, updateUserRole, importUsers } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:userId', authMiddleware, getUserById);
router.put('/:userId/role', authMiddleware, adminMiddleware, updateUserRole);
router.post('/import', authMiddleware, adminMiddleware, importUsers);

module.exports = router;
