const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');

// Get user progress
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const query = 'SELECT current_level, total_points, problems_solved FROM user_progress WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User progress not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;