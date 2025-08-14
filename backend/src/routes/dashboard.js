import express from 'express';
import Transaction from '../models/Transaction.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Statistiques globales (par service, devise, etc.)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Statistiques globales
 */
router.get('/', authenticate, authorizeRoles('agent', 'superviseur'), async (req, res) => {
  try {
    
    const byService = await Transaction.aggregate([
      { $group: { _id: '$service', totalEnvoye: { $sum: '$amount' }, totalRecu: { $sum: '$convertedAmount' } } }
    ]);
    
    const serviceCountsAgg = await Transaction.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } }
    ]);
    const serviceCounts = { MG: 0, RIA: 0, WU: 0 };
    serviceCountsAgg.forEach(s => { serviceCounts[s._id] = s.count; });
    
    const byCurrency = await Transaction.aggregate([
      { $group: { _id: '$currency', totalEnvoye: { $sum: '$amount' } } }
    ]);
    const byConvertedCurrency = await Transaction.aggregate([
      { $group: { _id: '$convertedCurrency', totalRecu: { $sum: '$convertedAmount' } } }
    ]);
  
  res.json({ byService, byCurrency, byConvertedCurrency, serviceCounts });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques.' });
  }
});

export default router;
