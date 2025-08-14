import express from 'express';
import RateHistory from '../models/RateHistory.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/rate-history:
 *   post:
 *     summary: Ajouter un taux à l'historique
 *     tags: [RateHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               rate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Taux ajouté à l'historique
 */
router.post('/', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  const { from, to, rate } = req.body;
  try {
    const rateHistory = new RateHistory({ from, to, rate });
    await rateHistory.save();
    res.status(201).json(rateHistory);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout à l\'historique.' });
  }
});

/**
 * @swagger
 * /api/rate-history:
 *   get:
 *     summary: Liste de l'historique des taux
 *     tags: [RateHistory]
 *     responses:
 *       200:
 *         description: Liste de l'historique
 */
router.get('/', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  try {
    const history = await RateHistory.find();
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique.' });
  }
});

export default router;
