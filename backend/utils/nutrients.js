const nutrients = {
  Protein: {
    usdaId: 1003,
    recommended: {
      amount: 50,
      unit: 'G',
      type: 'Macro',
    },
  },
  Carbohydrate: {
    usdaId: 1005,
    recommended: {
      amount: 275,
      unit: 'G',
      type: 'Macro',
    },
  },
  Fat: {
    usdaId: 1004,
    recommended: {
      amount: 70,
      unit: 'G',
      type: 'Macro',
    },
  },
  Fiber: {
    usdaId: 1079,
    recommended: {
      amount: 25,
      unit: 'G',
      type: 'Macro',
    },
  },
  'Vitamin C': {
    usdaId: 1162,
    recommended: {
      amount: 90,
      unit: 'MG',
      type: 'Micro',
    },
    foodSources: ['Oranges', 'Strawberries', 'Bell peppers (red)', 'Broccoli'],
  },
  Calcium: {
    usdaId: 1087,
    recommended: {
      amount: 1000,
      unit: 'MG',
      type: 'Micro',
    },
    foodSources: ['Milk', 'Yogurt', 'Cheese', 'Tofu (calcium-fortified)'],
  },
  Iron: {
    usdaId: 1089,
    recommended: {
      amount: 18,
      unit: 'MG',
      type: 'Micro',
    },
    foodSources: ['Red meat (beef)', 'Spinach', 'Lentils', 'Fortified cereals'],
  },
  'Vitamin D': {
    usdaId: 1106,
    recommended: {
      amount: 15,
      unit: 'UG',
      type: 'Micro',
    },
    foodSources: ['Fatty fish (salmon, tuna)', 'Fortified milk', 'Fortified orange juice', 'Egg yolks'],
  },
  Magnesium: {
    usdaId: 1090,
    recommended: {
      amount: 400,
      unit: 'MG',
      type: 'Micro',
    },
    foodSources: ['Spinach', 'Almonds', 'Avocado', 'Dark chocolate'],
  },
  Zinc: {
    usdaId: 1095,
    recommended: {
      amount: 11,
      unit: 'MG',
      type: 'Micro',
    },
    foodSources: ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas'],
  },
  'Vitamin A': {
    usdaId: 1104,
    recommended: {
      amount: 900,
      unit: 'UG',
      type: 'Micro',
    },
    foodSources: ['Carrots', 'Sweet potatoes', 'Spinach', 'Kale'],
  },
  'Vitamin B12': {
    usdaId: 1178,
    recommended: {
      amount: 2.4,
      unit: 'UG',
      type: 'Micro',
    },
    foodSources: ['Beef liver', 'Clams', 'Fortified nutritional yeast', 'Fortified milk'],
  },
  'Vitamin E': {
    usdaId: 1114,
    recommended: {
      amount: 15,
      unit: 'MG',
      type: 'Micro',
    },
    foodSources: ['Sunflower seeds', 'Almonds', 'Wheat germ oil', 'Spinach'],
  },
  Potassium: {
    usdaId: 1092,
    recommended: {
      amount: 3400,
      unit: 'MG',
      type: 'Micro',
    },
    foodSources: ['Bananas', 'Sweet potatoes', 'Spinach', 'Avocados'],
  },
  Sodium: {
    usdaId: 1093,
    recommended: {
      amount: 1500,
      unit: 'MG',
      type: 'Micro',
    },
    foodSources: ['Table salt', 'Processed foods', 'Soy sauce', 'Canned soups'],
  },
};

export default nutrients;
