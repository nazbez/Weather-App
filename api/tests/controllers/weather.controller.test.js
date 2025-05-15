const { getWeather } = require('../../src/controllers/weather.controller');
const axios = require('axios');

jest.mock('axios');

describe('weather.controller - getWeather', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return 400 if city is not provided', async () => {
    await getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'City is required' });
  });

  it('should return weather data for a valid city', async () => {
    req.query.city = 'Kyiv';

    axios.get.mockResolvedValue({
      data: {
        current: {
          temp_c: 20,
          humidity: 65,
          condition: { text: 'Sunny' }
        }
      }
    });

    await getWeather(req, res);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('weatherapi.com'), {
      params: expect.objectContaining({ q: 'Kyiv' })
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      temperature: 20,
      humidity: 65,
      description: 'Sunny'
    });
  });

  it('should return 404 if city is not found', async () => {
    req.query.city = 'Invalid';

    axios.get.mockRejectedValue({
      response: { status: 400 }
    });

    await getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'City not found' });
  });

  it('should return 500 on unexpected error', async () => {
    req.query.city = 'Kyiv';

    axios.get.mockRejectedValue(new Error('Network down'));

    await getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Weather service error' });
  });
});
