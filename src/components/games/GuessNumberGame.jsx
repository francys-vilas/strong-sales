import React, { useState } from 'react';
import './GameStyles.css';

const GuessNumberGame = ({ onFinish }) => {
  const [target, setTarget] = useState(null);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('Estou pensando em um número de 1 a 100...');
  const [attempts, setAttempts] = useState(0);

  const start = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setMessage('Estou pensando em um número de 1 a 100...');
    setAttempts(0);
    setInput('');
  };

  const handleGuess = () => {
    const val = parseInt(input);
    if (!val) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (val === target) {
        setMessage(`ACERTOU! O número era ${target}.`);
        if (onFinish) onFinish(`Acertou em ${newAttempts} tentativas`);
    } else if (val < target) {
        setMessage('Tente um número MAIOR.');
    } else {
        setMessage('Tente um número MENOR.');
    }
    setInput('');
  };

  return (
    <div className="gameWrapper">
        <h3>Adivinhe o Número (1-100)</h3>
        {!target ? (
            <button className="btnSpin" onClick={start}>Iniciar Jogo</button>
        ) : (
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6366f1', marginBottom: '1.5rem', minHeight: '3rem' }}>{message}</p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <input 
                        type="number" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Nº"
                        style={{ width: '80px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                        onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                    />
                    <button className="btnSpin" onClick={handleGuess} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>Chutar</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default GuessNumberGame;
