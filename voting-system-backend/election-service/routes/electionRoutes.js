const express = require('express');
const { createElection, updateElection, deleteElection, importElections, getAllElections  } = require('../controllers/electionController');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, adminMiddleware, createElection);
router.put('/:electionId', authMiddleware, adminMiddleware, updateElection);
router.delete('/:electionId', authMiddleware, adminMiddleware, deleteElection);
router.post('/import', authMiddleware, adminMiddleware, importElections);
router.get('/all', getAllElections); // Add this line


module.exports = router;
