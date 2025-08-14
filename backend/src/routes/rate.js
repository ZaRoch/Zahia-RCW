import express from 'express';
import Rate from '../models/Rate.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/rates:
 *   post:
 *     summary: Ajouter ou mettre à jour un taux de conversion
 *     tags: [Rates]
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
 *         description: Taux enregistré
 */
router.post('/', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  const { from, to, rate } = req.body;
  try {
    let rateDoc = await Rate.findOne({ from, to });
    if (rateDoc) {
      rateDoc.rate = rate;
      await rateDoc.save();
      return res.json(rateDoc);
    }
    rateDoc = new Rate({ from, to, rate });
    await rateDoc.save();
    res.status(201).json(rateDoc);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du taux.' });
  }
});


/**
 * @swagger
 * /api/rates:
 *   get:
 *     summary: Liste des taux ou recherche d'un taux précis
 *     tags: [Rates]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste ou taux trouvé
 */
router.get('/', authenticate, authorizeRoles('agent', 'superviseur', 'client'), async (req, res) => {
  const { from, to } = req.query;
  try {
    if (from && to) {
      const rate = await Rate.findOne({ from, to });
      if (!rate) return res.status(404).json({ message: 'Taux non trouvé.' });
      return res.json({ rate: rate.rate });
    }
    const rates = await Rate.find();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des taux.' });
  }
});

export default router;
