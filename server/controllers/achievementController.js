const pool = require('../config/db');

const achievementController = {
  // Get all achievements
  async getAllAchievements(req, res) {
    try {
      const result = await pool.query('SELECT * FROM achievements ORDER BY points_required ASC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching all achievements:', error);
      res.status(500).json({ message: 'Error fetching achievements' });
    }
  },

  // Get achievements for a specific user
  async getUserAchievements(req, res) {
    try {
      const userId = req.user.userId;
      
      const query = `
        SELECT a.*, ua.earned_at 
        FROM achievements a
        JOIN user_achievements ua ON a.achievement_id = ua.achievement_id
        WHERE ua.user_id = $1
        ORDER BY a.points_required ASC
      `;
      
      const result = await pool.query(query, [userId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      res.status(500).json({ message: 'Error fetching your achievements' });
    }
  },

  // Check for new achievements and award them
  async checkAchievements(req, res) {
    try {
      const userId = req.user.userId;
      console.log(`Checking achievements for user ${userId}`);

      if (!userId) {
        console.error('No user ID provided');
        return res.status(400).json({ message: 'User ID is required' });
      }

      const newAchievements = [];
      
      // Get user's current stats
      const statsQuery = `
        SELECT 
          total_points, 
          problems_solved, 
          current_level,
          (SELECT COUNT(DISTINCT category) FROM problems) as total_categories
        FROM user_progress 
        WHERE user_id = $1
      `;
      
      let statsResult;
      try {
        statsResult = await pool.query(statsQuery, [userId]);
      } catch (statsError) {
        console.error('Error in stats query:', statsError);
        return res.status(500).json({ 
          message: 'Error retrieving user stats', 
          error: statsError.message 
        });
      }
      
      if (statsResult.rows.length === 0) {
        console.log(`No user progress found for user ${userId}`);
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      const { 
        total_points, 
        problems_solved, 
        current_level,
        total_categories 
      } = statsResult.rows[0];
      
      console.log('User stats:', { 
        total_points, 
        problems_solved, 
        current_level, 
        total_categories 
      });
      
      // Get recent game session stats
      const sessionQuery = `
        SELECT 
          problems_attempted, 
          problems_correct, 
          game_mode,
          EXTRACT(EPOCH FROM (ended_at - started_at)) AS duration_seconds,
          points_earned
        FROM game_sessions
        WHERE user_id = $1
        ORDER BY ended_at DESC
        LIMIT 1
      `;
      
      let sessionResult;
      try {
        sessionResult = await pool.query(sessionQuery, [userId]);
      } catch (sessionError) {
        console.error('Error in session query:', sessionError);
        return res.status(500).json({ 
          message: 'Error retrieving game session', 
          error: sessionError.message 
        });
      }
      
      const recentSession = sessionResult.rows[0] || { 
        problems_correct: 0, 
        problems_attempted: 0,
        game_mode: null,
        duration_seconds: 0,
        points_earned: 0
      };

      console.log('Recent session:', recentSession);

      // Get completed practice sessions for each category
      const practiceQuery = `
        SELECT DISTINCT category
        FROM game_sessions gs
        JOIN problems p ON gs.problem_id = p.problem_id
        WHERE gs.user_id = $1 AND gs.game_mode = 'practice'
      `;

      let practiceResult;
      try {
        practiceResult = await pool.query(practiceQuery, [userId]);
      } catch (practiceError) {
        console.error('Error in practice query:', practiceError);
        // Continue anyway, just log the error
      }

      const practiceCategories = practiceResult?.rows?.length || 0;

      // Get high score in blitz mode
      const blitzQuery = `
        SELECT MAX(score) as high_score
        FROM high_scores
        WHERE user_id = $1 AND game_mode = 'blitz'
      `;

      let blitzResult;
      try {
        blitzResult = await pool.query(blitzQuery, [userId]);
      } catch (blitzError) {
        console.error('Error in blitz query:', blitzError);
        // Continue anyway, just log the error
      }

      const blitzHighScore = blitzResult?.rows[0]?.high_score || 0;
      console.log('Blitz high score:', blitzHighScore);

      // Get achievements the user doesn't have yet
      const achievementsQuery = `
        SELECT a.*
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.achievement_id = ua.achievement_id AND ua.user_id = $1
        WHERE ua.user_id IS NULL
        ORDER BY a.points_required ASC
      `;
      
      let achievementsResult;
      try {
        achievementsResult = await pool.query(achievementsQuery, [userId]);
      } catch (achievementsError) {
        console.error('Error in achievements query:', achievementsError);
        return res.status(500).json({ 
          message: 'Error retrieving achievements', 
          error: achievementsError.message 
        });
      }
      
      console.log(`Found ${achievementsResult.rows.length} unearned achievements`);

      // Check each achievement based on criteria from your achievements table
      for (const achievement of achievementsResult.rows) {
        let earned = false;
        
        console.log(`Checking achievement: ${achievement.name}`);
        
        // Check achievement criteria based on your table
        switch (achievement.name) {
          case 'Math Novice':
            earned = problems_solved >= 5;
            break;
          case 'Math Explorer':
            earned = total_points >= 200;
            break;
          case 'Math Wizard':
            earned = problems_solved >= 50;
            break;
          case 'Math Master':
            earned = problems_solved >= 100;
            break;
          case 'Math Genius':
            earned = total_points >= 500;
            break;
          case 'Perfect Streak':
            earned = recentSession.problems_correct >= 5 && 
                  recentSession.problems_correct === recentSession.problems_attempted;
            break;
          case 'Speed Demon':
            earned = recentSession.duration_seconds < 60 && 
                   recentSession.problems_correct >= 5;
            break;
          case 'Precision Pro':
            // This would need tracking of game history - simplified for now
            earned = recentSession.problems_correct >= 9 && 
                     recentSession.problems_attempted >= 10 &&
                     (recentSession.problems_correct / recentSession.problems_attempted) >= 0.9;
            break;
          case 'Lightning Learner':
            // Would need to track timed challenges - simplified
            earned = recentSession.game_mode === 'timed';
            break;
          case 'Blitz Champion':
            earned = blitzHighScore >= 20;
            break;
          case 'All-Types Conqueror':
            earned = recentSession.game_mode === 'all-types';
            break;
          case 'Practice Perfectionist':
            earned = practiceCategories >= 5;
            break;
          case 'Beginner Breaker':
            // Would need more data tracking - simplified
            earned = current_level > 3;
            break;
          case 'Intermediate Innovator':
            earned = current_level > 6;
            break;
          case 'Advanced Achiever':
            earned = current_level > 9;
            break;
          // Category-specific achievements
          case 'Addition Ace':
          case 'Subtraction Strategist':
          case 'Multiplication Maestro':
          case 'Division Dynamo':
            // These would need tracking of completed problems by category
            // Simplified implementation for now
            break;
          default:
            console.log(`Unknown achievement: ${achievement.name}`);
        }
        
        if (earned) {
          console.log(`Awarding achievement: ${achievement.name}`);
          try {
            // Award the achievement
            await pool.query(
              'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)',
              [userId, achievement.achievement_id]
            );
            newAchievements.push(achievement);
          } catch (insertError) {
            console.error(`Error inserting achievement ${achievement.name}:`, insertError);
            // Continue with other achievements even if one fails
          }
        }
      }
      
      console.log(`Earned ${newAchievements.length} new achievements`);
      
      res.json({
        newAchievements,
        hasNewAchievements: newAchievements.length > 0
      });
    } catch (error) {
      console.error('Comprehensive error checking achievements:', error);
      res.status(500).json({ 
        message: 'Unexpected server error when checking achievements',
        error: error.message 
      });
    }
  }
};

module.exports = achievementController;