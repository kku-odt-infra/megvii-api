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
    this.credentials = config.api.credentials;
  }

  /**
   * Get challenge token for login
   * @returns {Promise<{challenge: string, session_id: string}>}
   */
  async getChallenge() {
    try {
      const { data } = await this.client.get(
        `/api/auth/login/challenge?username=${encodeURIComponent(this.credentials.username)}`
      );
      
      this.sessionId = data.session_id;
      return {
        challenge: data.challenge,
        session_id: data.session_id
      };
    } catch (error) {
      console.error('Challenge request failed:', error.message);
      throw new Error('Failed to get challenge token');
    }
  }

  /**
   * Attempt login with configured credentials
   * @returns {Promise<{success: boolean, session_id: string}>}
   */
  async login() {
    if (!this.sessionId) {
      throw new Error('Must get challenge before attempting login');
    }

    try {
      const { data } = await this.client.post('/api/auth/login?type=web', {
        session_id: this.sessionId,
        username: this.credentials.username,
        password: this.credentials.password
      });

      return {
        success: true,
        session_id: this.sessionId
      };
    } catch (error) {
      console.error('Login failed:', error.message);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Complete authentication flow and return session details
   * @returns {Promise<{success: boolean, session_id: string, challenge: string}>}
   */
  async authenticate() {
    try {
      const challengeResponse = await this.getChallenge();
      const loginResponse = await this.login();

      return {
        success: loginResponse.success,
        session_id: this.sessionId,
        challenge: challengeResponse.challenge
      };
    } catch (error) {
      console.error('Authentication flow failed:', error.message);
      throw error;
    }
  }

  /**
   * Get current session ID
   * @returns {string|null}
   */
  getSessionId() {
    return this.sessionId;
  }
}

module.exports = AuthClient;