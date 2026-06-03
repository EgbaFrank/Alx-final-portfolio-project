import request from "supertest";

let app;
beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
  app = (await import("../app.js")).default;
});

describe("User Registration", () => {
  it("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/users/register").send({
      firstname: "Jane",
      lastname: "Doe",
      age: 28,
      gender: "female",
      email: "jane@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("returns 401 for missing or invalid email", async () => {
    const res = await request(app).post("/api/users/register").send({
      firstname: "NoEmail",
      lastname: "User",
      age: 25,
      gender: "male",
      password: "pw",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when trying to register an existing user", async () => {
    const payload = {
      firstname: "Dup",
      lastname: "User",
      age: 30,
      gender: "male",
      email: "dup@example.com",
      password: "secret",
    };

    const first = await request(app).post("/api/users/register").send(payload);
    expect(first.status).toBe(201);

    const second = await request(app).post("/api/users/register").send(payload);
    expect(second.status).toBe(400);
    expect(second.body).toHaveProperty("error");
  });
});
