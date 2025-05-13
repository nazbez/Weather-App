const cron = require('node-cron');
const { Subscription } = require('../models');
const axios = require('axios');
const nodemailer = require('nodemailer');

const sendWeatherEmail = async (subscription) => {
  try {
    const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: subscription.city,
        aqi: 'no'
      }
    });

    const weather = response.data.current;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const unsubscribeUrl = `http://localhost:${process.env.PORT}/api/unsubscribe/${subscription.token}`;

    await transporter.sendMail({
      from: `"Weather Bot" <${process.env.EMAIL_USER}>`,
      to: subscription.email,
      subject: `Weather Update for ${subscription.city}`,
      html: `
        <p><strong>Weather in ${subscription.city}:</strong></p>
        <ul>
          <li>Temperature: ${weather.temp_c}°C</li>
          <li>Humidity: ${weather.humidity}%</li>
          <li>Description: ${weather.condition.text}</li>
        </ul>
        <p><a href="${unsubscribeUrl}">Unsubscribe</a></p>
      `
    });

    console.log(`Sent weather update to ${subscription.email}`);
  } catch (err) {
    console.error(`Failed to send update to ${subscription.email}`, err.message);
  }
};

const scheduleWeatherUpdates = () => {
  cron.schedule('0 * * * *', async () => {
    const subs = await Subscription.findAll({ where: { confirmed: true, frequency: 'hourly' } });
    subs.forEach(sendWeatherEmail);
  });

  cron.schedule('0 8 * * *', async () => {
    const subs = await Subscription.findAll({ where: { confirmed: true, frequency: 'daily' } });
    subs.forEach(sendWeatherEmail);
  });

  console.log('Weather update jobs scheduled');
};

module.exports = scheduleWeatherUpdates;
