import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  nutrientName: { type: String, required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  message: { type: String, required: true },
}, { timestamps: true });

alertSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

alertSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Alerts', alertSchema);
