import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import connectDB from './utils/db.js';

import userRoutes from './routes/userRoutes.js';
import mealLogRoutes from './routes/mealLogRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import tipRoutes from './routes/tipRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';

dotenv.config();

const swaggerDoc = YAML.load('./docs/api.yaml');

const app = express();
app.use(express.json());
app.set('json spaces', 2);

const PORT = process.env.PORT || 5001;

// Routes
app.use('/api/users', userRoutes);
app.use('/api/meallogs', mealLogRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Connect to mongoDB
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();

app.get('/', (req, res) => {
  res.send('DailyNutri Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs avaliable at http://localhost:${PORT}/api-docs`);
});
