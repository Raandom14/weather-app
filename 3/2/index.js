const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const https = require('https');
const url = require('url');

const apiKey = '72f46d3d5ca64b3aa2875745251707';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/weather' && req.method === 'GET') {
    const city = parsedUrl.query.city;

    if (!city) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'City parameter is required' }));
    }

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

    https.get(apiUrl, apiRes => {
      let data = '';

      apiRes.on('data', chunk => {
        data += chunk;
      });

      apiRes.on('end', () => {
        try {
          const weatherData = JSON.parse(data);
          
          
          if (weatherData.error) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: weatherData.error.message }));
          } else {
            const responseJson = {
              name: weatherData.location.name,
              country: weatherData.location.country,
              temp: weatherData.current.temp_c,
              description: weatherData.current.condition.text,
              icon: weatherData.current.condition.icon
            };

            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(responseJson));
          }
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to parse weather data' }));
        }
      });
    }).on('error', err => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error fetching data from API' }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  
  
});

