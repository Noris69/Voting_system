const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const electionRoutes = require('./routes/electionRoutes');
const { authMiddleware, adminMiddleware } = require('./middlewares/authMiddleware');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

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

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Election API',
      version: '1.0.0',
      description: 'API documentation for the election service'
    },
    servers: [
      {
        url: 'http://localhost:5003'
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/elections', electionRoutes);
app.use('/api/admin/elections', authMiddleware, adminMiddleware, electionRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Election service running on port ${PORT}`));
