// Animation utility functions
const animationUtils = {
  // Create number particles flying out from an element
  createNumberParticles: (element, correctAnswer, isCorrect) => {
    if (!element) return;
    
    // Add safety check for undefined correctAnswer
    if (correctAnswer === undefined || correctAnswer === null) {
      correctAnswer = "";  // Default to empty string if undefined
    }
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create container for particles if it doesn't exist
    let particleContainer = document.getElementById('particle-container');
    if (!particleContainer) {
      particleContainer = document.createElement('div');
      particleContainer.id = 'particle-container';
      particleContainer.style.position = 'fixed';
      particleContainer.style.top = '0';
      particleContainer.style.left = '0';
      particleContainer.style.width = '100%';
      particleContainer.style.height = '100%';
      particleContainer.style.pointerEvents = 'none';
      particleContainer.style.zIndex = '9999';
      document.body.appendChild(particleContainer);
    }
    
    // Number of particles
    const particleCount = isCorrect ? 20 : 10;
    const colors = isCorrect 
      ? ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B'] // Success colors
      : ['#F44336', '#FF9800', '#FF5722']; // Error colors
      
    // Create and animate particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Random angle
      const angle = Math.random() * Math.PI * 2;
      // Random distance
      const distance = 100 + Math.random() * 100;
      // Random size
      const size = 20 + Math.random() * 20;
      
      // Set content, either numbers for correct answer, or symbols for incorrect
      if (isCorrect) {
        // Use parts of the correct answer for content
        const answerStr = correctAnswer.toString();
        particle.innerText = answerStr[Math.floor(Math.random() * answerStr.length)];
      } else {
        // Use X for incorrect answers
        particle.innerText = '✗';
      }
      
      // Set styles
      particle.style.position = 'absolute';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.fontSize = `${size}px`;
      particle.style.fontWeight = 'bold';
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = '1';
      particle.style.transform = 'translate(-50%, -50%)';
      
      // Add particle to container
      particleContainer.appendChild(particle);
      
      // Animate using keyframes
      particle.animate([
        {
          transform: 'translate(-50%, -50%)',
          opacity: 1
        },
        {
          transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%)`,
          opacity: 0
        }
      ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
      }).onfinish = () => {
        particle.remove();
      };
    }
  },
  
  // Create celebration effect with confetti
  createCelebration: () => {
    // Create container for confetti
    let confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) {
      confettiContainer = document.createElement('div');
      confettiContainer.id = 'confetti-container';
      confettiContainer.style.position = 'fixed';
      confettiContainer.style.top = '0';
      confettiContainer.style.left = '0';
      confettiContainer.style.width = '100%';
      confettiContainer.style.height = '100%';
      confettiContainer.style.pointerEvents = 'none';
      confettiContainer.style.zIndex = '9998';
      document.body.appendChild(confettiContainer);
    }
    
    // Shape types
    const shapes = ['square', 'circle', 'triangle'];
    
    // Bright colors
    const colors = [
      '#FFC107', '#2196F3', '#E91E63', '#4CAF50', '#9C27B0', 
      '#FF5722', '#3F51B5', '#00BCD4', '#FFEB3B', '#8BC34A'
    ];
    
    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      
      // Random starting position at top of screen
      const startX = Math.random() * window.innerWidth;
      
      // Random shape
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Random size
      const size = 5 + Math.random() * 15;
      
      // Set styles
      confetti.style.position = 'absolute';
      confetti.style.left = `${startX}px`;
      confetti.style.top = '-20px';
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.opacity = '0.9';
      
      // Apply shape
      if (shape === 'circle') {
        confetti.style.borderRadius = '50%';
      } else if (shape === 'triangle') {
        confetti.style.width = '0';
        confetti.style.height = '0';
        confetti.style.backgroundColor = 'transparent';
        confetti.style.borderLeft = `${size/2}px solid transparent`;
        confetti.style.borderRight = `${size/2}px solid transparent`;
        confetti.style.borderBottom = `${size}px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
      }
      
      // Add to container
      confettiContainer.appendChild(confetti);
      
      // Random horizontal movement range
      const horizontalMovement = 100 - Math.random() * 200;
      
      // Random duration
      const duration = 1500 + Math.random() * 3000;
      
      // Animate falling and rotation
      confetti.animate([
        {
          transform: 'translate(0, 0) rotate(0deg)',
          opacity: 1
        },
        {
          transform: `translate(${horizontalMovement}px, ${window.innerHeight}px) rotate(${720 - Math.random() * 1440}deg)`,
          opacity: 0
        }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
      }).onfinish = () => {
        confetti.remove();
      };
    }
  },
  
  // Create character reaction
  // Create character reaction - Updated position to left side
showCharacterReaction: (reaction) => {
  let character = document.getElementById('game-character');
  
  // Create character if it doesn't exist
  if (!character) {
    character = document.createElement('div');
    character.id = 'game-character';
    character.style.position = 'fixed';
    character.style.bottom = '20px';
    character.style.left = '20px'; // Changed from right to left
    character.style.width = '120px';
    character.style.height = '120px';
    character.style.zIndex = '1000';
    character.style.transition = 'transform 0.5s';
    character.style.backgroundSize = 'contain';
    character.style.backgroundRepeat = 'no-repeat';
    character.style.backgroundPosition = 'center';
    document.body.appendChild(character);
    
    // Create speech bubble
    const speechBubble = document.createElement('div');
    speechBubble.id = 'speech-bubble';
    speechBubble.style.position = 'absolute';
    speechBubble.style.top = '-80px';
    speechBubble.style.left = '60px'; // Changed from 50% to fixed pixels
    speechBubble.style.transform = 'translateX(0)'; // Changed from translateX(-50%)
    speechBubble.style.backgroundColor = 'white';
    speechBubble.style.padding = '10px 15px';
    speechBubble.style.borderRadius = '20px';
    speechBubble.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    speechBubble.style.opacity = '0';
    speechBubble.style.transition = 'opacity 0.3s';
    speechBubble.style.fontFamily = 'Comic Sans MS, sans-serif';
    speechBubble.style.fontSize = '14px';
    speechBubble.style.fontWeight = 'bold';
    speechBubble.style.textAlign = 'center';
    speechBubble.style.minWidth = '180px'; // Set minimum width
    speechBubble.style.maxWidth = '250px'; // Set maximum width
    
    // Add speech bubble point
    speechBubble.style.position = 'relative';
    speechBubble.style.backgroundColor = 'white';
    speechBubble.innerHTML = `<span id="speech-text"></span>`;
    
    // Style the point
    const after = document.createElement('div');
    after.style.content = "''";
    after.style.position = 'absolute';
    after.style.bottom = '-10px';
    after.style.left = '30px'; // Changed from 50% to fixed pixels
    after.style.transform = 'translateX(0)'; // Changed from translateX(-50%)
    after.style.width = '0';
    after.style.height = '0';
    after.style.borderLeft = '10px solid transparent';
    after.style.borderRight = '10px solid transparent';
    after.style.borderTop = '10px solid white';
    
    speechBubble.appendChild(after);
    character.appendChild(speechBubble);
  }
  
  const speechBubble = document.getElementById('speech-bubble');
  const speechText = document.getElementById('speech-text');
  
  // Set character image and speech based on reaction
  switch (reaction) {
    case 'correct':
      character.style.backgroundImage = "url('/characters/happy.png')";
      speechText.innerText = "Great job! 🎉";
      character.style.transform = 'translateY(-20px)';
      break;
    case 'incorrect':
      character.style.backgroundImage = "url('/characters/sad.png')";
      speechText.innerText = "Try again! You can do it! 💪";
      character.style.transform = 'translateY(0)';
      break;
    case 'levelUp':
      character.style.backgroundImage = "url('/characters/excited.png')";
      speechText.innerText = "Wow! You leveled up! 🚀";
      character.style.transform = 'translateY(-30px) rotate(-10deg)'; // Changed rotation direction
      break;
    case 'achievement':
      character.style.backgroundImage = "url('/characters/proud.png')";
      speechText.innerText = "Amazing achievement! 🏆";
      character.style.transform = 'translateY(-20px) scale(1.1)';
      break;
    default:
      character.style.backgroundImage = "url('/characters/neutral.png')";
      speechText.innerText = "Let's solve some math! 🧠";
      character.style.transform = 'translateY(0)';
  }
  
  // Show speech bubble
  speechBubble.style.opacity = '1';
  
  // Hide speech bubble after a few seconds
  setTimeout(() => {
    speechBubble.style.opacity = '0';
  }, 3000);
  
  // Reset character position after animation
  setTimeout(() => {
    character.style.transform = 'translateY(0)';
  }, 2000);
},
  
  // Animate a number counter (for scores, levels, etc)
  animateCounter: (element, startValue, endValue, duration = 1000) => {
    if (!element) return;
    
    const startTime = performance.now();
    const change = endValue - startValue;
    
    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        const value = Math.floor(startValue + change * (elapsedTime / duration));
        element.textContent = value;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = endValue;
      }
    };
    
    requestAnimationFrame(updateCounter);
  }
};

export default animationUtils;