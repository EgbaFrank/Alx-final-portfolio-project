import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  alertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alerts', required: true },
  nutrientName: { type: String, required: true },
  active: { type: Boolean, default: true },
  message: { type: String, required: true },
}, { timestamps: true });

tipSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

tipSchema.index({ userId: 1, status: 1, createdAt: -1 });

export default mongoose.model('Tips', tipSchema);
