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
  // Update the getProblems method in gameController.js
  async getProblems(req, res) {
    try {
      const userId = req.user.userId;
      const mode = req.query.mode || 'normal';
      
      // Get user's current level and points
      const userQuery = 'SELECT current_level, total_points FROM user_progress WHERE user_id = $1';
      const userResult = await pool.query(userQuery, [userId]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      const userProgress = userResult.rows[0];
      
      // Get level information based on user's points (for normal mode)
      let levelInfo = null;
      if (mode === 'normal') {
        const levelQuery = `
          SELECT level_id, level_name, description, category, max_difficulty 
          FROM levels 
          WHERE required_points <= $1 
          ORDER BY required_points DESC 
          LIMIT 1
        `;
        const levelResult = await pool.query(levelQuery, [userProgress.total_points]);
        
        if (levelResult.rows.length === 0) {
          return res.status(404).json({ message: 'Level information not found' });
        }
        
        levelInfo = levelResult.rows[0];
      }
      
      // Get problems appropriate for this level/mode
      let problemsQuery;
      let queryParams;
      
      if (mode === 'normal') {
        // For normal mode, get problems based on current level
        problemsQuery = `
          SELECT problem_id, category, difficulty_level, question, options, points
          FROM problems
          WHERE category = $1 AND difficulty_level <= $2
          ORDER BY RANDOM()
          LIMIT 5
        `;
        queryParams = [levelInfo.category, levelInfo.max_difficulty];
      } else if (mode === 'timed' || mode === 'blitz') {
        // For timed or blitz mode, get a mix of problems with varied difficulty
        problemsQuery = `
          SELECT problem_id, category, difficulty_level, question, options, points
          FROM problems
          WHERE difficulty_level <= $1
          ORDER BY RANDOM()
          LIMIT $2
        `;
        // For timed mode, get 5 problems; for blitz mode, get 20 (we'll cycle through them if needed)
        const problemCount = mode === 'blitz' ? 20 : 5;
        // Use current level as max difficulty, but cap at 3 to keep it reasonable
        const maxDifficulty = Math.min(userProgress.current_level, 3);
        queryParams = [maxDifficulty, problemCount];
      }
      
      const problemsResult = await pool.query(problemsQuery, queryParams);
      
      // If we don't have enough problems, supplement with others
      if (problemsResult.rows.length < 5 && mode === 'normal') {
        const supplementalQuery = `
          SELECT problem_id, category, difficulty_level, question, options, points
          FROM problems
          WHERE category != $1 AND difficulty_level <= $2
          ORDER BY RANDOM()
          LIMIT $3
        `;
        const supplementalResult = await pool.query(supplementalQuery, [
          levelInfo.category,
          levelInfo.max_difficulty,
          5 - problemsResult.rows.length
        ]);
        
        // Combine the results
        problemsResult.rows = [...problemsResult.rows, ...supplementalResult.rows];
      }
      
      // Send appropriate response based on mode
      if (mode === 'normal') {
        res.json({
          currentLevel: userProgress.current_level,
          levelInfo: levelInfo,
          problems: problemsResult.rows
        });
      } else {
        res.json({
          problems: problemsResult.rows
        });
      }
    } catch (error) {
      console.error('Get problems error:', error);
      res.status(500).json({ message: 'Server error when fetching problems' });
    }
  },
  // Submit answer and update progress
  // Update the submitAnswer method in gameController.js
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