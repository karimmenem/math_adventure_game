import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import soundService from '../services/soundService';

const NormalModeLevelSelect = () => {
  const navigate = useNavigate();
  const [availableLevels, setAvailableLevels] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLevelsAndProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch available levels and user progress
        const [levelsResponse, progressResponse] = await Promise.all([
          fetch('http://localhost:5000/api/users/levels', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:5000/api/users/progress', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!levelsResponse.ok || !progressResponse.ok) {
          throw new Error('Failed to fetch levels or user progress');
        }

        const levelsData = await levelsResponse.json();
        const progressData = await progressResponse.json();

        // Log full data for debugging
        console.log('Levels Data:', levelsData);
        console.log('Progress Data:', progressData);

        // Filter unlocked levels
        const unlockedLevels = levelsData.filter(level => level.unlocked);
        
        console.log('Unlocked Levels:', unlockedLevels);
        
        setAvailableLevels(unlockedLevels);
        setUserPoints(progressData.total_points);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching levels:', error);
        setError('Unable to load levels. Please try again.');
        setLoading(false);
      }
    };

    fetchLevelsAndProgress();
  }, []);

  const handleLevelSelect = (level) => {
    soundService.play('click');
    navigate(`/game?mode=normal&levelId=${level.level_id}`);
  };

  if (loading) return <div className="loading">Loading levels...</div>;
  if (error) return <div className="error">{error}</div>;

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
                <span className="level-difficulty">Difficulty: {level.max_difficulty}/5</span>
                <span className="level-points-required">
                  {level.unlocked 
                    ? 'Unlocked' 
                    : `Requires ${level.required_points} points`}
                </span>
              </div>
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