import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import soundService from '../services/soundService';
import animationUtils from '../utils/animationUtils';
import config from '../config';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [userProgress, setUserProgress] = useState(null);
  const [highScores, setHighScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prevProgress, setPrevProgress] = useState(null);
  
  // Refs for counter animations
  const levelRef = useRef(null);
  const pointsRef = useRef(null);
  const solvedRef = useRef(null);

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
        const progressResponse = await fetch(`${config.API_URL}/api/users/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!progressResponse.ok) {
          throw new Error('Failed to fetch user progress');
        }

        const progressData = await progressResponse.json();
        
        // Store previous progress for animations
        setPrevProgress(userProgress);
        setUserProgress(progressData);
        
        // Fetch high scores if available
        try {
          const highScoresResponse = await fetch(`${config.API_URL}/api/users/high-scores`, {
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
  
  // Animate counters when userProgress changes
  useEffect(() => {
    if (!loading && userProgress && prevProgress) {
      // Animate level if changed
      if (levelRef.current && prevProgress.current_level !== userProgress.current_level) {
        animationUtils.animateCounter(
          levelRef.current, 
          prevProgress.current_level, 
          userProgress.current_level, 
          1000
        );
      }
      
      // Animate points if changed
      if (pointsRef.current && prevProgress.total_points !== userProgress.total_points) {
        animationUtils.animateCounter(
          pointsRef.current, 
          prevProgress.total_points, 
          userProgress.total_points, 
          1000
        );
      }
      
      // Animate problems solved if changed
      if (solvedRef.current && prevProgress.problems_solved !== userProgress.problems_solved) {
        animationUtils.animateCounter(
          solvedRef.current, 
          prevProgress.problems_solved, 
          userProgress.problems_solved, 
          1000
        );
      }
    }
  }, [userProgress, prevProgress, loading]);
  
  // Show mascot character greeting on dashboard
  useEffect(() => {
    if (!loading && userProgress) {
      setTimeout(() => {
        animationUtils.showCharacterReaction(null); // Show neutral mascot greeting
      }, 500);
    }
  }, [loading, userProgress]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {loading ? (
          <p className="loading">Loading your progress...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="user-stats">
              <div className="stat-card" onClick={() => animationUtils.showCharacterReaction('levelUp')}>
                <h3>Current Level</h3>
                <p className="stat-value" ref={levelRef}>{userProgress?.current_level}</p>
              </div>
              
              <div className="stat-card">
                <h3>Total Points</h3>
                <p className="stat-value" ref={pointsRef}>{userProgress?.total_points}</p>
              </div>
              
              <div className="stat-card">
                <h3>Problems Solved</h3>
                <p className="stat-value" ref={solvedRef}>{userProgress?.problems_solved}</p>
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
              <Link to="/game-mode" className="start-game-btn">
                Start New Game
              </Link>
              <Link to="/achievements" className="view-achievements-btn">
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