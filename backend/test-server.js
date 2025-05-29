const http = require('http');

console.log('🧪 Testing backend server...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is responding! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response:', data);
    console.log('🎉 Backend server is working correctly!');
  });
});

req.on('error', (error) => {
  console.error('❌ Server test failed:', error.message);
  console.log('💡 Make sure the backend server is running on port 5000');
});

req.end();
