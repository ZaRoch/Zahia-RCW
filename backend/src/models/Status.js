import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

export default mongoose.model('Status', statusSchema);
