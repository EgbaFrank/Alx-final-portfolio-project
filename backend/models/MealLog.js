import mongoose from 'mongoose';

const nutrientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true },
});
const mealLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  mealName: { type: String, required: true },
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], required: true },
  nutrients: [nutrientSchema],
}, { timestamps: true });

mealLogSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model('MealLogs', mealLogSchema);
