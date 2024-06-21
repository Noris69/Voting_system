const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { authMiddleware } = require('./middlewares/authMiddleware');
const { adminMiddleware } = require('./middlewares/authMiddleware');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('api/admin', authMiddleware, adminMiddleware, authRoutes)

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
