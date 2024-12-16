import express from 'express';
import connectDB from './utils/db.js';

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.get('/', (req, res) => {
  res.send('DailyNutri Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
