const pool = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  // Create a new user
  async createUser(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING user_id, username, email, created_at
      `;
      const values = [username, email, hashedPassword];
      const result = await pool.query(query, values);
      
      // Create initial user_progress entry
      if (result.rows[0]) {
        await pool.query(
          `INSERT INTO user_progress (user_id) VALUES ($1)`,
          [result.rows[0].user_id]
        );
      }
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Find user by username
  async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = $1';
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Find user by email
  async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update last login time
  async updateLastLogin(userId) {
    try {
      const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1';
      await pool.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = userModel;