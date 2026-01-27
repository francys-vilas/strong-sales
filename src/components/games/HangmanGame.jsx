import React, { useState } from 'react';
import './GameStyles.css';

const HANGMAN_WORDS = ['VENDA', 'CLIENTE', 'SUCESSO', 'LUCRO', 'META', 'EQUIPE', 'LIDER', 'PREMIO'];

const HangmanGame = ({ onFinish }) => {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState(new Set());
  const [errors, setErrors] = useState(0);
  const [status, setStatus] = useState('ready'); // ready, playing, won, lost

  const start = () => {
    const w = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
    setWord(w);
    setGuessed(new Set());
    setErrors(0);
    setStatus('playing');
  };

  const handleGuess = (letter) => {
    if (status !== 'playing' || guessed.has(letter)) return;
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);
    
    if (!word.includes(letter)) {
        const newErrors = errors + 1;
        setErrors(newErrors);
        if (newErrors >= 6) setStatus('lost');
    } else {
        const isWon = word.split('').every(l => newGuessed.has(l));
        if (isWon) {
            setStatus('won');
            if (onFinish) onFinish('Mestre das Palavras');
        }
    }
  };

  return (
    <div className="gameWrapper">
        <h3>Jogo da Forca</h3>
        {status === 'ready' ? (
            <button className="btnSpin" onClick={start}>Começar</button>
        ) : (
            <>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444', marginBottom: '1.5rem' }}>Erros: {errors} / 6</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    {word.split('').map((char, i) => (
                        <span key={i} style={{ borderBottom: '3px solid #1e293b', width: '30px', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center' }}>
                            {guessed.has(char) || status !== 'playing' ? char : '_'}
                        </span>
                    ))}
                </div>
                {status !== 'playing' ? (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: '1.5rem', color: status === 'won' ? '#22c55e' : '#ef4444' }}>{status === 'won' ? 'VOCÊ VENCEU!' : `PERDEU! A palavra era ${word}`}</h4>
                        <button className="btnSpin" onClick={start} style={{ mt: '1rem', padding: '0.6rem 1.5rem' }}>Jogar Novamente</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', maxWidth: '400px' }}>
                        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
                            <button 
                                key={char} 
                                onClick={() => handleGuess(char)}
                                disabled={guessed.has(char)}
                                style={{ width: '35px', height: '35px', border: '1px solid #e2e8f0', background: guessed.has(char) ? '#f1f5f9' : 'white', borderRadius: '6px', fontWeight: 600, cursor: guessed.has(char) ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                )}
            </>
        )}
    </div>
  );
};

export default HangmanGame;
