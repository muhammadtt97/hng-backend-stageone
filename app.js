const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.ip;

  // Hardcoded values as per the question
  const location = "New York";
  const temperature = 11;

  res.json({
    client_ip: clientIp,
    location: location,
    greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});