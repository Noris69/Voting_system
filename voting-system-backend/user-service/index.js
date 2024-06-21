const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { authMiddleware, adminMiddleware } = require('./middlewares/authMiddleware');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/api/users', authMiddleware, userRoutes);

app.use('/api/admin/users', authMiddleware, adminMiddleware, userRoutes);


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
