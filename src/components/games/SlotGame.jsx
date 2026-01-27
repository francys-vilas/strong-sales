import React, { useState } from 'react';
import './GameStyles.css';

const SLOT_ICONS = ['💎', '7️⃣', '🍒', '🍋', '🍇', '🔔', '⭐️', '🍀'];

const SlotGame = ({ onFinish, onAttemptPlay }) => {
  const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    if (onAttemptPlay && !onAttemptPlay()) return;

    setSpinning(true);
    
    let elapsed = 0;
    const interval = setInterval(() => {
      setReels([
        SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
        SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
        SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)]
      ]);
      elapsed += 100;
      if (elapsed > 2000) {
        clearInterval(interval);
        
        // Logical win chance or forced for demo
        const isWin = Math.random() > 0.7;
        const final = isWin ? ['💎', '💎', '💎'] : [
            SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
            SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
            SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)]
        ];
        
        setReels(final);
        setSpinning(false);
        
        if (final[0] === final[1] && final[1] === final[2]) {
            onFinish(`JACKPOT! ${final[0]}`);
        } else {
            // In a real campaign game, we might want to ensure they win something eventually
            onFinish('Tente novamente!'); 
        }
      }
    }, 100);
  };

  return (
    <div className="gameWrapper">
      <div className="slotMachine">
        <div className="slotWindow">
          {reels.map((icon, i) => (
            <div key={i} className={`reel ${spinning ? 'reelSpinning' : ''}`}>
              {icon}
            </div>
          ))}
        </div>
        <button 
          className="btnSpin" 
          onClick={spin} 
          disabled={spinning}
          style={{ width: '100%' }}
        >
          {spinning ? 'Rodando...' : 'ALAVANCAR'}
        </button>
      </div>
    </div>
  );
};

export default SlotGame;
