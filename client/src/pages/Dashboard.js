import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import soundService from '../services/soundService';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [userProgress, setUserProgress] = useState(null);
  const [highScores, setHighScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // Fetch user progress
        const progressResponse = await fetch('http://localhost:5000/api/users/progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!progressResponse.ok) {
          throw new Error('Failed to fetch user progress');
        }

        const progressData = await progressResponse.json();
        setUserProgress(progressData);
        
        // Fetch high scores if available
        try {
          const highScoresResponse = await fetch('http://localhost:5000/api/users/high-scores', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (highScoresResponse.ok) {
            const highScoresData = await highScoresResponse.json();
            setHighScores(highScoresData);
          }
        } catch (highScoreError) {
          // Don't fail if high scores aren't available
          console.log('High scores not available yet');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load your progress. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
    
    // Preload sounds when dashboard loads
    soundService.preloadSounds();
  }, []);

  const handleLogout = () => {
    soundService.play('click');
    logout();
  };
  
  const handleStartGame = () => {
    soundService.play('click');
  };
  
  const handleViewAchievements = () => {
    soundService.play('click');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <p className="loading">Loading your progress...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="user-stats">
              <div className="stat-card">
                <h3>Current Level</h3>
                <p className="stat-value">{userProgress?.current_level}</p>
              </div>
              
              <div className="stat-card">
                <h3>Total Points</h3>
                <p className="stat-value">{userProgress?.total_points}</p>
              </div>
              
              <div className="stat-card">
                <h3>Problems Solved</h3>
                <p className="stat-value">{userProgress?.problems_solved}</p>
              </div>
            </div>
            
            {highScores && highScores.blitz > 0 && (
              <div className="high-scores">
                <h3>Your Best Scores</h3>
                <div className="high-score-card">
                  <div className="high-score-mode">Blitz Mode</div>
                  <div className="high-score-value">{highScores.blitz}</div>
                  <div className="high-score-label">problems in 60 seconds</div>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <Link to="/game-mode" className="start-game-btn" onClick={handleStartGame}>
                Start New Game
              </Link>
              <Link to="/achievements" className="view-achievements-btn" onClick={handleViewAchievements}>
                View Achievements
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;