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
  servings: { type: Number, required: true },
  comps: [compSchema],
  nutrientPerServing: [nutrientSchema], // Nutrient Per Serving
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

// aggregate recipe nutrients hook
recipeSchema.pre('save', function aggregateNutrients(next) {
  const totalNutrients = this.comps.reduce((acc, comp) => {
    comp.nutrients.forEach((nutrient) => {
      const existing = acc.find((n) => n.name === nutrient.name);
      if (existing) {
        existing.value += nutrient.value;
      } else {
        acc.push({
          name: nutrient.name,
          unit: nutrient.unit,
          value: nutrient.value,
        });
      }
    });
    return acc;
  }, []);
  console.log(`Recipe total nutrient: ${JSON.stringify(totalNutrients, null, 2)}`);

  this.nutrientPerServing = totalNutrients.map((nutrient) => ({
    name: nutrient.name,
    unit: nutrient.unit,
    value: nutrient.value / this.servings,
  }));

  next();
});

// remove version from output
recipeSchema.set('toJSON', {
  transform: (doc, ret) => {
    const newRet = { ...ret };
    delete newRet.__v;
    return newRet;
  },
});

export default mongoose.model('Recipes', recipeSchema);
