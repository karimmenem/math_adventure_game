import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <h1 className="logo">
            <span className="logo-math">Math</span>
            <span className="logo-adventure">Adventure</span>
          </h1>
        </div>
        
        {isAuthenticated ? (
          <nav className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/achievements" className="nav-link">Achievements</Link>
            <button onClick={handleLogout} className="nav-button">Logout</button>
          </nav>
        ) : (
          <nav className="nav-menu">
            <Link to="/signin" className="nav-link">Sign In</Link>
            <Link to="/signup" className="nav-button">Sign Up</Link>
          </nav>
        )}
      </div>
      <div className="header-decoration"></div>
    </header>
  );
};

export default Header;