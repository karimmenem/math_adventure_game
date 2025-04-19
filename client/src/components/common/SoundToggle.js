import React, { useState } from 'react';
import soundService from '../../services/soundService';

const SoundToggle = () => {
  const [soundOn, setSoundOn] = useState(soundService.isSoundEnabled());

  const toggleSound = () => {
    const isEnabled = soundService.toggleSound();
    setSoundOn(isEnabled);
    soundService.play('click');
  };

  return (
    <button 
      className="sound-toggle-btn" 
      onClick={toggleSound}
      aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
    >
      {soundOn ? '🔊' : '🔇'}
    </button>
  );
};

export default SoundToggle;