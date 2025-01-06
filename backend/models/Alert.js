import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  insightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Insights', required: true },
  alertType: { type: String, enum: ['deficient', 'excess'], required: true },
  nutrientName: { type: String, required: true },
  critical: { type: Boolean, default: false },
  percentage: { type: Number, min: 0, required: true },
  active: { type: Boolean, default: true },
  severity: { type: String, enum: ['mild', 'moderate', 'severe'], required: true },
}, { timestamps: true });

alertSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

alertSchema.index({ userId: 1, status: 1, createdAt: -1 });

export default mongoose.model('Alerts', alertSchema);
