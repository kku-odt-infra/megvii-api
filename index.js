const AuthClient = require('./authClient');

async function main() {
  const auth = new AuthClient();
  
  try {
    console.log('Starting authentication process...');
    
    const authResult = await auth.authenticate();
    console.log('\nAuthentication successful!');
    console.log('Session ID:', authResult.session_id);
    
    return authResult.session_id;
  } catch (error) {
    console.error('\nAuthentication error:', error.message);
    return null;
  }
}

// Run the example
if (require.main === module) {
  main().then(sessionId => {
    if (sessionId) {
      console.log('\nSession ID for API requests:', sessionId);
    } else {
      console.log('\nFailed to obtain session ID');
    }
  });
}