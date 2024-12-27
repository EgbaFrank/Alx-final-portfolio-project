import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  type: { type: String, enum: ['Macro', 'Micro'], required: true },
  endDate: { type: Date, required: true },
  nutrients: {
    type: Map,
    of: new mongoose.Schema({
      totalValue: { type: Number, default: 0 },
      recommendedValue: { type: Number, required: true },
      status: { type: String, enum: ['deficient', 'excess', 'onTrack'], default: 'onTrack' },
    }),
  },
  active: { type: Boolean, default: true },
}, { timestamps: true });

insightSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

insightSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Insights', insightSchema);
