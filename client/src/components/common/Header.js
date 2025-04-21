import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import SoundToggle from './SoundToggle';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Default avatar path
  const avatarPath = user?.avatar ? `/avatars/${user.avatar}.png` : '/avatars/default.png';
  
  return (
    <header className="app-header">
      {/* Add floating math symbols for decoration */}
      <div className="header-math-symbol">+</div>
      <div className="header-math-symbol">×</div>
      <div className="header-math-symbol">÷</div>
      <div className="header-math-symbol">=</div>
      
      <div className="header-container">
        <div className="logo-container">
          {/* Make the logo clickable to navigate to home */}
          <Link to="/" className="logo-link">
            <h1 className="logo">
              <span className="logo-math">Math</span>
              <span className="logo-adventure">Adventure</span>
            </h1>
          </Link>
        </div>
        
        <div className="nav-container">
          <SoundToggle />
          
          {isAuthenticated ? (
            <nav className="nav-menu">
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/achievements" 
                className={`nav-link ${location.pathname === '/achievements' ? 'active' : ''}`}
              >
                Achievements
              </Link>
              <Link 
                to="/about" 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                About Me
              </Link>
              <Link to="/profile" className="nav-link profile-link">
                {/* Use inline style to respect user's color preference, with white as default */}
                <span 
                  className="profile-username" 
                  style={{ 
                    color: user?.usernameColor || '#FFFFFF',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' // Add shadow for better contrast
                  }}
                >
                  {user?.username}
                </span>
                <div className="header-avatar">
                  <img 
                    src={avatarPath} 
                    alt="User avatar" 
                    onError={(e) => {
                      e.target.src = '/avatars/avatar1.png';
                    }}
                  />
                </div>
              </Link>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </nav>
          ) : (
            <nav className="nav-menu">
              <Link 
                to="/about" 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                About Me
              </Link>
              <Link 
                to="/signin" 
                className={`nav-link ${location.pathname === '/signin' ? 'active' : ''}`}
              >
                Sign In
              </Link>
              <Link to="/signup" className="nav-button">
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>
      <div className="header-decoration"></div>
    </header>
  );
};

export default Header;