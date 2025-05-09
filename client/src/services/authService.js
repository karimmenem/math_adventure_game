// Use environment variables for API URL with a fallback for local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const authService = {
  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      // Handle non-JSON responses (in case of network errors)
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Network error or invalid response format');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      // Handle non-JSON responses
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Network error or invalid response format');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

export default authService;