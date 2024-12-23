import mongoose from 'mongoose';

const nutrientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  value: { type: Number, required: true },
}, { _id: false });

// comp: Component
const compSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, default: 'G' },
  nutrients: [nutrientSchema],
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  comps: [compSchema],
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Recipes', recipeSchema);
