import mongoose from 'mongoose';

// comp: Component
const compSchema = new mongoose.Schema({
  _id: false,
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, default: 'G' },
  nutrients: {
    type: Map,
    of: {
      unit: String,
      value: Number,
    },
  },
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  comps: [compSchema],
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Recipes', recipeSchema);
