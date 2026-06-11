import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import MealLog from "../models/MealLog.js";

import usersSeed from "./users.seed.js";
import recipesSeed from "./recipes.seed.js";
import generateMealLogs from "./generateMealLogs.js";

dotenv.config();

async function seedUsers() {
  console.log("Seeding users...");

  const users = [];

  for (const userData of usersSeed) {
    const user = await User.create(userData);
    users.push(user);
    console.log(`Created user: ${user.email}`);
  }

  return users;
}

async function seedRecipes() {
  const recipeUser = await User.create({
    firstName: "Recipe",
    lastName: "Seeder",
    age: 35,
    password: "recipeseed123",
    email: "recipe.seeder@example.com",
  });
  console.log("Seeding recipes...");

  const recipes = [];

  for (const recipeData of recipesSeed) {
    recipeData.createdBy = recipeUser._id;
    recipeData.isPublished = true;
    const recipe = await Recipe.create(recipeData);
    recipes.push(recipe);
    console.log(`Created recipe: ${recipe.name}`);
  }

  return recipes;
}

async function clearDatabase() {
  console.log("Clearing existing seed data...");

  await MealLog.deleteMany({});
  await Recipe.deleteMany({});
  await User.deleteMany({});
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const command = process.argv[2];
    console.log(`Running seed command: ${command}`);

    switch (command) {
      case "users":
        await seedUsers();
        break;

      case "recipes":
        await seedRecipes();
        break;

      case "mealLogs":
        await generateMealLogs();
        break;

      case "fresh":
        await clearDatabase();

        await seedUsers();

        await seedRecipes();

        await generateMealLogs();
        break;

      case "reset-mealLogs":
        console.log("Resetting meal logs...");
        await MealLog.deleteMany({});

        await generateMealLogs();
        break;

      case "reset-recipes":
        console.log("Resetting recipes...");
        await Recipe.deleteMany({});
        await seedRecipes();
        break;

      case "help":
        console.log(`
Available commands:

  npm run seed
  npm run seed fresh
  npm run seed users
  npm run seed recipes
  npm run seed mealLogs
  npm run seed reset-mealLogs
  npm run seed reset-recipes
  `);
        break;

      default:
        console.log("Unknown command.");
        console.log("Run: npm run seed help");
    }

    console.log("Seeding completed successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:");
    console.error(error);

    process.exit(1);
  }
}

run();
