const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Check if username already exists
      const existingUsername = await userModel.findByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // Check if email already exists
      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      
      // Create user
      const newUser = await userModel.createUser(username, email, password);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.user_id,
          username: newUser.username,
          email: newUser.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  },

  
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Find user
      const user = await userModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Update last login
      await userModel.updateLastLogin(user.user_id);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
};

module.exports = authController;