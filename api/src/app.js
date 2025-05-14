require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const scheduleWeatherUpdates = require('./jobs/weather.job');
const subscriptionRoutes = require('./routes/subscription.routes');
const weatherRoutes = require('./routes/weather.routes');
const swaggerDocument = YAML.load('./swagger.yaml');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', weatherRoutes);
app.use('/api', subscriptionRoutes);

app.use((err, _req, res) => {
  console.error('❌ Internal error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

scheduleWeatherUpdates();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
