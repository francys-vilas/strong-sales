import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Dices, RotateCw, Plus, Trash2, X } from 'lucide-react';
import './Games.css';

const DEFAULT_PARTICIPANTS = [
  'Maria Silva', 'João Souza', 'Ana Oliveira', 'Pedro Santos', 
  'Lucas Costa', 'Julia Lima', 'Marcos Pereira', 'Fernanda Alves'
];

const SLOT_ICONS = ['💎', '7️⃣', '🍒', '🍋', '🍇', '🔔', '⭐️', '🍀'];

const Games = () => {
  const [activeTab, setActiveTab] = useState('roulette');
  
  // Roulette State
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [newParticipant, setNewParticipant] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  // Slot Machine State
  const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
  const [isSlotSpinning, setIsSlotSpinning] = useState(false);
  const [slotMessage, setSlotMessage] = useState('');

  // Roulette Logic
  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const spinRoulette = () => {
    if (isSpinning || participants.length < 2) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    // Random rotation between 5 and 10 full spins (1800-3600 deg) + random segment
    const spins = 1800 + Math.random() * 1800;
    const newRotation = rotation + spins;
    
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const segmentAngle = 360 / participants.length;
      // Calculate winner based on final angle
      // Normalizing angle to 0-360
      const currentAngle = newRotation % 360;
      // The arrow points to top (270deg in CSS terms usually, but here we adjust)
      // Since background is conic-gradient starting at 0 (top), the index is inverted order
      const winningIndex = Math.floor(((360 - currentAngle) % 360) / segmentAngle);
      
      // Safety check for index bounds
      const actualIndex = winningIndex >= 0 ? winningIndex : 0;
      setWinner(participants[actualIndex] || participants[0]);
    }, 5000); // Wait for CSS transition
  };

  // Slot Logic
  const spinSlots = () => {
    if (isSlotSpinning) return;
    
    setIsSlotSpinning(true);
    setSlotMessage('');
    
    // Simulate spinning delay per reel
    const spinDuration = 2000;
    const interval = 100;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
      setReels([
        SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
        SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
        SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)]
      ]);
      elapsed += interval;
      
      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        finishSpin();
      }
    }, interval);
  };

  const finishSpin = () => {
    // Determine final result
    const finalReels = [
      SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
      SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
      SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)]
    ];
    
    // For demo purposes, 20% chance of winning
    if (Math.random() > 0.8) {
      finalReels[0] = finalReels[1] = finalReels[2] = '💎';
    }

    setReels(finalReels);
    setIsSlotSpinning(false);

    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      setSlotMessage('JACKPOT! 🎉 VOCÊ GANHOU!');
      setWinner('JACKPOT'); // Reusing winner overlay for dramatic effect
    } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      setSlotMessage('Quase lá! 2 iguais!');
    } else {
      setSlotMessage('Tente novamente!');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Área de Jogos</h1>
          <p className="page-subtitle">Gamificação para premiar seus melhores clientes e vendedores</p>
        </div>
      </div>

      <div className="games-layout">
        <div className="games-tabs">
          <button 
            className={`game-tab ${activeTab === 'roulette' ? 'active' : ''}`}
            onClick={() => setActiveTab('roulette')}
          >
            🎡 Roleta da Sorte
          </button>
          <button 
            className={`game-tab ${activeTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveTab('slots')}
          >
            🎰 Caça-Níquel
          </button>
        </div>

        <div className="game-container">
          {activeTab === 'roulette' ? (
            <div className="roulette-wrapper">
              <div className="wheel-container">
                <div className="wheel-marker"></div>
                <div 
                  className="wheel"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* Dynamic Segments could be rendered here with SVG for names */}
                  {/* For specific visual simplicity we use a gradient background */}
                </div>
              </div>

              <div className="roulette-controls">
                <div className="input-group">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Adicionar nome..."
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                  />
                  <button className="btn btn-secondary" onClick={handleAddParticipant}>
                    <Plus size={20} />
                  </button>
                </div>

                <div className="participants-list">
                  {participants.map((p, i) => (
                    <div key={i} className="participant-item">
                      <span>{p}</span>
                      <button onClick={() => handleRemoveParticipant(i)} className="text-danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  className="btn-spin"
                  onClick={spinRoulette}
                  disabled={isSpinning || participants.length < 2}
                >
                  {isSpinning ? 'Girando...' : 'SORTEAR AGORA'}
                </button>
              </div>
            </div>
          ) : (
            <div className="slot-machine">
               <div className="slot-window">
                 {reels.map((icon, i) => (
                   <div key={i} className={`reel ${isSlotSpinning ? 'spinning' : ''}`}>
                     {icon}
                   </div>
                 ))}
               </div>
               
               <div className="slot-controls">
                 <button 
                    className="btn-spin" 
                    onClick={spinSlots}
                    disabled={isSlotSpinning}
                    style={{ width: '100%' }}
                  >
                   {isSlotSpinning ? 'Girando...' : 'ALAVANCAR'}
                 </button>
                 <div className="slot-message">{slotMessage}</div>
               </div>
            </div>
          )}

          {winner && (
            <div className="winner-overlay">
              <div className="winner-card">
                <Trophy size={64} className="text-warning mb-4" />
                <h2>Temos um Vencedor!</h2>
                <div className="winner-name">{winner === 'JACKPOT' ? 'JACKPOT!!!' : winner}</div>
                <button className="btn btn-primary mt-4" onClick={() => setWinner(null)}>
                  <RotateCw size={20} className="mr-2" /> Novo Sorteio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;
