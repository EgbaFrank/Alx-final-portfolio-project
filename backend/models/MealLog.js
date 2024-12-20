import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  mealName: { type: String, required: true },
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], required: true },
  portionSize: {
    value: {
      type: Number, min: 1, default: 100, required: true,
    },
    unit: {
      type: String, enum: ['gram', 'cup', 'bowl'], default: 'gram', required: true,
    },
  },
  nutrients: {
    type: Map,
    of: new mongoose.Schema({
      nutrientName: { type: String, required: true },
      unitName: { type: String, required: true },
      value: { type: Number, required: true },
    }),
  },
}, { timestamps: true });

mealLogSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

mealLogSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model('MealLogs', mealLogSchema);
