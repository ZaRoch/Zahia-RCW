import express from 'express';
import Transaction from '../models/Transaction.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/transactions/{id}/status:
 *   patch:
 *     summary: Changer le statut d'une transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut changé
 *       404:
 *         description: Transaction non trouvée
 */
router.patch('/:id/status', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  const { status } = req.body;
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction non trouvée.' });
    transaction.status = status;
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du changement de statut.' });
  }
});

import Rate from '../models/Rate.js';
import { checkSuspiciousTransaction } from '../utils/alert.js';
import Alert from '../models/Alert.js';


router.post('/', authenticate, authorizeRoles('agent', 'superviseur', 'client'), async (req, res) => {
  const { clientName, amount, currency, service, transactionNumber, convertedCurrency } = req.body;
  try {
    // Block agent if amount > 10000
    if (req.user.role === 'agent' && amount > 10000) {
      return res.status(403).json({ message: 'Les agents ne peuvent pas ajouter une transaction supérieure à 10 000.' });
    }
    // Si client, la transaction est en attente et associée au client
    let transactionData = {
      clientName,
      amount,
      currency,
      service,
      transactionNumber,
      convertedCurrency,
      status: 'en attente',
      date: new Date()
    };
    if (req.user.role === 'client') {
      transactionData.client = req.user.userId;
    }
    let convertedAmount = null;
    let rateValue = null;
    if (convertedCurrency && convertedCurrency !== currency) {
      const rate = await Rate.findOne({ from: currency, to: convertedCurrency });
      if (!rate) return res.status(400).json({ message: 'Taux de conversion non trouvé.' });
      rateValue = rate.rate;
      convertedAmount = amount * rateValue;
      transactionData.convertedAmount = convertedAmount;
      transactionData.rate = rateValue;
    }
    const transaction = new Transaction(transactionData);
    await transaction.save();
    // Vérification des alertes
    const alerts = await checkSuspiciousTransaction({ clientName, amount, date: new Date() });
    if (alerts.length > 0) {
      for (const msg of alerts) {
        await Alert.create({
          transaction: transaction._id,
          clientName,
          type: 'transaction',
          message: msg,
          date: new Date()
        });
      }
    }
    res.status(201).json({ transaction, alerts });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement.' });
  }
});

// Liste des transactions (agent ou superviseur)

// Recherche multi-critères
router.get('/', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  const { clientName, service, status, startDate, endDate } = req.query;
  const filter = {};
  if (clientName) filter.clientName = { $regex: clientName, $options: 'i' };
  if (service) filter.service = service;
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  try {
    const transactions = await Transaction.find(filter);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération.' });
  }
});

export default router;
