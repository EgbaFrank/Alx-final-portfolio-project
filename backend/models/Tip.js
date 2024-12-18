import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  alertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alerts', required: true },
  status: { type: String, enum: ['active', 'fulfilled'], default: 'active' },
  message: { type: String, required: true },
}, { timestamps: true });

tipSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

tipSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Tips', tipSchema);
