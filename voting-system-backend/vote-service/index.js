const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const voteRoutes = require('./routes/voteRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/api/votes', voteRoutes);

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`Vote service running on port ${PORT}`));
