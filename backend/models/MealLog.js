import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipes', required: true },
  serving: { type: Number, required: true },
  nutrientAggregate: [{
    _id: false,
    name: { type: String, required: true },
    unit: { type: String, required: true },
    value: { type: Number, required: true },
  }],
}, { timestamps: true });

mealLogSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

mealLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('MealLogs', mealLogSchema);
