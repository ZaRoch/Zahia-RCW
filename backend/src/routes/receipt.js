import express from 'express';
import Transaction from '../models/Transaction.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { generateTransactionPDF } from '../utils/pdf.js';

const router = express.Router();

/**
 * @swagger
 * /api/receipts/{id}/pdf:
 *   get:
 *     summary: Générer le reçu PDF d'une transaction
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction
 *     responses:
 *       200:
 *         description: PDF généré
 */
router.get('/:id/pdf', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction non trouvée.' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${transaction.transactionNumber}.pdf`);
    const doc = generateTransactionPDF(transaction.toObject());
    doc.pipe(res);
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la génération du PDF.' });
  }
});

/**
 * @swagger
 * /api/receipts/{id}/json:
 *   get:
 *     summary: Générer le reçu JSON d'une transaction
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction
 *     responses:
 *       200:
 *         description: JSON généré
 */
router.get('/:id/json', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction non trouvée.' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la génération du JSON.' });
  }
});

export default router;
