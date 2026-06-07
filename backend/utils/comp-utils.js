import Recipe from "../models/Recipe.js";

async function findExistingComp(compName) {
  const existingComp = await Recipe.findOne(
    { "comps.name": compName },
    { "comps.$": 1 },
  );

  if (existingComp) {
    console.log(`Comp ${compName} found in database`);
    return existingComp.comps[0].nutrients;
  }

  return null;
}

function calculateBonus(food, noun) {
  // Add ranking bonus if description starts with the noun (e.g. "Banana, raw" for "banana")
  // This helps prioritize exact matches over related items (e.g. "Pepper, Banana")
  const desc = food?.description.toLowerCase();

  // Starts with noun
  if (desc.startsWith(noun.toLowerCase())) {
    return 100;
  }

  return 0;
}

function rankFoods(a, b, noun) {
  // 1. Higher USDA relevance
  const aScore = (a.score || 0) + calculateBonus(a, noun);
  const bScore = (b.score || 0) + calculateBonus(b, noun);

  if (bScore !== aScore) {
    return bScore - aScore;
  }

  // 2. More nutrient coverage
  const nutrientDiff =
    (b.foodNutrients?.length || 0) - (a.foodNutrients?.length || 0);

  if (nutrientDiff !== 0) {
    return nutrientDiff;
  }

  // 3. Prefer Foundation
  if (a.dataType === "Foundation") return -1;
  if (b.dataType === "Foundation") return 1;

  return 0;
}

export { findExistingComp, rankFoods };
