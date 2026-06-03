import mongoose from "mongoose";

// Use native MongoDB instance for tests. Set `MONGO_URI` in your environment
// to point to the test database (e.g. mongodb://127.0.0.1:27017/dailynutri_test).
if (typeof jest !== "undefined") jest.setTimeout(30000);

const mongoUri = "mongodb://127.0.0.1:27017/dailynutri_test";

beforeAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();

    // Ensure app code can pick up the same URI
    process.env.MONGO_URI = mongoUri;

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 30000 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      "Failed to connect to MongoDB for tests:",
      err && err.message ? err.message : err,
    );
    throw err;
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    // ignore
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    try {
      await collection.deleteMany({});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        "Failed to clear collection",
        key,
        err && err.message ? err.message : err,
      );
    }
  }
});
