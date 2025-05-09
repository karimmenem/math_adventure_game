const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const profileRoutes = require('./routes/profileRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Rest of your code remains the same...