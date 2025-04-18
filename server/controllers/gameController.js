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
      
      // Get user's current level and points
      const userQuery = 'SELECT current_level, total_points FROM user_progress WHERE user_id = $1';
      const userResult = await pool.query(userQuery, [userId]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      const userProgress = userResult.rows[0];
      
      // Get level information based on user's points
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
      
      const levelInfo = levelResult.rows[0];
      
      // Get problems appropriate for this level
      // Enhanced to ensure better randomization
      const problemsQuery = `
        SELECT problem_id, category, difficulty_level, question, options, points
        FROM problems
        WHERE category = $1 AND difficulty_level <= $2
        ORDER BY RANDOM()  -- This ensures proper randomization
        LIMIT 5
      `;
      const problemsResult = await pool.query(problemsQuery, [
        levelInfo.category, 
        levelInfo.max_difficulty
      ]);
      
      // If we don't have enough problems of the exact category, supplement with others
      if (problemsResult.rows.length < 5) {
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
      
      res.json({
        currentLevel: userProgress.current_level,
        levelInfo: levelInfo,
        problems: problemsResult.rows
      });
    } catch (error) {
      console.error('Get problems error:', error);
      res.status(500).json({ message: 'Server error when fetching problems' });
    }
  },
  
  // Submit answer and update progress
  // Update the submitAnswer method in gameController.js
async submitAnswer(req, res) {
  try {
    const { sessionId, problemId, answer } = req.body;
    const userId = req.user.userId;
    
    // Validate the answer
    const problemQuery = 'SELECT correct_answer, points FROM problems WHERE problem_id = $1';
    const problemResult = await pool.query(problemQuery, [problemId]);
    
    if (problemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    const problem = problemResult.rows[0];
    const isCorrect = problem.correct_answer === answer;
    const pointsEarned = isCorrect ? problem.points : 0;
    
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
      const leveledUp = updateResult.rows.length > 0;
      const newLevel = leveledUp ? levelResult.rows[0] : null;
      
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
      const { sessionId } = req.body;
      
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
      
      res.json({
        message: 'Game session ended',
        summary: sessionResult.rows[0]
      });
    } catch (error) {
      console.error('End game error:', error);
      res.status(500).json({ message: 'Server error when ending game' });
    }
  }
};

module.exports = gameController;