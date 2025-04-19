// server/controllers/userController.js
const pool = require('../config/db');

const userController = {
  // Get user progress
  async getUserProgress(req, res) {
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
      res.status(500).json({ message: 'Server error when fetching user progress' });
    }
  },
  
  // Get high scores for a user
  async getHighScores(req, res) {
    try {
      const userId = req.user.userId;
      
      // Check if high_scores table exists
      const tableCheckQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'high_scores'
        )
      `;
      const tableExists = await pool.query(tableCheckQuery);
      
      if (!tableExists.rows[0].exists) {
        // Return empty scores if table doesn't exist yet
        return res.json({
          blitz: 0
        });
      }
      
      // Get blitz mode high score
      const blitzQuery = `
        SELECT MAX(score) as blitz_score FROM high_scores
        WHERE user_id = $1 AND game_mode = 'blitz'
      `;
      const blitzResult = await pool.query(blitzQuery, [userId]);
      
      // Return formatted high scores
      res.json({
        blitz: blitzResult.rows[0]?.blitz_score || 0
      });
    } catch (error) {
      console.error('Error fetching high scores:', error);
      res.status(500).json({ message: 'Server error when fetching high scores' });
    }
  },
  
  // Update user stats
  async updateUserStats(req, res) {
    try {
      const userId = req.user.userId;
      const { points, problemsSolved } = req.body;
      
      if (!points && !problemsSolved) {
        return res.status(400).json({ message: 'No stats provided to update' });
      }
      
      let query = 'UPDATE user_progress SET ';
      const values = [];
      let valueIndex = 1;
      
      if (points) {
        query += `total_points = total_points + $${valueIndex}`;
        values.push(points);
        valueIndex++;
      }
      
      if (problemsSolved) {
        if (valueIndex > 1) query += ', ';
        query += `problems_solved = problems_solved + $${valueIndex}`;
        values.push(problemsSolved);
        valueIndex++;
      }
      
      query += ` WHERE user_id = $${valueIndex} RETURNING *`;
      values.push(userId);
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating user stats:', error);
      res.status(500).json({ message: 'Server error when updating user stats' });
    }
  }
};

module.exports = userController;