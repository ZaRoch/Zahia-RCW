import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  clientName: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Alert', alertSchema);
