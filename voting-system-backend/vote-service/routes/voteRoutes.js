const express = require('express');
const { submitVote, getVotesByElection, getVotesByUser } = require('../controllers/voteController');
const router = express.Router();

router.post('/:electionId', submitVote);
router.get('/election/:electionId', getVotesByElection);
router.get('/user/:userId', getVotesByUser);

module.exports = router;
