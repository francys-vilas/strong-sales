import React, { useState, useEffect } from 'react';
import './GameStyles.css';

const MEMORY_CARDS_DATA = ['🚀', '🌟', '🎩', '🎮', '🎸', '🎨', '🍕', '🏆'];

const MemoryGame = ({ onFinish }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const shuffled = [...MEMORY_CARDS_DATA, ...MEMORY_CARDS_DATA]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (id) => {
    if (flipped.length === 2) return;
    const cardIndex = cards.findIndex(c => c.id === id);
    if (cards[cardIndex].isMatched || cards[cardIndex].isFlipped) return;

    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flipped, newCards[cardIndex]];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      if (newFlipped[0].emoji === newFlipped[1].emoji) {
        setMatched(prev => [...prev, newFlipped[0].id, newFlipped[1].id]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
            setTimeout(() => onFinish('Mestre da Memória'), 500);
        }
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[resetCards.findIndex(c => c.id === newFlipped[0].id)].isFlipped = false;
          resetCards[resetCards.findIndex(c => c.id === newFlipped[1].id)].isFlipped = false;
          setCards(resetCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="gameWrapper">
      <div style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600, color: '#1e293b' }}>Movimentos: {moves}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
        {cards.map((card) => (
           <div 
            key={card.id} 
            className="memoryCard" 
            style={{ 
                width: '70px', 
                height: '70px', 
                perspective: '1000px', 
                cursor: 'pointer' 
            }} 
            onClick={() => handleCardClick(card.id)}
           >
             <div style={{ 
                 position: 'relative', 
                 width: '100%', 
                 height: '100%', 
                 transition: 'transform 0.6s', 
                 transformStyle: 'preserve-3d',
                 transform: card.isFlipped || matched.includes(card.id) ? 'rotateY(180deg)' : 'none'
             }}>
                 <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>?</div>
                 <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', transform: 'rotateY(180deg)', border: '2px solid #6366f1' }}>{card.emoji}</div>
             </div>
           </div>
        ))}
      </div>
      <button className="btnSpin" onClick={initGame} style={{ marginTop: '2rem', padding: '0.6rem 1.5rem', fontSize: '1rem' }}>Reiniciar</button>
    </div>
  );
};

export default MemoryGame;
