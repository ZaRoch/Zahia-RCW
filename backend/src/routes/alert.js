import express from 'express';
import Alert from '../models/Alert.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Liste des alertes
 *     tags: [Alerts]
 *     responses:
 *       200:
 *         description: Liste des alertes
 */
router.get('/', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ date: -1 }).populate('transaction');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des alertes.' });
  }
});

export default router;
