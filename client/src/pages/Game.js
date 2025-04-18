import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Game = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Add level information state
  const [levelInfo, setLevelInfo] = useState(null);
  const [session, setSession] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);

  // Start game session when component mounts
  useEffect(() => {
    const startGame = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Start a new game session
        const sessionResponse = await fetch('http://localhost:5000/api/game/start', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!sessionResponse.ok) {
          throw new Error('Failed to start game session');
        }
        
        const sessionData = await sessionResponse.json();
        setSession(sessionData.session);
        
        // Get problems for this game
        const problemsResponse = await fetch('http://localhost:5000/api/game/problems', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!problemsResponse.ok) {
          throw new Error('Failed to fetch problems');
        }
        
        const problemsData = await problemsResponse.json();
        setProblems(problemsData.problems);
        setLevelInfo(problemsData.levelInfo);
        setLoading(false);
      } catch (error) {
        console.error('Game initialization error:', error);
        setError('Failed to start the game. Please try again.');
        setLoading(false);
      }
    };
    
    startGame();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  // Define the endGame function
  const endGame = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/game/end', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: session.session_id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to end game session');
      }
      
      const data = await response.json();
      setSummary(data.summary);
      setGameOver(true);
    } catch (error) {
      console.error('End game error:', error);
      setError('Failed to end the game. Please try again.');
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      if (!selectedAnswer) return;
      
      const token = localStorage.getItem('token');
      const currentProblem = problems[currentProblemIndex];
      
      const response = await fetch('http://localhost:5000/api/game/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: session.session_id,
          problemId: currentProblem.problem_id,
          answer: selectedAnswer
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }
      
      const data = await response.json();
      setResult(data);
      
      // Show level up animation if user leveled up
      if (data.leveledUp) {
        setLevelUpAnimation(true);
        setTimeout(() => {
          setLevelUpAnimation(false);
        }, 3000);
      }
      
      // Show result for 2 seconds then move to next problem
      setTimeout(() => {
        setResult(null);
        setSelectedAnswer('');
        
        if (currentProblemIndex < problems.length - 1) {
          setCurrentProblemIndex(prevIndex => prevIndex + 1);
        } else {
          endGame();
        }
      }, data.leveledUp ? 4000 : 2000); // Wait longer if level up animation is showing
    } catch (error) {
      console.error('Submit answer error:', error);
      setError('Failed to submit your answer. Please try again.');
    }
  };

  const returnToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="loading">Loading game...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={returnToDashboard}>Return to Dashboard</button>
      </div>
    );
  }

  if (gameOver && summary) {
    return (
      <div className="game-over-container">
        <h2>Game Complete!</h2>
        <div className="game-summary">
          <p>Problems Attempted: {summary.problems_attempted}</p>
          <p>Correct Answers: {summary.problems_correct}</p>
          <p>Points Earned: {summary.points_earned}</p>
          <p>Time Taken: {Math.floor(summary.duration_seconds / 60)}m {Math.floor(summary.duration_seconds % 60)}s</p>
        </div>
        <button onClick={returnToDashboard} className="return-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Get the current problem
  const currentProblem = problems[currentProblemIndex];

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Math Adventure</h2>
        {levelInfo && (
          <div className="level-info">
            <span className="level-name">{levelInfo.level_name}</span>
            <p className="level-description">{levelInfo.description}</p>
          </div>
        )}
        <div className="progress-indicator">
          Problem {currentProblemIndex + 1} of {problems.length}
        </div>
      </div>

      {levelUpAnimation && (
        <div className="level-up-animation">
          <h2>Level Up!</h2>
          <p>Congratulations! You've reached {result?.newLevel?.name}!</p>
        </div>
      )}

      {currentProblem && (
        <div className="problem-card">
          <h3 className="problem-category">{currentProblem.category}</h3>
          <p className="problem-question">{currentProblem.question}</p>
          
          <div className="options-container">
            {currentProblem.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          
          {result && (
            <div className={`result-feedback ${result.correct ? 'correct' : 'incorrect'}`}>
              {result.correct 
                ? `Correct! +${result.pointsEarned} points` 
                : `Incorrect. The correct answer is ${result.correctAnswer}`}
            </div>
          )}
          
          <button 
            className="submit-btn"
            disabled={!selectedAnswer || result !== null}
            onClick={handleSubmitAnswer}
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;