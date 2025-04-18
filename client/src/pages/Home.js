import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Math Adventure Game</h1>
        <p>Improve your math skills with fun challenges and adventures!</p>
        
        <div className="cta-buttons">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signin" className="btn btn-primary">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="feature">
          <h2>Learn Mathematics</h2>
          <p>Master math concepts through interactive challenges</p>
        </div>
        
        <div className="feature">
          <h2>Earn Achievements</h2>
          <p>Collect badges and track your progress</p>
        </div>
        
        <div className="feature">
          <h2>Have Fun</h2>
          <p>Enjoy learning with our gamified approach</p>
        </div>
      </div>
    </div>
  );
};

export default Home;