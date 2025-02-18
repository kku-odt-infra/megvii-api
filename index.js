const AuthClient = require('./authClient');

// Example usage
async function main() {
  const auth = new AuthClient();
  
  try {
    // Complete authentication flow
    const result = await auth.authenticate('admin', 'your_password');
    console.log('Authentication result:', result);
    
    // Or step by step
    // const challenge = await auth.getChallenge('admin');
    // console.log('Challenge received:', challenge);
    // const loginResult = await auth.login('admin', 'your_password');
    // console.log('Login result:', loginResult);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
if (require.main === module) {
  main();
}