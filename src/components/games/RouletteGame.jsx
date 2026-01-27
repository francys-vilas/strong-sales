import React, { useState } from 'react';
import styles from './GameStyles.css?inline'; // We can use regular import if we handle it in vite
import './GameStyles.css';

const RouletteGame = ({ onFinish, onAttemptPlay, participants = [] }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    if (onAttemptPlay && !onAttemptPlay()) return;
    
    setSpinning(true);
    const spins = 1800 + Math.random() * 1800;
    const newRotation = rotation + spins;
    setRotation(newRotation);
    
    setTimeout(() => {
      setSpinning(false);
      
      let winnerValue = 'Prêmio Surpresa';
      if (participants.length > 0) {
        const segmentAngle = 360 / participants.length;
        const currentAngle = newRotation % 360;
        const winningIndex = Math.floor(((360 - currentAngle) % 360) / segmentAngle);
        winnerValue = participants[winningIndex >= 0 ? winningIndex : 0] || participants[0];
      }
      
      onFinish(winnerValue);
    }, 5000);
  };

  return (
    <div className="gameWrapper">
      <div className="wheelContainer">
        <div className="wheelMarker"></div>
        <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}></div>
      </div>
      <button 
        className="btnSpin" 
        onClick={spin} 
        disabled={spinning}
      >
        {spinning ? 'Girando...' : 'GIRAR AGORA'}
      </button>
    </div>
  );
};

export default RouletteGame;
