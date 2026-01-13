// Simple test to verify login functionality
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🧪 Testing login functionality...');
    
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@veerupro.com',
        password: 'VeeruPro2024!',
        redirect: false
      })
    });
    
    const result = await response.json();
    console.log('Login test result:', result);
    
    if (response.ok) {
      console.log('✅ Login functionality is working!');
    } else {
      console.log('❌ Login failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogin();