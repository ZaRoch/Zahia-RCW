
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();


app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Transaction API',
      version: '1.0.0',
      description: 'Documentation des routes API pour la gestion des transactions numériques.'
    },
    servers: [
      { url: 'http://localhost:5000' }
    ]
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


import alertRoutes from './routes/alert.js';
import statusRoutes from './routes/status.js';
import rateHistoryRoutes from './routes/rateHistory.js';
import receiptRoutes from './routes/receipt.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transaction.js';
import rateRoutes from './routes/rate.js';
import dashboardRoutes from './routes/dashboard.js';

app.use('/api/alerts', alertRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/rate-history', rateHistoryRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rates', rateRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API de gestion de transactions numériques');
});

mongoose.connect('mongodb://localhost:27017/transactiondb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connecté à MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
  });
}).catch(err => {
  console.error('Erreur de connexion MongoDB', err);
});
