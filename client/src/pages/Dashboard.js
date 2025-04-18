import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/users/progress",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user progress");
        }

        const data = await response.json();
        setUserProgress(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user progress:", error);
        setError("Failed to load your progress. Please try again later.");
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

            <div className="action-buttons">
              <Link to="/game" className="start-game-btn">
                Start New Game
              </Link>
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
