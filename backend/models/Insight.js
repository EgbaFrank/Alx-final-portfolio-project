import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  deficiency: [{
    nutrient: { type: String, required: true },
    severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], default: 'Moderate' },
  }],
  recommendation: [{
    nutrient: { type: String, required: true },
    advice: { type: String, required: true },
  }],
}, { timestamps: true });

insightSchema.index({ userId: 1 });

export default mongoose.model('Insights', insightSchema);
