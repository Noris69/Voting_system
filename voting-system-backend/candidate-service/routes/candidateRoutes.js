const express = require('express');
const { addCandidate, removeCandidate, updateCandidate } = require('../controllers/candidateController');
const router = express.Router();
const Candidate = require('../models/Candidate'); // Ensure this line is included

/**
 * @swagger
 * /api/candidates/{electionId}:
 *   post:
 *     summary: Add a new candidate
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the election
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               party:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidate added successfully
 */
router.post('/:electionId', addCandidate);

/**
 * @swagger
 * /api/candidates/{electionId}/{candidateId}:
 *   delete:
 *     summary: Remove a candidate
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the election
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the candidate
 *     responses:
 *       200:
 *         description: Candidate removed successfully
 */
router.delete('/:electionId/:candidateId', removeCandidate);

/**
 * @swagger
 * /api/candidates/{electionId}/{candidateId}:
 *   put:
 *     summary: Update a candidate
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the election
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               party:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidate updated successfully
 */
router.put('/:electionId/:candidateId', updateCandidate);

/**
 * @swagger
 * /api/candidates/{electionId}:
 *   get:
 *     summary: Get candidates by election ID
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the election
 *     responses:
 *       200:
 *         description: List of candidates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   party:
 *                     type: string
 */
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
