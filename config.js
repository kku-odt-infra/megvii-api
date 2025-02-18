require('dotenv').config();

const requiredEnvVars = [
  'API_BASE_URL',
  'API_TIMEOUT',
  'API_USERNAME',
  'API_PASSWORD'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables:');
  console.error(missingEnvVars.join(', '));
  process.exit(1);
}

const config = {
  api: {
    baseUrl: process.env.API_BASE_URL,
    timeout: parseInt(process.env.API_TIMEOUT),
    credentials: {
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD
    }
  }
};

module.exports = config;