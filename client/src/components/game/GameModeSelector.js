// client/src/components/game/GameModeSelector.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import soundService from '../../services/soundService';

const GameModeSelector = ({ onClose }) => {
  const navigate = useNavigate();
  
  const gameModes = [
    {
      id: 'normal',
      title: 'Normal Mode',
      description: 'Solve math problems at your own pace to earn points and level up.',
      icon: '📚'
    },
    {
      id: 'timed',
      title: 'Timed Challenge',
      description: 'Solve as many problems as you can within 2 minutes.',
      icon: '⏱️'
    },
    {
      id: 'speedrun',
      title: 'Speed Run',
      description: 'Solve 10 problems as quickly as possible. Beat your best time!',
      icon: '🏃'
    }
  ];
  
  const handleModeSelect = (modeId) => {
    soundService.play('click');
    navigate(`/game?mode=${modeId}`);
  };
  
  return (
    <div className="game-mode-overlay">
      <div className="game-mode-container">
        <h2 className="game-mode-title">Select Game Mode</h2>
        
        <div className="game-modes-grid">
          {gameModes.map(mode => (
            <div 
              key={mode.id} 
              className="game-mode-card"
              onClick={() => handleModeSelect(mode.id)}
            >
              <div className="game-mode-icon">{mode.icon}</div>
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
            </div>
          ))}
        </div>
        
        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;