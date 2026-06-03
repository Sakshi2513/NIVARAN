const axios = require('axios');

async function testRegister() {
  try {
    console.log('Testing register...');
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'SAKSHI',
      email: 'sheogekarsakshi929@gmail.com',
      password: 'password123',
      role: 'Citizen'
    });
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Data:', error.response.data);
      console.log('Error Status:', error.response.status);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error Message:', error.message);
    }
  }
}

testRegister();
