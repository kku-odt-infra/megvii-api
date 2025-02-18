const axios = require('axios');
const crypto = require('crypto');
const config = require('./config');

class AuthClient {
  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    this.sessionId = null;
    this.credentials = config.api.credentials;
    this.salt = null;
    this.challenge = null;
  }

  encryptPassword(password, salt) {
    return crypto.createHmac('sha256', salt)
      .update(password)
      .digest('hex');
  }

  async getChallenge() {
    try {
      const requestConfig = {
        method: 'get',
        baseURL: this.client.defaults.baseURL,
        url: `/api/auth/login/challenge?username=${encodeURIComponent(this.credentials.username)}`,
        headers: this.client.defaults.headers
      };

      console.log('\nChallenge Request:');
      console.log('URL:', requestConfig.baseURL + requestConfig.url);
      console.log('Method:', requestConfig.method.toUpperCase());
      console.log('Headers:', requestConfig.headers);

      const response = await this.client.request(requestConfig);
      
      console.log('\nChallenge Response:');
      console.log('Status:', response.status);
      console.log('Data:', response.data);

      // เก็บค่าที่ได้จาก response
      this.sessionId = response.data.session_id;
      this.salt = response.data.salt;
      this.challenge = response.data.challenge;

      return response.data;
    } catch (error) {
      console.error('\nChallenge request failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Failed to get challenge token');
    }
  }

  async login() {
    if (!this.sessionId || !this.salt) {
      throw new Error('Must get challenge before attempting login');
    }

    try {
      // เข้ารหัส password ด้วย HMAC-SHA256
      const encryptedPassword = this.encryptPassword(
        this.credentials.password,
        this.salt
      );

      const requestConfig = {
        method: 'post',
        baseURL: this.client.defaults.baseURL,
        url: '/api/auth/login?type=web',
        headers: this.client.defaults.headers,
        data: {
          session_id: this.sessionId,
          username: this.credentials.username,
          password: encryptedPassword
        }
      };

      console.log('\nLogin Request:');
      console.log('URL:', requestConfig.baseURL + requestConfig.url);
      console.log('Method:', requestConfig.method.toUpperCase());
      console.log('Headers:', requestConfig.headers);
      console.log('Data:', {
        ...requestConfig.data,
        password: `${encryptedPassword.substring(0, 10)}...` // แสดงบางส่วนของ password ที่เข้ารหัสแล้ว
      });

      const response = await this.client.request(requestConfig);
      
      console.log('\nLogin Response:');
      console.log('Status:', response.status);
      console.log('Data:', response.data);

      return {
        success: true,
        session_id: this.sessionId
      };
    } catch (error) {
      console.error('\nLogin failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Authentication failed');
    }
  }

  async authenticate() {
    try {
      console.log('\nStarting authentication flow...');
      console.log('Config:', {
        baseUrl: this.client.defaults.baseURL,
        username: this.credentials.username,
        hasPassword: !!this.credentials.password
      });

      const challengeResponse = await this.getChallenge();
      console.log('\nGot challenge:', {
        session_id: this.sessionId,
        hasSalt: !!this.salt,
        hasChallenge: !!this.challenge
      });

      const loginResponse = await this.login();
      console.log('\nLogin completed:', loginResponse);

      return {
        success: loginResponse.success,
        session_id: this.sessionId,
        challenge: this.challenge
      };
    } catch (error) {
      console.error('Authentication flow failed:', error.message);
      throw error;
    }
  }
}

module.exports = AuthClient;