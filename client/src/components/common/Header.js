import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import SoundToggle from './SoundToggle';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // Default avatar path
  // Default avatar path
const avatarPath = user?.avatar ? `/avatars/${user.avatar}.png` : '/avatars/default.png';
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <h1 className="logo">
            <span className="logo-math">Math</span>
            <span className="logo-adventure">Adventure</span>
          </h1>
        </div>
        
        <div className="nav-container">
          <SoundToggle />
          
          {isAuthenticated ? (
            <nav className="nav-menu">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/achievements" className="nav-link">Achievements</Link>
              <Link to="/profile" className="nav-link profile-link">
                <span className="profile-username" style={{ color: user?.usernameColor || '#4CAF50' }}>
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
              <button onClick={handleLogout} className="nav-button">Logout</button>
            </nav>
          ) : (
            <nav className="nav-menu">
              <Link to="/signin" className="nav-link">Sign In</Link>
              <Link to="/signup" className="nav-button">Sign Up</Link>
            </nav>
          )}
        </div>
      </div>
      <div className="header-decoration"></div>
    </header>
  );
};

export default Header;