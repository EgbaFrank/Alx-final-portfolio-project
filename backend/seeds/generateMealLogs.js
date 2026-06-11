import MealLog from "../models/MealLog.js";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import UserSeed from "./users.seed.js";
import mealPatterns from "./mealPatterns.seed.js";
import MealLogController from "../controllers/MealLogController.js";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

/**
 * Scale nutrient values based on serving consumed
 */
function scaleNutrients(nutrients, serving) {
  return nutrients.map((nutrient) => ({
    ...(nutrient.toObject?.() || nutrient),
    value: Number((nutrient.value * serving).toFixed(2)),
  }));
}

/**
 * Create consumedAt date
 */
function createConsumedDate(dayOffset, mealType) {
  const date = new Date();

  // Start from 7 days ago
  date.setDate(date.getDate() - (6 - dayOffset));

  // Approximate meal times
  const mealHours = {
    Breakfast: 8,
    Lunch: 13,
    Dinner: 19,
  };

  date.setHours(mealHours[mealType], 0, 0, 0);

  return date;
}

async function generateMealLogs() {
  const users = await User.find({});
  const recipes = await Recipe.find({});

  // Add user profile types to users based on seed data
  users.forEach((user) => {
    const seedUser = UserSeed.find((u) => u.email === user.email);
    if (seedUser) {
      user.profileType = seedUser.profileType;
    }
  });

  // Recipe lookup map
  const recipeMap = {};

  recipes.forEach((recipe) => {
    recipeMap[recipe.name] = recipe;
  });

  for (const user of users) {
    const profileType = user.profileType;

    const weeklyPattern = mealPatterns[profileType];

    if (!weeklyPattern) continue;

    for (let dayIndex = 0; dayIndex < weeklyPattern.length; dayIndex++) {
      const dayMeals = weeklyPattern[dayIndex];

      for (const mealType of MEAL_TYPES) {
        const meal = dayMeals[mealType];

        // Skip missed meals
        if (!meal) continue;

        const recipe = recipeMap[meal.recipe];

        if (!recipe) {
          console.warn(`Recipe not found: ${meal.recipe}`);
          continue;
        }

        const serving = meal.serving || 1;
        const consumedNutrients = scaleNutrients(
          recipe.nutrientPerServing,
          serving,
        );

        await MealLog.create({
          userId: user._id,

          recipe: recipe._id,

          recipeNameSnapshot: recipe.name,

          mealType,

          serving,

          consumedNutrients,

          consumedAt: createConsumedDate(dayIndex, mealType),
        });
        await MealLogController.processMealLog(user._id, consumedNutrients);
      }
    }
    console.log(`Generated meal logs for user: ${user.email} (${profileType})`);
  }

  console.log("Meal logs generated successfully");
}

export default generateMealLogs;
