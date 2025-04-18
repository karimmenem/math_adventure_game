const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/achievements', achievementRoutes);

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});