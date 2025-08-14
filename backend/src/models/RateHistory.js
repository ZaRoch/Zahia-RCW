import mongoose from 'mongoose';

const rateHistorySchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  rate: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('RateHistory', rateHistorySchema);
