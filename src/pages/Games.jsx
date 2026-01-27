import React, { useState } from 'react';
import { Trophy, RotateCw, Plus, Trash2, Grid, Target, Lightbulb, Keyboard, Shuffle } from 'lucide-react';
import styles from './Games.module.css';

// Import reusable games
import RouletteGame from '../components/games/RouletteGame';
import SlotGame from '../components/games/SlotGame';
import JokenpoGame from '../components/games/JokenpoGame';
import MemoryGame from '../components/games/MemoryGame';
import ScratchGame from '../components/games/ScratchGame';
import TicTacToeGame from '../components/games/TicTacToeGame';
import WhackAMoleGame from '../components/games/WhackAMoleGame';
import SimonGame from '../components/games/SimonGame';
import GuessNumberGame from '../components/games/GuessNumberGame';
import HangmanGame from '../components/games/HangmanGame';

const DEFAULT_PARTICIPANTS = [
  'Maria Silva', 'João Souza', 'Ana Oliveira', 'Pedro Santos', 
  'Lucas Costa', 'Julia Lima', 'Marcos Pereira', 'Fernanda Alves'
];

const Games = () => {
  const [activeTab, setActiveTab] = useState('roulette');
  const [winner, setWinner] = useState(null);
  
  // Roulette settings (specific to full games page)
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [newParticipant, setNewParticipant] = useState('');

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Área de Jogos</h1>
          <p className="page-subtitle">Gamificação para premiar seus melhores clientes e vendedores</p>
        </div>
      </div>

      <div className={styles.gamesLayout}>
        <div className={styles.gamesTabs}>
          <button className={`${styles.gameTab} ${activeTab === 'roulette' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('roulette')}>🎡 Roleta</button>
          <button className={`${styles.gameTab} ${activeTab === 'slots' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('slots')}>🎰 Caça-Níquel</button>
          <button className={`${styles.gameTab} ${activeTab === 'jokenpo' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('jokenpo')}>✌️ Jokenpô</button>
          <button className={`${styles.gameTab} ${activeTab === 'memory' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('memory')}>🧠 Memória</button>
          <button className={`${styles.gameTab} ${activeTab === 'scratch' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('scratch')}>🎫 Raspadinha</button>
          <button className={`${styles.gameTab} ${activeTab === 'tictactoe' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('tictactoe')}><Grid size={16}/> Velha</button>
          <button className={`${styles.gameTab} ${activeTab === 'whack' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('whack')}><Target size={16}/> Alvo</button>
          <button className={`${styles.gameTab} ${activeTab === 'simon' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('simon')}><Lightbulb size={16}/> Genius</button>
          <button className={`${styles.gameTab} ${activeTab === 'guess' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('guess')}><Shuffle size={16}/> Adivinhe</button>
          <button className={`${styles.gameTab} ${activeTab === 'hangman' ? styles.gameTabActive : ''}`} onClick={() => setActiveTab('hangman')}><Keyboard size={16}/> Forca</button>
        </div>

        <div className={styles.gameContainer}>
          
          {/* ROULETTE */}
          {activeTab === 'roulette' && (
            <div className={styles.rouletteWrapper}>
               <RouletteGame 
                    participants={participants} 
                    onFinish={(p) => setWinner(p)} 
               />
               <div className={styles.rouletteControls}>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Adicionar opção..." 
                    value={newParticipant} 
                    onChange={(e) => setNewParticipant(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()} 
                  />
                  <button className="btn btn-secondary" onClick={handleAddParticipant}><Plus size={20} /></button>
                </div>
                <div className={styles.participantsList}>
                  {participants.map((p, i) => (
                    <div key={i} className={styles.participantItem}>
                      <span>{p}</span>
                      <button onClick={() => handleRemoveParticipant(i)} className="text-danger"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SLOT MACHINE */}
          {activeTab === 'slots' && (
            <SlotGame onFinish={(m) => setWinner(m)} />
          )}

          {/* JOKENPO */}
          {activeTab === 'jokenpo' && (
            <JokenpoGame onFinish={(r) => setWinner(r)} />
          )}

          {/* MEMORY */}
          {activeTab === 'memory' && (
            <MemoryGame onFinish={(r) => setWinner(r)} />
          )}

          {/* SCRATCH */}
          {activeTab === 'scratch' && (
            <ScratchGame onFinish={(r) => setWinner(r)} />
          )}

          {/* TIC TAC TOE */}
          {activeTab === 'tictactoe' && (
              <TicTacToeGame onFinish={(r) => setWinner(r)} />
          )}

          {/* WHACK A MOLE */}
          {activeTab === 'whack' && (
              <WhackAMoleGame onFinish={(r) => setWinner(r)} />
          )}

          {/* SIMON */}
          {activeTab === 'simon' && (
              <SimonGame onFinish={(r) => setWinner(r)} />
          )}

          {/* GUESS NUMBER */}
          {activeTab === 'guess' && (
              <GuessNumberGame onFinish={(r) => setWinner(r)} />
          )}

          {/* HANGMAN */}
          {activeTab === 'hangman' && (
              <HangmanGame onFinish={(r) => setWinner(r)} />
          )}

          {winner && (
            <div className={styles.winnerOverlay}>
              <div className={styles.winnerCard}>
                <Trophy size={64} className="text-warning mb-4" />
                <h2>PARABÉNS!</h2>
                <div className={styles.winnerName}>{winner}</div>
                <button className="btn btn-primary mt-4" onClick={() => setWinner(null)}>
                  <RotateCw size={20} className="mr-2" /> Fechar
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
