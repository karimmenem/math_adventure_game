import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import soundService from '../services/soundService';

const GameModeSelect = () => {
  const navigate = useNavigate();
  
  const handleModeSelect = (mode) => {
    soundService.play('click');
    navigate(`/game?mode=${mode}`);
  };
  
  return (
    <div className="game-mode-container">
      <h1 className="game-mode-title">Choose Game Mode</h1>
      
      <div className="game-modes">
        <div className="game-mode-card" onClick={() => handleModeSelect('normal')}>
          <div className="mode-icon">🧮</div>
          <h2>Normal Mode</h2>
          <p>Solve math problems at your own pace with no time pressure.</p>
          <ul className="mode-features">
            <li>Progress through levels</li>
            <li>Earn achievements</li>
            <li>Build math skills steadily</li>
          </ul>
          <button className="mode-select-btn">Play Normal Mode</button>
        </div>
        
        <div className="game-mode-card" onClick={() => handleModeSelect('timed')}>
          <div className="mode-icon">⏱️</div>
          <h2>Timed Challenge</h2>
          <p>Solve each problem before the timer runs out!</p>
          <ul className="mode-features">
            <li>30 seconds per problem</li>
            <li>Bonus points for speed</li>
            <li>Test your quick thinking</li>
          </ul>
          <button className="mode-select-btn">Play Timed Challenge</button>
        </div>
        
        <div className="game-mode-card" onClick={() => handleModeSelect('blitz')}>
          <div className="mode-icon">⚡</div>
          <h2>Blitz Mode</h2>
          <p>How many problems can you solve in 60 seconds?</p>
          <ul className="mode-features">
            <li>60-second countdown</li>
            <li>Unlimited problems</li>
            <li>Beat your high score!</li>
          </ul>
          <button className="mode-select-btn">Play Blitz Mode</button>
        </div>
      </div>
      
      <Link to="/dashboard" className="back-link" onClick={() => soundService.play('click')}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default GameModeSelect;