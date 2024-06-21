const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidateRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/api/candidates', candidateRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Candidate service running on port ${PORT}`));
