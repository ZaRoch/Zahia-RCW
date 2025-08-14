import mongoose from 'mongoose';


const transactionSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  clientName: { type: String, required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  convertedAmount: { type: Number },
  convertedCurrency: { type: String },
  rate: { type: Number },
  service: { type: String, enum: ['RIA', 'WU', 'MG'], required: true },
  transactionNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['en attente', 'validée', 'annulée'], default: 'en attente' },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);
