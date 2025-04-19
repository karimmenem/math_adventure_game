// Collection of sound effects for the game
const soundEffects = {
    correct: new Audio('/sounds/correct.mp3'),
    incorrect: new Audio('/sounds/incorrect.mp3'),
    levelUp: new Audio('/sounds/level-up.mp3'),
    achievement: new Audio('/sounds/achievement.mp3'),
    click: new Audio('/sounds/click.mp3'),
    gameStart: new Audio('/sounds/game-start.mp3'),
    gameEnd: new Audio('/sounds/game-end.mp3')
  };
  
  // User preference for sounds (default to true)
  let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
  
  const soundService = {
    // Play a sound if sounds are enabled
    play: (sound) => {
      if (soundEnabled && soundEffects[sound]) {
        // Stop the sound if it's already playing
        soundEffects[sound].pause();
        soundEffects[sound].currentTime = 0;
        
        // Play the sound
        soundEffects[sound].play().catch(err => {
          // Ignore autoplay errors (common in some browsers)
          console.log("Sound play prevented:", err);
        });
      }
    },
    
    // Toggle sound on/off
    toggleSound: () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('soundEnabled', soundEnabled);
      return soundEnabled;
    },
    
    // Check if sound is enabled
    isSoundEnabled: () => {
      return soundEnabled;
    },
    
    // Preload all sounds to prevent delay on first play
    preloadSounds: () => {
      Object.values(soundEffects).forEach(audio => {
        audio.load();
      });
    }
  };
  
  export default soundService;