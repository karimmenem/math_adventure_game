import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user progress data
    // In a real app, you'd make an API call to your backend
    const fetchUserProgress = async () => {
      try {
        // Mock data - replace with actual API call
        setTimeout(() => {
          setUserProgress({
            current_level: 3,
            total_points: 250,
            problems_solved: 15
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching user progress:', error);
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <p>Loading your progress...</p>
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

            <div className="action-buttons">
              <button className="start-game-btn">
                Start New Game
              </button>
              <button className="view-achievements-btn">
                View Achievements
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;