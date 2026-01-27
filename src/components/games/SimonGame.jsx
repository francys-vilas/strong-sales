import React, { useState, useEffect } from 'react';
import './GameStyles.css';

const COLORS = ['green', 'red', 'yellow', 'blue'];
const COLOR_VALUES = {
    green: '#22c55e',
    red: '#ef4444',
    yellow: '#eab308',
    blue: '#3b82f6'
};

const SimonGame = ({ onFinish }) => {
  const [sequence, setSequence] = useState([]);
  const [userStep, setUserStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [flash, setFlash] = useState(null);
  const [message, setMessage] = useState('Clique em Jogar para começar');

  const playSequence = async (seq) => {
    setPlaying(false);
    for (let i = 0; i < seq.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        setFlash(seq[i]);
        await new Promise(r => setTimeout(r, 600));
        setFlash(null);
    }
    setPlaying(true);
  };

  const start = () => {
    const startSeq = [COLORS[Math.floor(Math.random() * 4)]];
    setSequence(startSeq);
    setUserStep(0);
    setMessage('Memorize a sequência!');
    playSequence(startSeq);
  };

  const handleClick = (color) => {
    if (!playing) return;
    setFlash(color);
    setTimeout(() => setFlash(null), 200);

    if (color === sequence[userStep]) {
        if (userStep + 1 === sequence.length) {
            setMessage('Muito bem! Próximo nível...');
            const nextSeq = [...sequence, COLORS[Math.floor(Math.random() * 4)]];
            setSequence(nextSeq);
            setUserStep(0);
            setTimeout(() => playSequence(nextSeq), 1000);
            if (nextSeq.length > 5 && onFinish) onFinish(`Nível Simon: ${nextSeq.length}`);
        } else {
            setUserStep(userStep + 1);
        }
    } else {
        setMessage('Errou! Tente de novo.');
        setPlaying(false);
        setSequence([]);
    }
  };

  return (
    <div className="gameWrapper">
        <h3>Genius (Simon)</h3>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>{message}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '240px', height: '240px' }}>
            {COLORS.map(color => (
                <div 
                    key={color} 
                    onClick={() => handleClick(color)}
                    style={{ 
                        backgroundColor: COLOR_VALUES[color], 
                        borderRadius: '15px', 
                        opacity: flash === color ? 1 : 0.6, 
                        cursor: 'pointer', 
                        transition: 'all 0.1s',
                        transform: flash === color ? 'scale(0.95)' : 'none',
                        boxShadow: flash === color ? `0 0 20px ${COLOR_VALUES[color]}` : 'none'
                    }}
                ></div>
            ))}
        </div>
        {!playing && sequence.length === 0 && (
            <button className="btnSpin" onClick={start} style={{ marginTop: '2rem' }}>Jogar</button>
        )}
    </div>
  );
};

export default SimonGame;
