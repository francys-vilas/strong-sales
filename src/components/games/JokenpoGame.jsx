import React, { useState } from 'react';
import './GameStyles.css';

const JokenpoGame = ({ onFinish }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isFinishing, setIsFinishing] = useState(false);

  const play = (choice) => {
    if (isFinishing) return;
    setPlayerChoice(choice);
    setIsFinishing(true);
    let counter = 0;
    const options = ['rock', 'paper', 'scissors'];
    const interval = setInterval(() => {
      setComputerChoice(options[counter % 3]);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        finish(choice);
      }
    }, 100);
  };

  const finish = (player) => {
    const options = ['rock', 'paper', 'scissors'];
    const computer = options[Math.floor(Math.random() * 3)];
    setComputerChoice(computer);
    
    let gameResult = '';
    if (player === computer) {
      gameResult = 'Empate!';
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      gameResult = 'Você Venceu! 🎉';
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      if (onFinish) onFinish('Vitória no Jokenpô');
    } else {
      gameResult = 'Computador Venceu!';
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
    setResult(gameResult);
    setIsFinishing(false);
  };

  const getIcon = (choice) => {
    switch (choice) {
        case 'rock': return '✊';
        case 'paper': return '✋';
        case 'scissors': return '✌️';
        default: return '❓';
    }
  };

  return (
    <div className="gameWrapper">
      <div style={{ display: 'flex', gap: '2rem', fontSize: '1.2rem', fontWeight: 'bold', background: '#f1f5f9', padding: '1rem', borderRadius: '12px', color: '#1e293b' }}>
        <div>Você: {score.player}</div>
        <div style={{ color: '#94a3b8' }}>VS</div>
        <div>PC: {score.computer}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px', margin: '2rem 0' }}>
         <div style={{ textAlign: 'center' }}>
             <p style={{ fontWeight: 600, color: '#64748b' }}>Você</p>
             <div style={{ fontSize: '4rem', width: '100px', height: '100px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '4px solid #e2e8f0' }}>
                 {getIcon(playerChoice)}
             </div>
         </div>
         <div style={{ textAlign: 'center' }}>
             <p style={{ fontWeight: 600, color: '#64748b' }}>PC</p>
             <div style={{ fontSize: '4rem', width: '100px', height: '100px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '4px solid #e2e8f0' }}>
                 {computerChoice ? getIcon(computerChoice) : '💻'}
             </div>
         </div>
      </div>

      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1', height: '2rem' }}>{result}</div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button className="btnMove" onClick={() => play('rock')} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontSize: '1.1rem' }}>✊ Pedra</button>
        <button className="btnMove" onClick={() => play('paper')} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontSize: '1.1rem' }}>✋ Papel</button>
        <button className="btnMove" onClick={() => play('scissors')} style={{ padding: '1rem', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontSize: '1.1rem' }}>✌️ Tesoura</button>
      </div>
    </div>
  );
};

export default JokenpoGame;
