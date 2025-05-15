const axios = require('axios');

exports.getWeather = async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  try {
    const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: city,
        aqi: 'no'
      }
    });

    const data = response.data;

    return res.status(200).json({
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    if (error.response && error.response.status === 400) {
      return res.status(404).json({ message: 'City not found' });
    }

    return res.status(500).json({ message: 'Weather service error' });
  }
};
