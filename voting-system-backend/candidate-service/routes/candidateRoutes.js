const express = require('express');
const { addCandidate, removeCandidate, updateCandidate,  } = require('../controllers/candidateController');
const router = express.Router();
const Candidate = require('../models/Candidate'); // Ensure this line is included


router.post('/:electionId', addCandidate);
router.delete('/:electionId/:candidateId', removeCandidate);
router.put('/:electionId/:candidateId', updateCandidate);
// Route to get candidates by electionId
router.get('/:electionId', async (req, res) => {
    try {
        const candidates = await Candidate.find({ election_id: req.params.electionId });
        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
