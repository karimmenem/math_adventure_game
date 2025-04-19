import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import soundService from '../services/soundService';

const Game = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameMode = searchParams.get('mode') || 'normal';
  
  // State variables
  const [newAchievements, setNewAchievements] = useState([]);
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);
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
  
  // Timer-related states
  const [timeLeft, setTimeLeft] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [problemStartTime, setProblemStartTime] = useState(null);
  const [blitzScore, setBlitzScore] = useState(0);
  const timerRef = useRef(null);
  
  // Initialize game based on mode
  useEffect(() => {
    let initialTime = null;
    
    if (gameMode === 'timed') {
      initialTime = 30; // 30 seconds per problem
    } else if (gameMode === 'blitz') {
      initialTime = 60; // 60 seconds for the entire game
    }
    
    setTimeLeft(initialTime);
    setTotalTime(initialTime);
  }, [gameMode]);
  
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
          },
          body: JSON.stringify({ mode: gameMode })
        });
        
        if (!sessionResponse.ok) {
          throw new Error('Failed to start game session');
        }
        
        const sessionData = await sessionResponse.json();
        setSession(sessionData.session);
        
        // Get problems for this game
        const problemsResponse = await fetch(`http://localhost:5000/api/game/problems?mode=${gameMode}`, {
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
        
        // Play game start sound
        soundService.play('gameStart');
        
        // Set problem start time for timed mode
        if (gameMode === 'timed' || gameMode === 'blitz') {
          setProblemStartTime(Date.now());
          startTimer();
        }
      } catch (error) {
        console.error('Game initialization error:', error);
        setError('Failed to start the game. Please try again.');
        setLoading(false);
      }
    };
    
    startGame();
    
    // Cleanup function to clear timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameMode]);
  
  // Timer function
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Time's up
          clearInterval(timerRef.current);
          
          if (gameMode === 'timed') {
            // In timed mode, time up on current problem means incorrect
            handleTimeUp();
            return 0;
          } else if (gameMode === 'blitz') {
            // In blitz mode, time up means game over
            endGame();
            return 0;
          }
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Handle time up for timed mode
  const handleTimeUp = () => {
    if (gameMode === 'timed') {
      const currentProblem = problems[currentProblemIndex];
      soundService.play('incorrect');
      
      setResult({
        correct: false,
        pointsEarned: 0,
        correctAnswer: currentProblem.correct_answer
      });
      
      // Move to next problem after showing result
      setTimeout(() => {
        setResult(null);
        setSelectedAnswer('');
        
        if (currentProblemIndex < problems.length - 1) {
          setCurrentProblemIndex(prevIndex => prevIndex + 1);
          setTimeLeft(totalTime); // Reset timer
          setProblemStartTime(Date.now());
          startTimer();
        } else {
          endGame();
        }
      }, 2000);
    }
  };
  
  const handleAnswerSelect = (answer) => {
    soundService.play('click');
    setSelectedAnswer(answer);
  };
  
  // Define the endGame function
  const endGame = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/game/end', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: session.session_id,
          mode: gameMode,
          blitzScore: gameMode === 'blitz' ? blitzScore : undefined
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to end game session');
      }
      
      const data = await response.json();
      setSummary(data.summary);
      setGameOver(true);
      soundService.play('gameEnd');
      checkAchievements();
    } catch (error) {
      console.error('End game error:', error);
      setError('Failed to end the game. Please try again.');
    }
  };
  
  const checkAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/achievements/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check achievements');
      }
      
      const data = await response.json();
      
      // Show achievement notification if user earned a new achievement
      if (data.hasNewAchievements) {
        setNewAchievements(data.newAchievements);
        setShowAchievementNotification(true);
        soundService.play('achievement');
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowAchievementNotification(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Achievement check error:', error);
    }
  };
  
  const handleSubmitAnswer = async () => {
    try {
      if (!selectedAnswer) return;
      
      const token = localStorage.getItem('token');
      const currentProblem = problems[currentProblemIndex];
      
      // Calculate time taken for this problem (for timed modes)
      let timeTaken = 0;
      if (gameMode === 'timed' || gameMode === 'blitz') {
        timeTaken = (Date.now() - problemStartTime) / 1000;
      }
      
      const response = await fetch('http://localhost:5000/api/game/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: session.session_id,
          problemId: currentProblem.problem_id,
          answer: selectedAnswer,
          timeTaken: timeTaken,
          mode: gameMode
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }
      
      const data = await response.json();
      setResult(data);
      
      // For blitz mode, update score
      if (gameMode === 'blitz' && data.correct) {
        setBlitzScore(prev => prev + 1);
      }
      
      // Play appropriate sound based on whether answer is correct
      if (data.correct) {
        soundService.play('correct');
      } else {
        soundService.play('incorrect');
      }
      
      // Show level up animation if user leveled up
      if (data.leveledUp) {
        setLevelUpAnimation(true);
        soundService.play('levelUp');
        setTimeout(() => {
          setLevelUpAnimation(false);
        }, 3000);
      }
      
      // Show result for 2 seconds then move to next problem
      setTimeout(() => {
        setResult(null);
        setSelectedAnswer('');
        
        if (currentProblemIndex < problems.length - 1 && (gameMode !== 'blitz' || timeLeft > 0)) {
          setCurrentProblemIndex(prevIndex => prevIndex + 1);
          
          // Reset timer for timed mode
          if (gameMode === 'timed') {
            setTimeLeft(totalTime);
            setProblemStartTime(Date.now());
            startTimer();
          }
        } else if (gameMode === 'blitz' && timeLeft > 0) {
          // In blitz mode, get a new problem as long as there's time left
          setCurrentProblemIndex(prevIndex => prevIndex + 1);
          
          // If we've used all problems, cycle back to the beginning
          if (currentProblemIndex >= problems.length - 1) {
            setCurrentProblemIndex(0);
          }
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
    soundService.play('click');
    navigate('/dashboard');
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
        
        {gameMode === 'blitz' ? (
          <div className="blitz-summary">
            <div className="blitz-score">{blitzScore}</div>
            <p className="blitz-label">Problems Solved in 60 Seconds</p>
            
            {summary.isHighScore && (
              <div className="high-score-badge">New High Score!</div>
            )}
          </div>
        ) : (
          <div className="game-summary">
            <p>Problems Attempted: {summary.problems_attempted}</p>
            <p>Correct Answers: {summary.problems_correct}</p>
            <p>Points Earned: {summary.points_earned}</p>
            <p>Time Taken: {Math.floor(summary.duration_seconds / 60)}m {Math.floor(summary.duration_seconds % 60)}s</p>
          </div>
        )}
        
        <div className="game-over-buttons">
          <button onClick={() => navigate('/game-mode')} className="play-again-btn">
            Play Again
          </button>
          <button onClick={returnToDashboard} className="return-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Get the current problem
  const currentProblem = problems[currentProblemIndex];
  
  return (
    <div className="game-container">
      {showAchievementNotification && (
        <div className="achievement-notification">
          <h3>Achievement Unlocked!</h3>
          {newAchievements.map(achievement => (
            <div key={achievement.achievement_id} className="new-achievement">
              <p>{achievement.name}</p>
              <p className="achievement-desc">{achievement.description}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="game-header">
        <div className="game-header-top">
          <h2>
            Math Adventure
            {gameMode === 'timed' && <span className="mode-badge">Timed</span>}
            {gameMode === 'blitz' && <span className="mode-badge blitz">Blitz</span>}
          </h2>
          
          {(gameMode === 'timed' || gameMode === 'blitz') && (
            <div className={`timer ${timeLeft <= 5 ? 'timer-warning' : ''}`}>
              {gameMode === 'blitz' && (
                <div className="blitz-counter">Score: {blitzScore}</div>
              )}
              <div className="timer-display">{formatTime(timeLeft)}</div>
              {gameMode === 'timed' && (
                <div className="timer-bar">
                  <div 
                    className="timer-progress" 
                    style={{ width: `${(timeLeft / totalTime) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {gameMode === 'normal' && levelInfo && (
          <div className="level-info">
            <span className="level-name">{levelInfo.level_name}</span>
            <p className="level-description">{levelInfo.description}</p>
          </div>
        )}
        
        <div className="progress-indicator">
          {gameMode !== 'blitz' ? (
            `Problem ${currentProblemIndex + 1} of ${problems.length}`
          ) : (
            `Time remaining: ${formatTime(timeLeft)}`
          )}
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