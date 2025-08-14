import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  rate: { type: Number, required: true }
});

export default mongoose.model('Rate', rateSchema);
