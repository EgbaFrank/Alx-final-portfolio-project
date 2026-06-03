import app from "./app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs avaliable at http://localhost:${PORT}/api-docs`);
  console.log("=================================");
});
