require('dotenv').config();

const config = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://10.88.98.52',
    timeout: parseInt(process.env.API_TIMEOUT) || 5000
  }
};

module.exports = config;