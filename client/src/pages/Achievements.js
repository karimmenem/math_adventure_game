import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import soundService from '../services/soundService';
import animationUtils from '../utils/animationUtils';
import config from '../config';

const Achievements = () => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [animatedAchievements, setAnimatedAchievements] = useState(new Set());

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch all achievements
        const allResponse = await fetch(`${config.API_URL}/api/achievements/all`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!allResponse.ok) {
          throw new Error('Failed to fetch achievements');
        }
        
        // Fetch user's earned achievements
        const userResponse = await fetch(`${config.API_URL}/api/achievements/user`, {
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

  // Get appropriate emoji for achievement
  const getAchievementEmoji = (name) => {
    if (name.includes('Novice')) return '🌟';
    if (name.includes('Explorer')) return '🧭';
    if (name.includes('Wizard')) return '🧙';
    if (name.includes('Streak')) return '🔥';
    if (name.includes('Speed')) return '⚡';
    if (name.includes('Prodigy')) return '🏆';
    if (name.includes('King')) return '👑';
    if (name.includes('Master')) return '🎓';
    if (name.includes('Perfect')) return '💯';
    if (name.includes('Champion')) return '🏅';
    if (name.includes('Learner')) return '📚';
    if (name.includes('Solver')) return '🧩';
    if (name.includes('Thinker')) return '🧠';
    return '🏅'; // Default fallback
  };
  
  const handleBackClick = () => {
    soundService.play('click');
  };
  
  // Handle card click to play animations for earned achievements
  const handleAchievementClick = (achievement) => {
    if (hasEarned(achievement.achievement_id) && !animatedAchievements.has(achievement.achievement_id)) {
      // Add to set of already animated achievements to prevent replaying
      setAnimatedAchievements(prev => new Set([...prev, achievement.achievement_id]));
      
      // Play celebration effect
      soundService.play('achievement');
      
      // Get card element by ID
      const card = document.getElementById(`achievement-${achievement.achievement_id}`);
      if (card) {
        // Create a small celebration effect over the card
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create stars or sparkles
        for (let i = 0; i < 20; i++) {
          const star = document.createElement('div');
          star.className = 'achievement-star';
          star.innerHTML = '⭐'; // Use star emoji
          star.style.position = 'fixed';
          star.style.left = `${centerX}px`;
          star.style.top = `${centerY}px`;
          star.style.fontSize = `${10 + Math.random() * 15}px`;
          star.style.pointerEvents = 'none';
          star.style.zIndex = '1000';
          star.style.opacity = '1';
          document.body.appendChild(star);
          
          // Random angle and distance
          const angle = Math.random() * Math.PI * 2;
          const distance = 30 + Math.random() * 50;
          
          // Animate
          star.animate([
            {
              transform: 'translate(-50%, -50%) scale(0.5)',
              opacity: 0
            },
            {
              transform: 'translate(-50%, -50%) scale(1.5)',
              opacity: 1,
              offset: 0.2
            },
            {
              transform: `translate(
                calc(-50% + ${Math.cos(angle) * distance}px), 
                calc(-50% + ${Math.sin(angle) * distance}px)
              ) scale(0.5)`,
              opacity: 0
            }
          ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
          }).onfinish = () => {
            star.remove();
          };
        }
      }
    }
  };
 
  return (
    <div className="achievements-container">
      <header className="achievements-header">
        <h1>My Achievements</h1>
        <Link to="/dashboard" className="back-btn" onClick={handleBackClick}>
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
                id={`achievement-${achievement.achievement_id}`}
                className={`achievement-card ${earned ? 'earned' : 'locked'}`}
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className="badge-icon">
                  {earned ? (
                    <div className="earned-badge-symbol">
                      {getAchievementEmoji(achievement.name)}
                    </div>
                  ) : (
                    <div className="locked-badge-symbol">🔒</div>
                  )}
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