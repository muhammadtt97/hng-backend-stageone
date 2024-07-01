const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const IPINFO_TOKEN = process.env.IPINFO_TOKEN;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

app.get('/api/hello', async (req, res) => {
  try {
    const visitorName = req.query.visitor_name || 'Guest';
    
    // Try to get the real client IP
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress;
    
    console.log('Client IP:', clientIp);

    // Get location data
    const ipinfoResponse = await axios.get(`https://ipinfo.io/${clientIp}?token=${IPINFO_TOKEN}`);
    console.log('ipinfo response:', ipinfoResponse.data);

    const location = ipinfoResponse.data.city || 'Unknown';
    const [lat, lon] = ipinfoResponse.data.loc ? ipinfoResponse.data.loc.split(',') : ['0', '0'];

    console.log('Location:', location, 'Lat:', lat, 'Lon:', lon);

    // Get weather data
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`);
    console.log('Weather response:', weatherResponse.data);

    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
    });
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

module.exports = app;