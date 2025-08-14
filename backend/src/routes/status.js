import express from 'express';
import Status from '../models/Status.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/statuses:
 *   post:
 *     summary: Ajouter un statut
 *     tags: [Statuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Statut ajouté
 */
router.post('/', authenticate, authorizeRoles('superviseur'), async (req, res) => {
  const { name, description } = req.body;
  try {
    const status = new Status({ name, description });
    await status.save();
    res.status(201).json(status);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du statut.' });
  }
});

/**
 * @swagger
 * /api/statuses:
 *   get:
 *     summary: Liste des statuts
 *     tags: [Statuses]
 *     responses:
 *       200:
 *         description: Liste des statuts
 */
router.get('/', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  try {
    const statuses = await Status.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statuts.' });
  }
});

export default router;
