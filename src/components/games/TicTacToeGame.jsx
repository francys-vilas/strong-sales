import React, { useState } from 'react';
import './GameStyles.css';

const TicTacToeGame = ({ onFinish }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    const win = calculateWinner(newBoard);
    if (win) {
        setWinner(win);
        if (onFinish) onFinish(`Vencedor: ${win}`);
    } else if (!newBoard.includes(null)) {
        setWinner('Draw');
    } else {
        setIsXNext(!isXNext);
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="gameWrapper">
      <h3>Jogo da Velha</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '10px', marginTop: '1rem' }}>
          {board.map((cell, i) => (
              <div key={i} onClick={() => handleClick(i)} style={{ width: '80px', height: '80px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '2.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6366f1' }}>
                  {cell}
              </div>
          ))}
      </div>
      {winner && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.25rem', color: '#1e293b' }}>{winner === 'Draw' ? 'Empate!' : `Vencedor: ${winner}`}</h4>
              <button className="btnSpin" onClick={reset} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', fontSize: '1rem' }}>Jogar Novamente</button>
          </div>
      )}
    </div>
  );
};

export default TicTacToeGame;
