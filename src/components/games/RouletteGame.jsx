import React, { useState } from 'react';
import styles from './GameStyles.css?inline'; // We can use regular import if we handle it in vite
import './GameStyles.css';

const RouletteGame = ({ onFinish, onAttemptPlay, participants = [], colors = [], items = [] }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  // Generate conic gradient dynamically
  const getWheelBackground = () => {
      if (!participants.length) return '#ccc';
      
      const segmentSize = 100 / participants.length;
      const defaultColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#f97316', '#06b6d4'];
      
      let gradient = 'conic-gradient(from 0deg, ';
      participants.forEach((_, index) => {
          const color = colors[index] || defaultColors[index % defaultColors.length];
          const start = index * segmentSize;
          const end = (index + 1) * segmentSize;
          gradient += `${color} ${start}% ${end}%, `;
      });
      
      return gradient.slice(0, -2) + ')';
  };

  const spin = () => {
    if (spinning) return;
    if (onAttemptPlay && !onAttemptPlay()) return;
    
    setSpinning(true);
    // Add extra rotations + random offset
    const spins = 1800 + Math.random() * 360; 
    const newRotation = rotation + spins;
    setRotation(newRotation);
    
    setTimeout(() => {
      setSpinning(false);
      
      let winnerValue = 'Prêmio Surpresa';
      if (participants.length > 0) {
        // Calculate winner based on final angle
        // Note: The pointer is at the top (0deg). 
        // Rotation is clockwise.
        // If we rotate 90deg, 270deg is at the top.
        // We need to normalize the rotation to 0-360
        const normalizedRotation = newRotation % 360; 
        const pointerAngle = (360 - normalizedRotation) % 360; // Angle at the top (12 o'clock)
        
        const segmentAngle = 360 / participants.length;
        const winningIndex = Math.floor(pointerAngle / segmentAngle);
        
        winnerValue = participants[winningIndex] || participants[0];
      }
      
      onFinish(winnerValue);
    }, 5000);
  };

  return (
    <div className="gameWrapper">
      <div className="wheelContainer">
        <div className="wheelMarker"></div>
        <div 
            className="wheel" 
            style={{ 
                transform: `rotate(${rotation}deg)`,
                background: getWheelBackground()
            }}
        >
            {/* Render Segments Content */}
            {(items.length > 0 ? items : participants.map((p, i) => ({ label: p, color: colors[i] }))).map((item, index) => {
                const total = (items.length > 0 ? items : participants).length;
                const segmentSize = 360 / total;
                const angle = index * segmentSize + segmentSize / 2; // Center of segment
                
                return (
                    <div 
                        key={index}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${angle}deg) translateY(-110px)`, // Push out from center
                            transformOrigin: 'center',
                            textAlign: 'center',
                            width: '80px',
                            marginLeft: '-40px', // Center horizontally
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            pointerEvents: 'none'
                        }}
                    >
                        {item.icon && <item.icon size={20} />}
                        <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
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
