const axios = require('axios');
const crypto = require('crypto');
const config = require('./config');
const { requestToCurl } = require('./debug');

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
    return crypto
      .createHash('sha256')
      .update(password + salt)
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
      console.log(requestToCurl(requestConfig));

      const { data } = await this.client.request(requestConfig);
      console.log('Challenge Response:', data);
      
      this.sessionId = data.session_id;
      this.salt = data.salt;
      this.challenge = data.challenge;
      
      return {
        challenge: data.challenge,
        session_id: data.session_id,
        salt: data.salt
      };
    } catch (error) {
      console.error('Challenge request failed:', {
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error('Failed to get challenge token');
    }
  }

  async login() {
    if (!this.sessionId || !this.salt) {
      throw new Error('Must get challenge before attempting login');
    }

    try {
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

      console.log('\nLogin Request with encrypted password:');
      console.log(requestToCurl(requestConfig));

      const { data } = await this.client.request(requestConfig);
      console.log('Login Response:', data);

      return {
        success: true,
        session_id: this.sessionId
      };
    } catch (error) {
      console.error('Login failed:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      throw new Error('Authentication failed');
    }
  }

  async authenticate() {
    try {
      console.log('\nStarting authentication flow...');
      console.log('Config:', {
        baseUrl: config.api.baseUrl,
        username: this.credentials.username,
        hasPassword: !!this.credentials.password
      });

      const challengeResponse = await this.getChallenge();
      const loginResponse = await this.login();

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

  getSessionId() {
    return this.sessionId;
  }

  getChallenge() {
    return this.challenge;
  }

  getSalt() {
    return this.salt;
  }
}

module.exports = AuthClient;