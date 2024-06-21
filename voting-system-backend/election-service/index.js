const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const electionRoutes = require('./routes/electionRoutes');
const { authMiddleware, adminMiddleware } = require('./middlewares/authMiddleware');

require('dotenv').config();

const app = express();
connectDB();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use('/api/elections', electionRoutes);
app.use('/api/admin/elections', authMiddleware, adminMiddleware, electionRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Election service running on port ${PORT}`));
