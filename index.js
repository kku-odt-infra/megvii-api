const AuthClient = require('./authClient');

async function main() {
  const auth = new AuthClient();
  
  try {
    const result = await auth.authenticate();
    console.log('\nAuthentication Result:', result);
    return result;
  } catch (error) {
    console.error('\nAuthentication Error:', error.message);
    return null;
  }
}

if (require.main === module) {
  main().then(result => {
    if (result) {
      console.log('\nSession ID for API requests:', result.session_id);
    } else {
      console.log('\nFailed to obtain session ID');
    }
  });
}