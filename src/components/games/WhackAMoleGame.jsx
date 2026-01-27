import React, { useState, useRef, useEffect } from 'react';
import './GameStyles.css';

const WhackAMoleGame = ({ onFinish }) => {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);

  const startGame = () => {
    if (active) return;
    setScore(0);
    setActive(true);
    
    const popupMole = () => {
      const idx = Math.floor(Math.random() * 9);
      setMoles(prev => { const n = Array(9).fill(false); n[idx] = true; return n; });
      setTimeout(() => setMoles(Array(9).fill(false)), 800);
    };

    const intervalId = setInterval(popupMole, 1000);
    
    const gameTimeout = setTimeout(() => {
      clearInterval(intervalId);
      setActive(false);
      setMoles(Array(9).fill(false));
      if (onFinish) onFinish(`Pontuação: ${score}`);
    }, 15000);
    
    timerRef.current = { intervalId, gameTimeout };
  };

  useEffect(() => {
    return () => {
        if (timerRef.current) {
            clearInterval(timerRef.current.intervalId);
            clearTimeout(timerRef.current.gameTimeout);
        }
    };
  }, []);

  const whack = (idx) => {
    if (!moles[idx]) return;
    setScore(prev => prev + 1);
    setMoles(prev => { const n = [...prev]; n[idx] = false; return n; });
  };

  return (
    <div className="gameWrapper">
        <h3>Acerte a Toupeira</h3>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1', marginBottom: '1rem' }}>Pontos: {score}</div>
        {!active ? (
            <button className="btnSpin" onClick={startGame}>Começar Jogo (15s)</button>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '15px' }}>
                {moles.map((isMole, i) => (
                    <div key={i} onClick={() => whack(i)} style={{ width: '80px', height: '80px', background: isMole ? '#475569' : '#64748b', borderRadius: '50%', position: 'relative', overflow: 'hidden', cursor: 'pointer', boxShadow: 'inset 0 6px 10px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                        {isMole && '🐹'}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default WhackAMoleGame;
