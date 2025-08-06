const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');
const initializeDatabase = require('./initDb'); // Add this line
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const profileRoutes = require('./routes/profileRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

// Updated CORS configuration
const isProduction = process.env.NODE_ENV === 'production';
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Use more specific CORS settings
app.use(cors({
  origin: isProduction ? frontendURL : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/users/profile', profileRoutes);

// Initialize database before starting the server
(async () => {
  try {
    await initializeDatabase();
    console.log('Database initialization completed');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
})();

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Database connected successfully');
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Add this route to your index.js file
app.get('/api/achievements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM achievements');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a simple route to test database query
app.get('/api/problems', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM problems');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fix for port binding issue on Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});