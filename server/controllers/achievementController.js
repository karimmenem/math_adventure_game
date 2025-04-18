const pool = require('../config/db');

const achievementController = {
  // Get all available achievements
  async getAllAchievements(req, res) {
    try {
      const query = 'SELECT * FROM achievements ORDER BY points_required ASC';
      const result = await pool.query(query);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ message: 'Server error when fetching achievements' });
    }
  },
  
  // Get user's earned achievements
  async getUserAchievements(req, res) {
    try {
      const userId = req.user.userId;
      
      const query = `
        SELECT a.*, ua.earned_at
        FROM achievements a
        INNER JOIN user_achievements ua ON a.achievement_id = ua.achievement_id
        WHERE ua.user_id = $1
        ORDER BY ua.earned_at DESC
      `;
      const result = await pool.query(query, [userId]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      res.status(500).json({ message: 'Server error when fetching user achievements' });
    }
  },
  
  // Check for new achievements after game completion
  // Modified check for new achievements function
async checkAchievements(req, res) {
    try {
      const userId = req.user.userId;
      const newAchievements = [];
      
      // Get user's current stats
      const statsQuery = 'SELECT total_points, problems_solved FROM user_progress WHERE user_id = $1';
      const statsResult = await pool.query(statsQuery, [userId]);
      
      if (statsResult.rows.length === 0) {
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      const { total_points, problems_solved } = statsResult.rows[0];
      
      // Get recent game session stats for streak checking
      const sessionQuery = `
        SELECT problems_attempted, problems_correct
        FROM game_sessions
        WHERE user_id = $1
        ORDER BY ended_at DESC
        LIMIT 1
      `;
      const sessionResult = await pool.query(sessionQuery, [userId]);
      const recentSession = sessionResult.rows[0] || { problems_correct: 0, problems_attempted: 0 };
      
      // Get achievements the user doesn't have yet
      const achievementsQuery = `
        SELECT a.*
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.achievement_id = ua.achievement_id AND ua.user_id = $1
        WHERE ua.user_id IS NULL
        ORDER BY a.points_required ASC
      `;
      const achievementsResult = await pool.query(achievementsQuery, [userId]);
      
      // Check each achievement with stricter criteria
      for (const achievement of achievementsResult.rows) {
        let earned = false;
        
        // Apply proper achievement criteria
        if (achievement.name === 'Math Novice' && problems_solved >= 5) {
          earned = true;
        } else if (achievement.name === 'Math Explorer' && total_points >= 200) {
          earned = true;
        } else if (achievement.name === 'Math Wizard' && problems_solved >= 50) {
          earned = true;
        } else if (achievement.name === 'Perfect Streak' && 
                  recentSession.problems_correct >= 10 && 
                  recentSession.problems_correct === recentSession.problems_attempted) {
          earned = true;
        } else if (achievement.name === 'Speed Demon') {
          // For Speed Demon, need to check time taken in recent session
          const speedQuery = `
            SELECT session_id, EXTRACT(EPOCH FROM (ended_at - started_at)) AS duration_seconds
            FROM game_sessions
            WHERE user_id = $1 AND problems_correct >= 5
            ORDER BY ended_at DESC
            LIMIT 1
          `;
          const speedResult = await pool.query(speedQuery, [userId]);
          if (speedResult.rows.length > 0 && speedResult.rows[0].duration_seconds < 60) {
            earned = true;
          }
        }
        
        if (earned) {
          // Award the achievement
          await pool.query(
            'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)',
            [userId, achievement.achievement_id]
          );
          newAchievements.push(achievement);
        }
      }
      
      res.json({
        newAchievements,
        hasNewAchievements: newAchievements.length > 0
      });
    } catch (error) {
      console.error('Error checking achievements:', error);
      res.status(500).json({ message: 'Server error when checking achievements' });
    }
  }
};

module.exports = achievementController;