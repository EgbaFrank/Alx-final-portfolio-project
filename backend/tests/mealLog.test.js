import { jest } from "@jest/globals";
import request from "supertest";

// Mock the nutrition service before importing the app so controllers use the mock
const mockFetch = jest.fn(async (name, state) => {
  return [
    `${name} (mock)`,
    [
      { name: "protein", value: 10, unit: "G" },
      { name: "fat", value: 5, unit: "G" },
    ],
  ];
});

jest.unstable_mockModule("../services/nutritionAPI.js", () => ({
  default: mockFetch,
}));

let app;
beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
  app = (await import("../app.js")).default;
});

describe("MealLog endpoints", () => {
  let token;

  const user = {
    firstname: "Meal",
    lastname: "Logger",
    age: 28,
    gender: "female",
    email: "meallog@test.local",
    password: "meallog123",
  };

  beforeEach(async () => {
    await request(app).post("/api/users/register").send(user);
    const res = await request(app).post("/api/users/login").send({
      email: user.email,
      password: user.password,
    });
    token = res.body.token;
  });

  it("creates a meal log and is retrievable via list", async () => {
    const recipePayload = {
      name: "MealTestRecipe",
      servings: 1,
      comps: [{ name: "Egg", state: "raw", quantity: 100 }],
    };

    const addRes = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(recipePayload);

    expect(addRes.status).toBe(201);
    const recipeId = addRes.body.id;

    const createRes = await request(app)
      .post("/api/meallogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ recipeId, mealType: "Breakfast", serving: 1 });

    expect(createRes.status).toBe(201);

    const listRes = await request(app)
      .get("/api/meallogs")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.mealLogs)).toBe(true);
    expect(listRes.body.mealLogs.length).toBeGreaterThanOrEqual(1);
    const found = listRes.body.mealLogs.find(
      (m) => m.recipeNameSnapshot === recipePayload.name,
    );
    expect(found).toBeDefined();
  });

  it("validates required fields and serving constraints", async () => {
    // missing fields
    const res1 = await request(app)
      .post("/api/meallogs")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res1.status).toBe(400);

    // non-positive serving
    const recipePayload = {
      name: "InvalidServingRecipe",
      servings: 1,
      comps: [{ name: "Yam", state: "raw", quantity: 100 }],
    };

    const addRes = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(recipePayload);

    const recipeId = addRes.body.id;

    const res2 = await request(app)
      .post("/api/meallogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ recipeId, mealType: "Dinner", serving: 0 });

    expect(res2.status).toBe(400);
  });

  it("supports pagination and returns correct total", async () => {
    const recipePayload = {
      name: "PaginatedRecipe",
      servings: 1,
      comps: [{ name: "Bean", state: "raw", quantity: 100 }],
    };

    const addRes = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(recipePayload);

    const recipeId = addRes.body.id;

    // create 3 meal logs
    const types = ["Breakfast", "Lunch", "Dinner"];
    for (let i = 0; i < 3; i += 1) {
      // vary mealType to make entries distinct
      // eslint-disable-next-line no-await-in-loop
      await request(app)
        .post("/api/meallogs")
        .set("Authorization", `Bearer ${token}`)
        .send({ recipeId, mealType: types[i % types.length], serving: 1 });
    }

    const page1 = await request(app)
      .get("/api/meallogs?page=1&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(page1.status).toBe(200);
    expect(page1.body.pagination).toBeDefined();
    expect(page1.body.pagination.total).toBe(3);
    expect(page1.body.mealLogs.length).toBe(2);

    const page2 = await request(app)
      .get("/api/meallogs?page=2&limit=2")
      .set("Authorization", `Bearer ${token}`);

    expect(page2.status).toBe(200);
    expect(page2.body.mealLogs.length).toBe(1);
  });
});
