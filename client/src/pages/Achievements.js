import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Achievements = () => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch all achievements
        const allResponse = await fetch('http://localhost:5000/api/achievements/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!allResponse.ok) {
          throw new Error('Failed to fetch achievements');
        }
        
        // Fetch user's earned achievements
        const userResponse = await fetch('http://localhost:5000/api/achievements/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user achievements');
        }
        
        const allData = await allResponse.json();
        const userData = await userResponse.json();
        
        setAllAchievements(allData);
        setUserAchievements(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setError('Failed to load achievements. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, []);

  // Check if user has earned an achievement
  const hasEarned = (achievementId) => {
    return userAchievements.some(a => a.achievement_id === achievementId);
  };

  // Format date 
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="achievements-container">
      <header className="achievements-header">
        <h1>My Achievements</h1>
        <Link to="/dashboard" className="back-btn">
          Back to Dashboard
        </Link>
      </header>

      {loading ? (
        <p className="loading">Loading achievements...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="achievements-grid">
          {allAchievements.map(achievement => {
            const earned = hasEarned(achievement.achievement_id);
            const userAchievement = userAchievements.find(
              a => a.achievement_id === achievement.achievement_id
            );
            
            return (
              <div 
                key={achievement.achievement_id} 
                className={`achievement-card ${earned ? 'earned' : 'locked'}`}
              >
                <div className="badge-icon">
                  <img 
                    src={`/icons/${achievement.badge_icon}`} 
                    alt={achievement.name}
                    onError={(e) => {
                      e.target.src = earned 
                        ? '/icons/default_badge.png' 
                        : '/icons/locked_badge.png';
                    }}
                  />
                </div>
                <div className="achievement-details">
                  <h3>{achievement.name}</h3>
                  <p className="description">{achievement.description}</p>
                  <p className="points">
                    {earned ? 'Earned' : `Requires ${achievement.points_required} points`}
                  </p>
                  {earned && userAchievement && (
                    <p className="earned-date">
                      Earned on {formatDate(userAchievement.earned_at)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Achievements;