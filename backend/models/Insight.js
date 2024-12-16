import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  deficiency: [{ type: String, required: true }],
  recommendation: [{ type: String, required: true }],
}, { timestamps: true });

export default mongoose.model('Insights', insightSchema);
