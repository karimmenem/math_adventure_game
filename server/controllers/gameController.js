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
      
      // Get user's current level
      const levelQuery = 'SELECT current_level FROM user_progress WHERE user_id = $1';
      const levelResult = await pool.query(levelQuery, [userId]);
      
      if (levelResult.rows.length === 0) {
        return res.status(404).json({ message: 'User progress not found' });
      }
      
      const currentLevel = levelResult.rows[0].current_level;
      
      // Get appropriate problems for the user's level
      const problemsQuery = `
        SELECT problem_id, category, question, options, points
        FROM problems
        WHERE difficulty_level <= $1
        ORDER BY RANDOM()
        LIMIT 5
      `;
      const problemsResult = await pool.query(problemsQuery, [currentLevel]);
      
      res.json({
        level: currentLevel,
        problems: problemsResult.rows
      });
    } catch (error) {
      console.error('Get problems error:', error);
      res.status(500).json({ message: 'Server error when fetching problems' });
    }
  },
  
  // Submit answer and update progress
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
        await pool.query(`
          UPDATE user_progress
          SET total_points = total_points + $1,
              problems_solved = problems_solved + 1
          WHERE user_id = $2
        `, [pointsEarned, userId]);
        
        // Check if user needs level up (every 10 problems)
        const progressResult = await pool.query(
          'SELECT problems_solved FROM user_progress WHERE user_id = $1', 
          [userId]
        );
        
        const problemsSolved = progressResult.rows[0].problems_solved;
        if (problemsSolved % 10 === 0) {
          await pool.query(
            'UPDATE user_progress SET current_level = current_level + 1 WHERE user_id = $1',
            [userId]
          );
        }
      }
      
      res.json({
        correct: isCorrect,
        pointsEarned,
        correctAnswer: isCorrect ? null : problem.correct_answer
      });
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