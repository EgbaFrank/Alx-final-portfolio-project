import dotenv from "dotenv";

dotenv.config();
export default [
  {
    firstName: "Daniel",
    lastName: "Balanced",
    email: "balanced@dailynutri.dev",
    password: process.env.TEST_USER_PASSWORD,
    age: 28,
    gender: "male",
    profileType: "balanced",
  },

  {
    firstName: "Clara",
    lastName: "Deficient",
    email: "deficient@dailynutri.dev",
    password: process.env.TEST_USER_PASSWORD,
    age: 22,
    gender: "female",
    profileType: "deficient",
  },

  {
    firstName: "Michael",
    lastName: "Overloaded",
    email: "overloaded@dailynutri.dev",
    password: process.env.TEST_USER_PASSWORD,
    age: 35,
    gender: "male",
    profileType: "overloaded",
  },
];
