const pool = require('../config/db');

const gameController = {
  // Start a new game session
  async startGame(req, res) {
    try {
      const userId = req.user.userId;
      
      // Create a new game session
      const sessionQuery = `
        INSERT INTO game_sessions (user_id)
        VALUES ($1)
        RETURNING session_id, started_at
      `;
      const sessionResult = await pool.query(sessionQuery, [userId]);
      const session = sessionResult.rows[0];
      
      res.status(201).json({
        message: 'Game session started',
        session
      });
    } catch (error) {
      console.error('Start game error:', error);
      res.status(500).json({ message: 'Server error when starting game' });
    }
  },
  
  // Get problems based on user level
  async getProblems(req, res) {
    try {
      const userId = req.user.userId;
      const mode = req.query.mode || 'normal';
      const levelId = req.query.levelId;
  
      // Fetch user's total points
      const userProgressQuery = 'SELECT total_points FROM user_progress WHERE user_id = $1';
      const userProgressResult = await pool.query(userProgressQuery, [userId]);
      
      if (userProgressResult.rows.length === 0) {
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      const totalPoints = userProgressResult.rows[0].total_points;
  
      // Handling All Types mode
      if (mode === 'all-types') {
        const currentLevel = Math.min(Math.floor(totalPoints / 100) + 1, 3); // Derive current level from points
        const maxDifficulty = Math.min(currentLevel, 3); // Cap at difficulty 3
  
        // Get random problems from ALL categories
        const problemsQuery = `
          SELECT problem_id, category, difficulty_level, problem_type, question, options, points, correct_answer
          FROM problems
          WHERE difficulty_level <= $1
          ORDER BY RANDOM()
          LIMIT 5
        `;
        
        const problemsResult = await pool.query(problemsQuery, [maxDifficulty]);
        
        return res.json({
          currentLevel: currentLevel,
          levelInfo: { 
            level_name: 'All Types Challenge', 
            description: 'Random problems from all math categories',
            category: 'Mixed'
          },
          problems: problemsResult.rows
        });
      }
  
      // Existing logic for other modes remains the same
      // If no specific level is selected, find the highest unlocked level
      let selectedLevelId;
      if (!levelId) {
        // Find the highest level the user has unlocked based on their points
        const unlockedLevelQuery = `
          SELECT level_id 
          FROM levels 
          WHERE required_points <= $1 
          ORDER BY required_points DESC 
          LIMIT 1
        `;
        const unlockedLevelResult = await pool.query(unlockedLevelQuery, [totalPoints]);
        
        // If no levels unlocked, start with the first level
        selectedLevelId = unlockedLevelResult.rows.length > 0 
          ? unlockedLevelResult.rows[0].level_id 
          : 1; // Default to first level (Addition Beginner)
      } else {
        selectedLevelId = levelId;
      }
  
      // Fetch the specific level details
      const levelQuery = 'SELECT * FROM levels WHERE level_id = $1';
      const levelResult = await pool.query(levelQuery, [selectedLevelId]);
      
      if (levelResult.rows.length === 0) {
        return res.status(404).json({ message: 'Level not found' });
      }
      
      const levelInfo = levelResult.rows[0];
  
      // Validate that the user has enough points to access this level
      if (levelInfo.required_points > totalPoints) {
        return res.status(403).json({ 
          message: 'You have not unlocked this level yet',
          requiredPoints: levelInfo.required_points,
          currentPoints: totalPoints
        });
      }
      
      // Get problems for this specific level
      const problemsQuery = `
        SELECT problem_id, category, difficulty_level, problem_type, question, options, points, correct_answer
        FROM problems
        WHERE 
          category = $1 AND
          difficulty_level = $2
        ORDER BY RANDOM()
        LIMIT 5
      `;
      
      const problemsResult = await pool.query(problemsQuery, [
        levelInfo.category, 
        levelInfo.max_difficulty
      ]);
      
      // If not enough problems found, supplement with similar problems
      if (problemsResult.rows.length < 5) {
        const supplementalQuery = `
          SELECT problem_id, category, difficulty_level, problem_type, question, options, points, correct_answer
          FROM problems
          WHERE 
            category = $1 AND
            difficulty_level <= $2
          ORDER BY RANDOM()
          LIMIT ${5 - problemsResult.rows.length}
        `;
        
        const supplementalResult = await pool.query(supplementalQuery, [
          levelInfo.category, 
          levelInfo.max_difficulty
        ]);
        
        problemsResult.rows = [...problemsResult.rows, ...supplementalResult.rows];
      }
      
      // Find next level (if exists)
      const nextLevelQuery = `
        SELECT level_id, level_name 
        FROM levels 
        WHERE required_points > $1 
        ORDER BY required_points 
        LIMIT 1
      `;
      const nextLevelResult = await pool.query(nextLevelQuery, [totalPoints]);
      
      return res.json({
        currentLevel: levelInfo.level_id,
        levelInfo: levelInfo,
        problems: problemsResult.rows,
        nextLevel: nextLevelResult.rows.length > 0 ? {
          id: nextLevelResult.rows[0].level_id,
          name: nextLevelResult.rows[0].level_name,
          requiredPoints: nextLevelResult.rows[0].required_points
        } : null
      });
    } catch (error) {
      console.error('Get problems error:', error);
      res.status(500).json({ message: 'Server error when fetching problems' });
    }
  },

  // Get practice problems by specific problem types
  async getPracticeProblems(req, res) {
    try {
      const userId = req.user.userId;
      const problemTypes = req.query.problemTypes ? req.query.problemTypes.split(',') : [];
      
      // Log for debugging
      console.log('Practice mode requested with problem types:', problemTypes);
      
      // Get user's current level for difficulty capping
      const userQuery = 'SELECT current_level FROM user_progress WHERE user_id = $1';
      const userResult = await pool.query(userQuery, [userId]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      const currentLevel = userResult.rows[0].current_level;
      const maxDifficulty = Math.min(currentLevel, 3); // Cap at difficulty 3
  
      // Build dynamic query for problem selection
      let problemsQuery;
      let queryParams;
  
      if (problemTypes.length > 0) {
        // Create an array of conditions to match both category and problem_type
        const conditions = problemTypes.map((type, index) => 
          `(LOWER(category) = LOWER($${index + 2}) OR LOWER(problem_type) = LOWER($${index + 2}))`
        ).join(' OR ');
  
        problemsQuery = `
          SELECT problem_id, category, difficulty_level, problem_type, question, options, correct_answer, points
          FROM problems
          WHERE difficulty_level <= $1 AND (${conditions})
          ORDER BY RANDOM()
          LIMIT 5
        `;
  
        // Combine maxDifficulty with problem types for query parameters
        queryParams = [maxDifficulty, ...problemTypes];
      } else {
        // No problem types selected - return empty result
        return res.json({
          problems: [],
          practiceMode: true,
          problemTypes: problemTypes
        });
      }
  
      console.log('Practice mode query:', problemsQuery);
      console.log('Practice mode params:', queryParams);
  
      const problemsResult = await pool.query(problemsQuery, queryParams);
      console.log('Problems found count:', problemsResult.rows.length);
  
      // If no problems found with selected types
      if (problemsResult.rows.length === 0) {
        return res.json({
          problems: [],
          practiceMode: true,
          problemTypes: problemTypes,
          message: 'No problems found for selected types'
        });
      }
  
      // Send response
      res.json({
        problems: problemsResult.rows,
        practiceMode: true,
        problemTypes: problemTypes
      });
    } catch (error) {
      console.error('Get practice problems error:', error);
      res.status(500).json({ message: 'Server error when fetching practice problems' });
    }
  },
  
  // Submit answer and update progress
  async submitAnswer(req, res) {
    try {
      const { sessionId, problemId, answer, timeTaken, mode } = req.body;
      const userId = req.user.userId;
      
      // Validate the answer
      const problemQuery = 'SELECT correct_answer, points FROM problems WHERE problem_id = $1';
      const problemResult = await pool.query(problemQuery, [problemId]);
      
      if (problemResult.rows.length === 0) {
        return res.status(404).json({ message: 'Problem not found' });
      }
      
      const problem = problemResult.rows[0];
      const isCorrect = problem.correct_answer === answer;
      
      // Calculate points based on mode and time taken
      let pointsEarned = 0;
      if (isCorrect) {
        if (mode === 'normal') {
          pointsEarned = problem.points;
        } else if (mode === 'timed') {
          // For timed mode, award bonus points for fast answers
          // Base points + up to 50% bonus for speed
          const timeBonus = Math.max(0, 1 - (timeTaken / 30)); // 0 to 1 scale based on 30 second timer
          pointsEarned = Math.round(problem.points * (1 + (timeBonus * 0.5)));
        } else if (mode === 'blitz') {
          // Fixed points for blitz mode
          pointsEarned = 10;
        }
      }
      
      // Update game session
      await pool.query(`
        UPDATE game_sessions
        SET problems_attempted = problems_attempted + 1,
            problems_correct = problems_correct + $1,
            points_earned = points_earned + $2
        WHERE session_id = $3
      `, [isCorrect ? 1 : 0, pointsEarned, sessionId]);
      
      // Update user progress if answer is correct
      if (isCorrect) {
        // Add points and increment problems solved
        await pool.query(`
          UPDATE user_progress
          SET total_points = total_points + $1,
              problems_solved = problems_solved + 1
          WHERE user_id = $2
          RETURNING total_points, problems_solved
        `, [pointsEarned, userId]);
        
        // Only check for level ups in normal mode
        let leveledUp = false;
        let newLevel = null;
        
        if (mode === 'normal') {
          // Check if user has earned a new level
          const userPointsQuery = 'SELECT total_points FROM user_progress WHERE user_id = $1';
          const userPointsResult = await pool.query(userPointsQuery, [userId]);
          const totalPoints = userPointsResult.rows[0].total_points;
          
          // Find the appropriate level based on points
          const levelQuery = `
            SELECT level_id, level_name 
            FROM levels 
            WHERE required_points <= $1 
            ORDER BY required_points DESC 
            LIMIT 1
          `;
          const levelResult = await pool.query(levelQuery, [totalPoints]);
          const newLevelId = levelResult.rows[0].level_id;
          
          // Update user's level if it has changed
          const updateResult = await pool.query(
            'UPDATE user_progress SET current_level = $1 WHERE user_id = $2 AND current_level != $1 RETURNING current_level',
            [newLevelId, userId]
          );
          
          // Check if user leveled up
          leveledUp = updateResult.rows.length > 0;
          newLevel = leveledUp ? levelResult.rows[0] : null;
        }
        
        return res.json({
          correct: isCorrect,
          pointsEarned,
          leveledUp,
          newLevel: leveledUp ? {
            id: newLevel.level_id,
            name: newLevel.level_name
          } : null
        });
      } else {
        // Return result for incorrect answer
        return res.json({
          correct: false,
          pointsEarned: 0,
          correctAnswer: problem.correct_answer
        });
      }
    } catch (error) {
      console.error('Submit answer error:', error);
      res.status(500).json({ message: 'Server error when submitting answer' });
    }
  },
  
  // End game session
  async endGame(req, res) {
    try {
      const { sessionId, mode, blitzScore } = req.body;
      const userId = req.user.userId;
      
      // Update session with end time
      await pool.query(
        'UPDATE game_sessions SET ended_at = CURRENT_TIMESTAMP WHERE session_id = $1',
        [sessionId]
      );
      
      // Get session summary
      const sessionQuery = `
        SELECT problems_attempted, problems_correct, points_earned,
               EXTRACT(EPOCH FROM (ended_at - started_at)) AS duration_seconds
        FROM game_sessions
        WHERE session_id = $1
      `;
      const sessionResult = await pool.query(sessionQuery, [sessionId]);
      
      if (sessionResult.rows.length === 0) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      let isHighScore = false;
      
      // For blitz mode, check if this is a new high score
      if (mode === 'blitz' && blitzScore) {
        // Check if we need to create high_scores table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS high_scores (
            score_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            game_mode VARCHAR(20) NOT NULL,
            score INTEGER NOT NULL,
            achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Get current high score for this user in blitz mode
        const highScoreQuery = `
          SELECT score FROM high_scores 
          WHERE user_id = $1 AND game_mode = 'blitz'
          ORDER BY score DESC
          LIMIT 1
        `;
        const highScoreResult = await pool.query(highScoreQuery, [userId]);
        
        const currentHighScore = highScoreResult.rows.length > 0 ? highScoreResult.rows[0].score : 0;
        
        // If this is a new high score, save it
        if (blitzScore > currentHighScore) {
          await pool.query(`
            INSERT INTO high_scores (user_id, game_mode, score)
            VALUES ($1, 'blitz', $2)
          `, [userId, blitzScore]);
          
          isHighScore = true;
        }
      }
      
      res.json({
        message: 'Game session ended',
        summary: {
          ...sessionResult.rows[0],
          isHighScore
        }
      });
    } catch (error) {
      console.error('End game error:', error);
      res.status(500).json({ message: 'Server error when ending game' });
    }
  }
};

module.exports = gameController;