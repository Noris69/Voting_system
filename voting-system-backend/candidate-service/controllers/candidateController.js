const Candidate = require('../models/Candidate');

// Add a candidate to an election
async function addCandidate(req, res) {
    try {
        const { electionId } = req.params;
        const { candidate_name, party, image_url } = req.body;

        const candidate = new Candidate({ election_id: electionId, candidate_name, party, image_url });
        await candidate.save();
        res.status(201).send(candidate);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Remove a candidate from an election
async function removeCandidate(req, res) {
    try {
        const { electionId, candidateId } = req.params;
        const candidate = await Candidate.findOneAndDelete({ _id: candidateId, election_id: electionId });
        if (!candidate) {
            return res.status(404).send('Candidate not found');
        }
        res.status(200).send('Candidate removed');
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Update candidate details
async function updateCandidate(req, res) {
    try {
        const { electionId, candidateId } = req.params;
        const updateData = req.body;
        const candidate = await Candidate.findOneAndUpdate({ _id: candidateId, election_id: electionId }, updateData, { new: true });
        if (!candidate) {
            return res.status(404).send('Candidate not found');
        }
        res.status(200).send(candidate);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    addCandidate,
    removeCandidate,
    updateCandidate
};
