import request from "supertest";

let app;
beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
  app = (await import("../app.js")).default;
});

describe("Authentication (login)", () => {
  const user = {
    firstname: "Auth",
    lastname: "User",
    age: 35,
    gender: "male",
    email: "authuser@example.com",
    password: "mypassword",
  };

  beforeEach(async () => {
    await request(app).post("/api/users/register").send(user);
  });

  it("logs in successfully and returns a token", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("returns 401 when missing credentials", async () => {
    const res = await request(app).post("/api/users/login").send({ email: "" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 404 when user does not exist", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "noone@example.com",
      password: "whatever",
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 401 for invalid password", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: user.email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
