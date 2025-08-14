import Transaction from '../models/Transaction.js';

export async function checkSuspiciousTransaction({ clientName, amount, date }) {
  const alerts = [];
  // Seuil montant
  if (amount >= 10000) {
    alerts.push('Montant supérieur ou égal à 10 000.');
  }
  // Tentatives multiples en 10 min
  const tenMinutesAgo = new Date(date);
  tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
  const recentCount = await Transaction.countDocuments({
    clientName,
    date: { $gte: tenMinutesAgo, $lte: date }
  });
  if (recentCount > 3) {
    alerts.push('Plus de 3 transactions en 10 minutes pour ce client.');
  }
  return alerts;
}
