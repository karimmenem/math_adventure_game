const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');

// Apply auth middleware to all user routes
router.use(authMiddleware);

// Existing user routes
router.get('/progress', userController.getUserProgress);
router.get('/high-scores', userController.getHighScores);
router.post('/stats', userController.updateUserStats);

// New levels route
router.get('/levels', async (req, res) => {
    try {
      const userId = req.user.userId;
      
      console.log('Fetching levels for userId:', userId); // Add this line
      
      // Fetch user's total points
      const userProgressQuery = 'SELECT total_points FROM user_progress WHERE user_id = $1';
      const userProgressResult = await pool.query(userProgressQuery, [userId]);
      
      if (userProgressResult.rows.length === 0) {
        console.log('No user progress found for userId:', userId); // Add this line
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      const totalPoints = userProgressResult.rows[0].total_points;
      
      console.log('User Total Points:', totalPoints); // Add this line
      
      // Fetch all levels, sorted by required points
      const levelsQuery = `
        SELECT 
          level_id, 
          level_name, 
          description, 
          required_points, 
          category, 
          max_difficulty,
          CASE 
            WHEN required_points <= $1 THEN true 
            ELSE false 
          END as unlocked
        FROM levels
        ORDER BY required_points
      `;
      
      const levelsResult = await pool.query(levelsQuery, [totalPoints]);
      
      console.log('Levels Result:', levelsResult.rows); // Add this line
      
      res.json(levelsResult.rows);
    } catch (error) {
      console.error('Error fetching levels:', error);
      res.status(500).json({ message: 'Server error when fetching levels' });
    }
  });

module.exports = router;