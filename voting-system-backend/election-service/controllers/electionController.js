const Election = require('../models/Election');

// Create a new election
async function createElection(req, res) {
    try {
        const { election_name, start_date, end_date } = req.body;
        const election = new Election({ election_name, start_date, end_date });
        await election.save();
        res.status(201).send(election);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Update election details
async function updateElection(req, res) {
    try {
        const { electionId } = req.params;
        const updateData = req.body;
        const election = await Election.findByIdAndUpdate(electionId, updateData, { new: true });
        if (!election) {
            return res.status(404).send('Election not found');
        }
        res.status(200).send(election);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Import multiple elections
async function importElections(req, res) {
    console.log('Received data:', req.body);
    const elections = req.body;

    if (!Array.isArray(elections)) {
        return res.status(400).send('Invalid data format. Expected an array of elections.');
    }

    try {
        await Election.insertMany(elections);
        res.status(200).send('Elections imported successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Delete an election
async function deleteElection(req, res) {
    try {
        const { electionId } = req.params;
        const election = await Election.findByIdAndDelete(electionId);
        if (!election) {
            return res.status(404).send('Election not found');
        }
        res.status(200).send('Election deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function getAllElections(req, res) {
    try {
        const elections = await Election.find();
        res.status(200).send(elections);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    createElection,
    updateElection,
    deleteElection,
    importElections,
    getAllElections 
};
