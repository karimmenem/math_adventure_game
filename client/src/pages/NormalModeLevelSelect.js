import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import soundService from '../services/soundService';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import config from '../config'; // Import the config file

const NormalModeLevelSelect = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get user from context
  const [availableLevels, setAvailableLevels] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLevelsAndProgress = async () => {
      try {
        // Get token from storage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found');
          setError('Please log in to access game levels');
          setLoading(false);
          // Redirect to login if no token
          navigate('/signin');
          return;
        }
        
        console.log('Token found:', token ? 'Yes' : 'No');
        
        // Fetch available levels and user progress
        const [levelsResponse, progressResponse] = await Promise.all([
          fetch(`${config.API_URL}/api/users/levels`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${config.API_URL}/api/users/progress`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        // Check for auth errors specifically
        if (levelsResponse.status === 401 || progressResponse.status === 401) {
          console.error('Authentication token is invalid or expired');
          localStorage.removeItem('token'); // Clear invalid token
          setError('Your session has expired. Please log in again.');
          setLoading(false);
          navigate('/signin');
          return;
        }

        if (!levelsResponse.ok || !progressResponse.ok) {
          throw new Error('Failed to fetch levels or user progress');
        }

        const levelsData = await levelsResponse.json();
        const progressData = await progressResponse.json();

        console.log('Levels Data:', levelsData);
        console.log('Progress Data:', progressData);

        // Process levels data to determine which ones are unlocked
        const processedLevels = levelsData.map(level => ({
          ...level,
          unlocked: level.required_points <= progressData.total_points
        }));

        // Sort levels by their level_id for proper order
        const sortedLevels = processedLevels.sort((a, b) => a.level_id - b.level_id);
        
        console.log('Processed Levels:', sortedLevels);
        
        setAvailableLevels(sortedLevels);
        setUserPoints(progressData.total_points);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching levels:', error);
        setError('Unable to load levels. Please try again.');
        setLoading(false);
      }
    };

    fetchLevelsAndProgress();
  }, [navigate]); // Added navigate to dependencies

  const handleLevelSelect = (level) => {
    // Only allow selecting unlocked levels
    if (!level.unlocked) {
      soundService.play('incorrect');
      return;
    }
    
    soundService.play('click');
    navigate(`/game?mode=normal&levelId=${level.level_id}`);
  };

  if (loading) return <div className="loading">Loading levels...</div>;
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button 
          className="back-button" 
          onClick={() => {
            soundService.play('click');
            navigate('/game-mode');
          }}
        >
          Back to Game Modes
        </button>
      </div>
    );
  }

  return (
    <div className="normal-mode-level-select">
      <h1>Select Level</h1>
      <p className="total-points">Your Total Points: {userPoints}</p>

      <div className="levels-grid">
        {availableLevels.length > 0 ? (
          availableLevels.map(level => (
            <div 
              key={level.level_id} 
              className={`level-card ${level.unlocked ? 'unlocked' : 'locked'}`}
              onClick={() => handleLevelSelect(level)}
            >
              <h2>{level.level_name}</h2>
              <p className="level-description">{level.description}</p>
              <div className="level-details">
                <span className="level-category">Category: {level.category}</span>
                <span className="level-difficulty">Difficulty: {level.max_difficulty}/3</span>
                <span className="level-points-required">
                  {level.unlocked 
                    ? 'Unlocked' 
                    : `Requires ${level.required_points} points (You have: ${userPoints})`}
                </span>
              </div>
              {!level.unlocked && (
                <div className="locked-overlay">
                  <span className="lock-icon">🔒</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-levels-message">
            <p>No levels available. Keep solving problems to unlock levels!</p>
          </div>
        )}
      </div>

      <button 
        className="back-button" 
        onClick={() => {
          soundService.play('click');
          navigate('/game-mode');
        }}
      >
        Back to Game Modes
      </button>
    </div>
  );
};

export default NormalModeLevelSelect;