import express from 'express';

const app = express();
const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('DailyNutri Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
