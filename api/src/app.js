require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const scheduleWeatherUpdates = require('./jobs/weather.job');
const subscriptionRoutes = require('./routes/subscription.routes');
const weatherRoutes = require('./routes/weather.routes');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', weatherRoutes);
app.use('/api', subscriptionRoutes);

scheduleWeatherUpdates();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});