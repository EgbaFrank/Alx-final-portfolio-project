import request from "supertest";

let app;
beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
  app = (await import("../app.js")).default;
});

describe("Protected User Routes", () => {
  const user = {
    firstname: "Private",
    lastname: "Account",
    age: 40,
    gender: "male",
    email: "private@example.com",
    password: "topsecret",
  };

  let token;

  beforeEach(async () => {
    await request(app).post("/api/users/register").send(user);
    const res = await request(app).post("/api/users/login").send({
      email: user.email,
      password: user.password,
    });
    token = res.body.token;
  });

  it("rejects requests with no token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("returns the current user when provided a valid token", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", user.email);
    expect(res.body).not.toHaveProperty("password");
  });

  it("updates the user profile", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstname: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("firstname", "Updated");
  });
});
