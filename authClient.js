const axios = require('axios');
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
  }

  /**
   * Get challenge token for login
   * @param {string} username 
   * @returns {Promise<{challenge: string, session_id: string}>}
   */
  async getChallenge(username) {
    try {
      const { data } = await this.client.get(
        `/api/auth/login/challenge?username=${encodeURIComponent(username)}`
      );
      
      this.sessionId = data.session_id;
      return data;
    } catch (error) {
      console.error('Challenge request failed:', error.message);
      throw new Error('Failed to get challenge token');
    }
  }

  /**
   * Attempt login with credentials
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<{success: boolean}>}
   */
  async login(username, password) {
    if (!this.sessionId) {
      throw new Error('Must get challenge before attempting login');
    }

    try {
      const { data } = await this.client.post('/api/auth/login?type=web', {
        session_id: this.sessionId,
        username,
        password
      });

      return data;
    } catch (error) {
      console.error('Login failed:', error.message);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Complete full authentication flow
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<{success: boolean}>}
   */
  async authenticate(username, password) {
    try {
      await this.getChallenge(username);
      return await this.login(username, password);
    } catch (error) {
      console.error('Authentication flow failed:', error.message);
      throw error;
    }
  }
}

module.exports = AuthClient;