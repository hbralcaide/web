const https = require('https');

const options = {
  hostname: 'account.mappedin.com',
  port: 443,
  path: '/oauth/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify({
  client_id: process.env.MAPPEDIN_CLIENT_ID,
  client_secret: process.env.MAPPEDIN_CLIENT_SECRET,
  grant_type: 'client_credentials',
  audience: 'https://api.mappedin.com'
});

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);

  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Body:', body);
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.write(data);
req.end();