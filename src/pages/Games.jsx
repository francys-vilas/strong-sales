import React, { useState, useEffect } from 'react';
import { Trophy, RotateCw, Plus, Trash2, Grid, Target, Lightbulb, Keyboard, Shuffle, Save, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './Games.module.css';
import { supabase } from '../services/supabase';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode'); // 'edit', 'demo'
  const campaignId = searchParams.get('campaignId');
  const gameType = searchParams.get('gameType') || 'roulette';

  const [activeTab, setActiveTab] = useState(gameType);
  const [winner, setWinner] = useState(null);
  
  // Editor State
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);

  // Roulette settings (specific to full games page)
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [newParticipant, setNewParticipant] = useState('');

  // Load Campaign Config if in Edit Mode
  useEffect(() => {
    if (mode === 'edit' && campaignId) {
      loadCampaignConfig();
      setActiveTab(gameType);
    }
  }, [mode, campaignId]);

  const loadCampaignConfig = async () => {
    setLoadingConfig(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('game_config')
        .eq('id', campaignId)
        .single();
      
      if (error) throw error;
      
      if (data?.game_config && Object.keys(data.game_config).length > 0) {
         setGameConfig(data.game_config);
         if (data.game_config.prizes) {
             // Extract labels for roulette preview
             setParticipants(data.game_config.prizes.map(p => p.label));
         }
      } else {
        // Initialize default config if empty
        setGameConfig({
            difficulty: 'medium',
            prizes: DEFAULT_PARTICIPANTS.map(p => ({ label: p, color: '#3b82f6', probability: 10, is_win: true }))
        });
      }
    } catch (err) {
      console.error("Error loading config:", err);
      alert("Erro ao carregar configuração.");
    } finally {
        setLoadingConfig(false);
    }
  };

  const saveConfig = async () => {
      setSavingConfig(true);
      try {
          // Construct the final config object based on current UI state
          // For now, let's sync participants state back to config
          // In a real app, we would have a dedicated "Prize Editor" form
          const updatedConfig = {
              ...gameConfig,
              prizes: participants.map(label => ({
                  label,
                  color:  `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color for now or preserve
                  probability: 100 / participants.length, // Equal chance for now
                  is_win: true
              }))
          };

          const { error } = await supabase
            .from('campaigns')
            .update({ game_config: updatedConfig })
            .eq('id', campaignId);

          if (error) throw error;
          alert("Configuração salva com sucesso!");
          navigate(`/campaigns/new/${campaignId}`); // Go back to campaign
      } catch (err) {
          console.error("Error saving config:", err);
          alert("Erro ao salvar.");
      } finally {
          setSavingConfig(false);
      }
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const isEditor = mode === 'edit';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditor ? 'Configurar Jogo' : 'Área de Jogos'}</h1>
          <p className="page-subtitle">
            {isEditor ? 'Personalize o jogo da sua campanha' : 'Gamificação para premiar seus melhores clientes e vendedores'}
          </p>
        </div>
        {isEditor && (
             <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => navigate(`/campaigns/new/${campaignId}`)}>
                    <ArrowLeft size={18} /> Voltar
                </button>
                <button className="btn btn-primary" onClick={saveConfig} disabled={savingConfig}>
                    <Save size={18} /> {savingConfig ? 'Salvando...' : 'Salvar Configuração'}
                </button>
             </div>
        )}
      </div>

      <div className={styles.gamesLayout}>
        {/* Hide tabs in Editor Mode if we want to focus on just one game */}
        {!isEditor && (
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
        )}

        <div className={styles.gameContainer}>
            {loadingConfig && <p>Carregando configuração...</p>}
          
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
                    placeholder="Adicionar Prêmio/Opção..." 
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

          {/* OTHER GAMES (Hidden in Editor Mode if activeTab != game) */}
          {activeTab === 'slots' && <SlotGame onFinish={(m) => setWinner(m)} />}
          {activeTab === 'jokenpo' && <JokenpoGame onFinish={(r) => setWinner(r)} />}
          {activeTab === 'memory' && <MemoryGame onFinish={(r) => setWinner(r)} />}
          {activeTab === 'scratch' && <ScratchGame onFinish={(r) => setWinner(r)} />}
          {activeTab === 'tictactoe' && <TicTacToeGame onFinish={(r) => setWinner(r)} />}
          {activeTab === 'whack' && <WhackAMoleGame onFinish={(r) => setWinner(r)} />}
          {activeTab === 'simon' && <SimonGame onFinish={(r) => setWinner(r)} />}
          {activeTab === 'guess' && <GuessNumberGame onFinish={(r) => setWinner(r)} />}
          {activeTab === 'hangman' && <HangmanGame onFinish={(r) => setWinner(r)} />}

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
