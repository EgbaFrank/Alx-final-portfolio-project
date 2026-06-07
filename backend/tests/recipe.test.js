import { jest } from "@jest/globals";
import request from "supertest";

// Mock the nutrition service before importing the app so controllers use the mock
const mockFetch = jest.fn(async (name, state) => {
  // return one nutrient entry per ingredient for predictable math
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

describe("Recipe endpoints", () => {
  let token;

  const user = {
    firstname: "Recipe",
    lastname: "Tester",
    age: 29,
    gender: "female",
    email: "recipe@test.local",
    password: "recipes123",
  };

  beforeEach(async () => {
    await request(app).post("/api/users/register").send(user);
    const res = await request(app).post("/api/users/login").send({
      email: user.email,
      password: user.password,
    });
    token = res.body.token;
  });

  it("adds a recipe and returns nutrientPerServing", async () => {
    const payload = {
      name: "Test Stew",
      servings: 2,
      comps: [
        { name: "Beef", state: "raw", quantity: 200 }, // 200g
      ],
    };

    const res = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", payload.name);
    expect(res.body).toHaveProperty("servings", payload.servings);
    // nutrientPerServing should exist and contain protein and fat
    expect(res.body).toHaveProperty("nutrientPerServing");
    const protein = res.body.nutrientPerServing.find(
      (n) => n.name === "protein",
    );
    expect(protein).toBeDefined();
    // protein total = 10 * (200/100) = 20, per serving = 10
    expect(Math.round(protein.value)).toBe(10);
  });

  it("saves a recipe for the user and prevents duplicate saves", async () => {
    const payload = {
      name: "SaveMe",
      servings: 1,
      comps: [{ name: "Chicken", state: "raw", quantity: 100 }],
    };

    const addRes = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(addRes.status).toBe(201);
    const recipeId = addRes.body.id;

    const saveRes = await request(app)
      .post(`/api/recipes/save/${recipeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(saveRes.status).toBe(201);

    // second save should fail with 400
    const saveAgain = await request(app)
      .post(`/api/recipes/save/${recipeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(saveAgain.status).toBe(400);
  });

  it("returns saved recipes for the user", async () => {
    const payload = {
      name: "ListMe",
      servings: 1,
      comps: [{ name: "Potato", state: "raw", quantity: 100 }],
    };

    const addRes = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    const recipeId = addRes.body.id;

    await request(app)
      .post(`/api/recipes/save/${recipeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    const listRes = await request(app)
      .get("/api/recipes/saved")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    const found = listRes.body.find(
      (r) => r.id === recipeId || r._id === recipeId,
    );
    expect(found).toBeDefined();
    expect(found).toHaveProperty("name", payload.name);
  });

  it("publishes a recipe and it appears in public list", async () => {
    const payload = {
      name: "PublicRecipe",
      servings: 2,
      comps: [{ name: "Beef", state: "raw", quantity: 100 }],
    };

    const addRes = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    const recipeId = addRes.body.id;

    // Before publishing, it should not appear in public recipes
    const preList = await request(app)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${token}`);

    expect(preList.status).toBe(200);
    const preFound = preList.body.find((r) => r.id === recipeId);
    expect(preFound).toBeUndefined();

    // Publish as creator
    const pubRes = await request(app)
      .post(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(pubRes.status).toBe(200);

    // After publishing, it should appear in public list
    const postList = await request(app)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${token}`);

    expect(postList.status).toBe(200);
    const postFound = postList.body.find(
      (r) => r.id === recipeId || r._id === recipeId,
    );
    expect(postFound).toBeDefined();
    expect(postFound).toHaveProperty("name", payload.name);
  });

  it("prevents non-creators from publishing and restricts access to unpublished recipes unless saved", async () => {
    // create a recipe as primary user
    const payload = {
      name: "Unpublished",
      servings: 1,
      comps: [{ name: "Potato", state: "raw", quantity: 100 }],
    };

    const addRes = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    const recipeId = addRes.body.id;

    // register another user
    const other = {
      firstname: "Other",
      lastname: "User",
      age: 30,
      gender: "male",
      email: "other@test.local",
      password: "otherpass",
    };

    await request(app).post("/api/users/register").send(other);
    const loginOther = await request(app).post("/api/users/login").send({
      email: other.email,
      password: other.password,
    });
    const otherToken = loginOther.body.token;

    // other user should not be able to publish
    const pubByOther = await request(app)
      .post(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send();

    expect(pubByOther.status).toBe(400);

    // other user should not be able to fetch unpublished recipe
    const getByOther = await request(app)
      .get(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(getByOther.status).toBe(403);

    // after saving, other user should be able to access it
    const saveRes = await request(app)
      .post(`/api/recipes/save/${recipeId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send();

    expect(saveRes.status).toBe(201);

    const getSaved = await request(app)
      .get(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(getSaved.status).toBe(200);
  });
});
