import React, { useState } from 'react';
import './GameStyles.css';

const ScratchGame = ({ onFinish, onAttemptPlay, prizeName = 'Vale Compras R$ 50' }) => {
  const [scratched, setScratched] = useState(false);
  
  const handleScratch = () => {
      if(!scratched) {
          if (onAttemptPlay && !onAttemptPlay()) return;
          setScratched(true);
          setTimeout(() => onFinish(prizeName), 1000);
      }
  };

  return (
    <div className="gameWrapper">
      <h3>Raspadinha da Sorte</h3>
      <div 
          className={`scratchArea ${scratched ? 'scratched' : ''}`}
          onClick={handleScratch}
      >
          <span className="scratchText">
              {scratched ? prizeName : 'Clique para Raspar'}
          </span>
      </div>
      <p style={{ color: '#94a3b8' }}>{scratched ? 'Parabéns!' : 'Tente a sorte!'}</p>
    </div>
  );
};

export default ScratchGame;
