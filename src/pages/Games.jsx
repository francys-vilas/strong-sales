import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trophy, RotateCw, Plus, Trash2, X, Sword, Grid, Eraser, Ticket, Target, Lightbulb, Keyboard, Shuffle } from 'lucide-react';
import './Games.css';

const DEFAULT_PARTICIPANTS = [
  'Maria Silva', 'João Souza', 'Ana Oliveira', 'Pedro Santos', 
  'Lucas Costa', 'Julia Lima', 'Marcos Pereira', 'Fernanda Alves'
];

const SLOT_ICONS = ['💎', '7️⃣', '🍒', '🍋', '🍇', '🔔', '⭐️', '🍀'];
const MEMORY_CARDS_DATA = ['🚀', '🌟', '🎩', '🎮', '🎸', '🎨', '🍕', '🏆'];
const HANGMAN_WORDS = ['VENDA', 'CLIENTE', 'SUCESSO', 'LUCRO', 'META', 'EQUIPE', 'LIDER', 'PREMIO'];

const Games = () => {
  const [activeTab, setActiveTab] = useState('roulette');
  
  // ================= ROULETTE STATE =================
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [newParticipant, setNewParticipant] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  // ================= SLOT MACHINE STATE =================
  const [reels, setReels] = useState(['7️⃣', '7️⃣', '7️⃣']);
  const [isSlotSpinning, setIsSlotSpinning] = useState(false);
  const [slotMessage, setSlotMessage] = useState('');

  // ================= JOKENPO STATE =================
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [jokenpoResult, setJokenpoResult] = useState('');
  const [jokenpoScore, setJokenpoScore] = useState({ player: 0, computer: 0 });

  // ================= MEMORY GAME STATE =================
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // ================= SCRATCH CARD STATE =================
  const canvasRef = useRef(null);
  const [scratchPrize, setScratchPrize] = useState('Desconto de 15%');
  const [isScratched, setIsScratched] = useState(false);

  // ================= TIC TAC TOE STATE =================
  const [tttBoard, setTttBoard] = useState(Array(9).fill(null));
  const [tttIsXNext, setTttIsXNext] = useState(true);
  const [tttWinner, setTttWinner] = useState(null);

  // ================= WHACK A MOLE STATE =================
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [moleScore, setMoleScore] = useState(0);
  const [moleActive, setMoleActive] = useState(false);
  const moleTimerRef = useRef(null);

  // ================= SIMON STATE =================
  const [simonSequence, setSimonSequence] = useState([]);
  const [simonUserStep, setSimonUserStep] = useState(0);
  const [simonPlaying, setSimonPlaying] = useState(false);
  const [simonFlash, setSimonFlash] = useState(null);
  const [simonMessage, setSimonMessage] = useState('Clique em Jogar para começar');

  // ================= GUESS NUMBER STATE =================
  const [guessTarget, setGuessTarget] = useState(null);
  const [guessInput, setGuessInput] = useState('');
  const [guessMessage, setGuessMessage] = useState('Estou pensando em um número de 1 a 100...');
  const [guessAttempts, setGuessAttempts] = useState(0);

  // ================= HANGMAN STATE =================
  const [hangmanWord, setHangmanWord] = useState('');
  const [hangmanGuessed, setHangmanGuessed] = useState(new Set());
  const [hangmanErrors, setHangmanErrors] = useState(0);
  const [hangmanStatus, setHangmanStatus] = useState('playing'); // playing, won, lost

  // ================= ROULETTE LOGIC =================
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
    const spins = 1800 + Math.random() * 1800;
    const newRotation = rotation + spins;
    setRotation(newRotation);
    setTimeout(() => {
      setIsSpinning(false);
      const segmentAngle = 360 / participants.length;
      const currentAngle = newRotation % 360;
      const winningIndex = Math.floor(((360 - currentAngle) % 360) / segmentAngle);
      setWinner(participants[winningIndex >= 0 ? winningIndex : 0] || participants[0]);
    }, 5000);
  };

  // ================= SLOT LOGIC =================
  const spinSlots = () => {
    if (isSlotSpinning) return;
    setIsSlotSpinning(true);
    setSlotMessage('');
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
    const finalReels = [
      SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
      SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)],
      SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)]
    ];
    if (Math.random() > 0.8) finalReels[0] = finalReels[1] = finalReels[2] = '💎';
    setReels(finalReels);
    setIsSlotSpinning(false);
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      setSlotMessage('JACKPOT! 🎉 VOCÊ GANHOU!');
      setWinner('JACKPOT');
    } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      setSlotMessage('Quase lá! 2 iguais!');
    } else {
      setSlotMessage('Tente novamente!');
    }
  };

  // ================= JOKENPO LOGIC =================
  const playJokenpo = (choice) => {
    setPlayerChoice(choice);
    let counter = 0;
    const options = ['rock', 'paper', 'scissors'];
    const interval = setInterval(() => {
      setComputerChoice(options[counter % 3]);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        finishJokenpo(choice);
      }
    }, 100);
  };

  const finishJokenpo = (player) => {
    const options = ['rock', 'paper', 'scissors'];
    const computer = options[Math.floor(Math.random() * 3)];
    setComputerChoice(computer);
    if (player === computer) {
      setJokenpoResult('Empate!');
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      setJokenpoResult('Você Venceu! 🎉');
      setJokenpoScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setJokenpoResult('Computador Venceu!');
      setJokenpoScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
  };

  // ================= MEMORY GAME LOGIC =================
  const initMemoryGame = () => {
    const shuffledCards = [...MEMORY_CARDS_DATA, ...MEMORY_CARDS_DATA]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));
    setMemoryCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
  };

  useEffect(() => { if (activeTab === 'memory' && memoryCards.length === 0) initMemoryGame(); }, [activeTab]);

  const handleCardClick = (id) => {
    if (flippedCards.length === 2) return;
    const cardIndex = memoryCards.findIndex(c => c.id === id);
    if (memoryCards[cardIndex].isMatched || memoryCards[cardIndex].isFlipped) return;
    const newCards = [...memoryCards];
    newCards[cardIndex].isFlipped = true;
    setMemoryCards(newCards);
    const newFlipped = [...flippedCards, newCards[cardIndex]];
    setFlippedCards(newFlipped);
    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      if (newFlipped[0].emoji === newFlipped[1].emoji) {
        setMatchedCards([...matchedCards, newFlipped[0].id, newFlipped[1].id]);
        setFlippedCards([]);
        if (matchedCards.length + 2 === memoryCards.length) setTimeout(() => setWinner('VOCÊ VENCEU O JOGO DA MEMÓRIA!'), 500);
      } else {
        setTimeout(() => {
          const resetCards = [...memoryCards];
          resetCards[resetCards.findIndex(c => c.id === newFlipped[0].id)].isFlipped = false;
          resetCards[resetCards.findIndex(c => c.id === newFlipped[1].id)].isFlipped = false;
          setMemoryCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // ================= SCRATCH CARD LOGIC =================
  useEffect(() => {
    if (activeTab === 'scratch' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '30px Inter';
      ctx.fillStyle = '#64748b';
      ctx.fillText('RASPE AQUI', 100, 150);
      let isDrawing = false;
      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return { x: (e.clientX || e.touches[0].clientX) - rect.left, y: (e.clientY || e.touches[0].clientY) - rect.top };
      };
      const scratch = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
        ctx.fill();
        const pixels = ctx.getImageData(0, 0, width, height).data;
        let transparent = 0;
        for (let i = 0; i < pixels.length; i += 4) if (pixels[i + 3] === 0) transparent++;
        if (transparent / (pixels.length / 4) > 0.5) setIsScratched(true);
      };
      canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
      canvas.addEventListener('mousemove', scratch);
      canvas.addEventListener('mouseup', () => isDrawing = false);
      canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
      canvas.addEventListener('touchmove', scratch);
      canvas.addEventListener('touchend', () => isDrawing = false);
    }
  }, [activeTab]);

  const resetScratch = () => {
    setIsScratched(false);
    setScratchPrize(Math.random() > 0.5 ? 'Ganhou um Café!' : 'Tente Novamente!');
    setActiveTab('home'); setTimeout(() => setActiveTab('scratch'), 10);
  };

  // ================= TIC TAC TOE LOGIC =================
  const calculateTttWinner = (squares) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleTttClick = (i) => {
    if (tttWinner || tttBoard[i]) return;
    const newBoard = [...tttBoard];
    newBoard[i] = tttIsXNext ? 'X' : 'O';
    setTttBoard(newBoard);
    const win = calculateTttWinner(newBoard);
    if (win) setTttWinner(win);
    else if (!newBoard.includes(null)) setTttWinner('Draw');
    else setTttIsXNext(!tttIsXNext);
  };

  const resetTtt = () => {
    setTttBoard(Array(9).fill(null));
    setTttIsXNext(true);
    setTttWinner(null);
  };

  // ================= WHACK A MOLE LOGIC =================
  const startMoleGame = () => {
    if (moleActive) return;
    setMoleScore(0);
    setMoleActive(true);
    let intervalId;
    let gameTimeout;
    
    const popupMole = () => {
      const idx = Math.floor(Math.random() * 9);
      setMoles(prev => { const n = Array(9).fill(false); n[idx] = true; return n; });
      setTimeout(() => setMoles(Array(9).fill(false)), 800);
    };

    intervalId = setInterval(popupMole, 1000);
    
    gameTimeout = setTimeout(() => {
      clearInterval(intervalId);
      setMoleActive(false);
      setMoles(Array(9).fill(false));
      setWinner(`Fim! Pontuação: ${moleScore}`); // Using winner overlay to show score
    }, 15000); // 15 seconds game
    
    moleTimerRef.current = { intervalId, gameTimeout };
  };

  const whackMole = (idx) => {
    if (!moles[idx]) return;
    setMoleScore(prev => prev + 1);
    setMoles(prev => { const n = [...prev]; n[idx] = false; return n; });
  };
  
  // ================= SIMON LOGIC =================
  const simonColors = ['green', 'red', 'yellow', 'blue'];
  
  const playSimonSequence = async (seq) => {
    setSimonPlaying(false); // disable input
    for (let i = 0; i < seq.length; i++) {
        await new Promise(r => setTimeout(r, 500));
        setSimonFlash(seq[i]);
        await new Promise(r => setTimeout(r, 500));
        setSimonFlash(null);
    }
    setSimonPlaying(true); // enable input
  };

  const startSimon = () => {
    const startSeq = [simonColors[Math.floor(Math.random() * 4)]];
    setSimonSequence(startSeq);
    setSimonUserStep(0);
    setSimonMessage('Memorize a sequência!');
    playSimonSequence(startSeq);
  };

  const handleSimonClick = (color) => {
    if (!simonPlaying) return;
    setSimonFlash(color);
    setTimeout(() => setSimonFlash(null), 200);

    if (color === simonSequence[simonUserStep]) {
        if (simonUserStep + 1 === simonSequence.length) {
            // Correct full sequence
            setSimonMessage('Muito bem! Próximo nível...');
            const nextSeq = [...simonSequence, simonColors[Math.floor(Math.random() * 4)]];
            setSimonSequence(nextSeq);
            setSimonUserStep(0);
            setTimeout(() => playSimonSequence(nextSeq), 1000);
        } else {
            setSimonUserStep(simonUserStep + 1);
        }
    } else {
        setSimonMessage('Errou! Tente de novo.');
        setSimonPlaying(false);
        setSimonSequence([]);
    }
  };

  // ================= GUESS NUMBER LOGIC =================
  const startGuessGame = () => {
    setGuessTarget(Math.floor(Math.random() * 100) + 1);
    setGuessMessage('Estou pensando em um número de 1 a 100...');
    setGuessAttempts(0);
    setGuessInput('');
  };

  const handleGuess = () => {
    const val = parseInt(guessInput);
    if (!val) return;
    setGuessAttempts(prev => prev + 1);
    if (val === guessTarget) {
        setGuessMessage(`ACERTOU! O número era ${guessTarget}. Tentativas: ${guessAttempts + 1}`);
        setWinner('ACERTOU O NÚMERO!');
    } else if (val < guessTarget) {
        setGuessMessage('Tente um número MAIOR.');
    } else {
        setGuessMessage('Tente um número MENOR.');
    }
    setGuessInput('');
  };

  // ================= HANGMAN LOGIC =================
  const startHangman = () => {
    const word = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
    setHangmanWord(word);
    setHangmanGuessed(new Set());
    setHangmanErrors(0);
    setHangmanStatus('playing');
  };

  const handleHangmanGuess = (letter) => {
    if (hangmanStatus !== 'playing' || hangmanGuessed.has(letter)) return;
    const newGuessed = new Set(hangmanGuessed);
    newGuessed.add(letter);
    setHangmanGuessed(newGuessed);
    
    if (!hangmanWord.includes(letter)) {
        const newErrors = hangmanErrors + 1;
        setHangmanErrors(newErrors);
        if (newErrors >= 6) setHangmanStatus('lost');
    } else {
        const isWon = hangmanWord.split('').every(l => newGuessed.has(l));
        if (isWon) setHangmanStatus('won');
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
          <button className={`game-tab ${activeTab === 'roulette' ? 'active' : ''}`} onClick={() => setActiveTab('roulette')}>🎡 Roleta</button>
          <button className={`game-tab ${activeTab === 'slots' ? 'active' : ''}`} onClick={() => setActiveTab('slots')}>🎰 Caça-Níquel</button>
          <button className={`game-tab ${activeTab === 'jokenpo' ? 'active' : ''}`} onClick={() => setActiveTab('jokenpo')}>✌️ Jokenpô</button>
          <button className={`game-tab ${activeTab === 'memory' ? 'active' : ''}`} onClick={() => setActiveTab('memory')}>🧠 Memória</button>
          <button className={`game-tab ${activeTab === 'scratch' ? 'active' : ''}`} onClick={() => setActiveTab('scratch')}>🎫 Raspadinha</button>
          <button className={`game-tab ${activeTab === 'tictactoe' ? 'active' : ''}`} onClick={() => setActiveTab('tictactoe')}><Grid size={16}/> Velha</button>
          <button className={`game-tab ${activeTab === 'whack' ? 'active' : ''}`} onClick={() => setActiveTab('whack')}><Target size={16}/> Alvo</button>
          <button className={`game-tab ${activeTab === 'simon' ? 'active' : ''}`} onClick={() => setActiveTab('simon')}><Lightbulb size={16}/> Genius</button>
          <button className={`game-tab ${activeTab === 'guess' ? 'active' : ''}`} onClick={() => setActiveTab('guess')}><Shuffle size={16}/> Adivinhe</button>
          <button className={`game-tab ${activeTab === 'hangman' ? 'active' : ''}`} onClick={() => setActiveTab('hangman')}><Keyboard size={16}/> Forca</button>
        </div>

        <div className="game-container">
          {/* ... Existing Games (Simplified for brevity in replace logic since I use full file replace, I must keep them present) */}
          
          {/* ROULETTE */}
          {activeTab === 'roulette' && (
            <div className="roulette-wrapper">
              <div className="wheel-container">
                <div className="wheel-marker"></div>
                <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}></div>
              </div>
              <div className="roulette-controls">
                <div className="input-group">
                  <input type="text" className="input-field" placeholder="Adicionar nome..." value={newParticipant} onChange={(e) => setNewParticipant(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()} />
                  <button className="btn btn-secondary" onClick={handleAddParticipant}><Plus size={20} /></button>
                </div>
                <div className="participants-list">
                  {participants.map((p, i) => (
                    <div key={i} className="participant-item">
                      <span>{p}</span>
                      <button onClick={() => handleRemoveParticipant(i)} className="text-danger"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                <button className="btn-spin" onClick={spinRoulette} disabled={isSpinning || participants.length < 2}>{isSpinning ? 'Girando...' : 'SORTEAR AGORA'}</button>
              </div>
            </div>
          )}

          {/* SLOT MACHINE */}
          {activeTab === 'slots' && (
            <div className="slot-machine">
               <div className="slot-window">
                 {reels.map((icon, i) => (<div key={i} className={`reel ${isSlotSpinning ? 'spinning' : ''}`}>{icon}</div>))}
               </div>
               <div className="slot-controls">
                 <button className="btn-spin" onClick={spinSlots} disabled={isSlotSpinning} style={{ width: '100%' }}>{isSlotSpinning ? 'Girando...' : 'ALAVANCAR'}</button>
                 <div className="slot-message">{slotMessage}</div>
               </div>
            </div>
          )}

          {/* JOKENPO */}
          {activeTab === 'jokenpo' && (
            <div className="jokenpo-board">
              <div className="score-board">
                <div className="score-item">Você: {jokenpoScore.player}</div>
                <div className="score-vs">VS</div>
                <div className="score-item">PC: {jokenpoScore.computer}</div>
              </div>
              <div className="jokenpo-arena">
                 <div className="fighter"><p>Você</p><div className="hand-icon">{playerChoice === 'rock' ? '✊' : playerChoice === 'paper' ? '✋' : playerChoice === 'scissors' ? '✌️' : '❓'}</div></div>
                 <div className="fighter"><p>Computador</p><div className="hand-icon">{computerChoice === 'rock' ? '✊' : computerChoice === 'paper' ? '✋' : computerChoice === 'scissors' ? '✌️' : '💻'}</div></div>
              </div>
              <div className="result-display">{jokenpoResult}</div>
              <div className="jokenpo-controls">
                <button className="btn-move" onClick={() => playJokenpo('rock')}>✊ Pedra</button>
                <button className="btn-move" onClick={() => playJokenpo('paper')}>✋ Papel</button>
                <button className="btn-move" onClick={() => playJokenpo('scissors')}>✌️ Tesoura</button>
              </div>
            </div>
          )}

          {/* MEMORY */}
          {activeTab === 'memory' && (
            <div className="memory-board">
              <div className="memory-stats">Movimentos: {memoryMoves}</div>
              <div className="memory-grid">
                {memoryCards.map((card) => (
                   <div key={card.id} className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`} onClick={() => handleCardClick(card.id)}>
                     <div className="card-inner"><div className="card-front">?</div><div className="card-back">{card.emoji}</div></div>
                   </div>
                ))}
              </div>
              <button className="btn btn-secondary mt-4" onClick={initMemoryGame}>Reiniciar</button>
            </div>
          )}

          {/* SCRATCH */}
          {activeTab === 'scratch' && (
            <div className="scratch-wrapper">
               <h2>Raspadinha Premiada</h2>
               <p>Arraste para raspar!</p>
               <div className="scratch-container">
                 <div className="scratch-prize">{scratchPrize}</div>
                 <canvas ref={canvasRef} width={300} height={200} className="scratch-canvas"></canvas>
               </div>
               {isScratched && <button className="btn btn-primary mt-4" onClick={resetScratch}>Nova Raspadinha</button>}
            </div>
          )}

          {/* TIC TAC TOE */}
          {activeTab === 'tictactoe' && (
              <div className="ttt-wrapper">
                  <h2>Jogo da Velha</h2>
                  <div className="ttt-board">
                      {tttBoard.map((cell, i) => (
                          <div key={i} className="ttt-cell" onClick={() => handleTttClick(i)}>
                              {cell}
                          </div>
                      ))}
                  </div>
                  {tttWinner && (
                      <div className="mt-4 text-center">
                          <h3>{tttWinner === 'Draw' ? 'Empate!' : `Vencedor: ${tttWinner}`}</h3>
                          <button className="btn btn-primary mt-2" onClick={resetTtt}>Jogar Novamente</button>
                      </div>
                  )}
              </div>
          )}

          {/* WHACK A MOLE */}
          {activeTab === 'whack' && (
              <div className="whack-wrapper">
                  <h2>Acerte a Toupeira</h2>
                  <div className="score-display">Pontos: {moleScore}</div>
                  {!moleActive ? (
                      <button className="btn btn-primary mb-4" onClick={startMoleGame}>Começar Jogo (15s)</button>
                  ) : (
                      <div className="whack-grid">
                          {moles.map((isMole, i) => (
                              <div key={i} className={`mole-hole ${isMole ? 'active' : ''}`} onClick={() => whackMole(i)}>
                                  {isMole && '🐹'}
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* SIMON */}
          {activeTab === 'simon' && (
              <div className="simon-wrapper">
                  <h2>Genius (Simon)</h2>
                  <p>{simonMessage}</p>
                  <div className="simon-board">
                      {simonColors.map(color => (
                          <div 
                              key={color} 
                              className={`simon-btn ${color} ${simonFlash === color ? 'flash' : ''}`}
                              onClick={() => handleSimonClick(color)}
                          ></div>
                      ))}
                  </div>
                  {!simonPlaying && simonSequence.length === 0 && (
                      <button className="btn btn-primary mt-4" onClick={startSimon}>Jogar</button>
                  )}
              </div>
          )}

          {/* GUESS NUMBER */}
          {activeTab === 'guess' && (
              <div className="guess-wrapper">
                  <h2>Adivinhe o Número (1-100)</h2>
                  {!guessTarget ? (
                      <button className="btn btn-primary" onClick={startGuessGame}>Iniciar Jogo</button>
                  ) : (
                      <>
                          <p className="guess-hint">{guessMessage}</p>
                          <div className="input-group" style={{ maxWidth: '300px', margin: '0 auto' }}>
                              <input 
                                  type="number" 
                                  className="input-field" 
                                  value={guessInput} 
                                  onChange={(e) => setGuessInput(e.target.value)}
                                  placeholder="Digite um número"
                              />
                              <button className="btn btn-primary" onClick={handleGuess}>Chutar</button>
                          </div>
                      </>
                  )}
              </div>
          )}

          {/* HANGMAN */}
          {activeTab === 'hangman' && (
              <div className="hangman-wrapper">
                  <h2>Jogo da Forca</h2>
                  {!hangmanWord ? (
                      <button className="btn btn-primary" onClick={startHangman}>Nova Palavra</button>
                  ) : (
                      <>
                          <div className="hangman-drawing">Errors: {hangmanErrors} / 6</div>
                          <div className="hangman-word">
                              {hangmanWord.split('').map((char, i) => (
                                  <span key={i} className="hangman-char">
                                      {hangmanGuessed.has(char) || hangmanStatus !== 'playing' ? char : '_'}
                                  </span>
                              ))}
                          </div>
                          {hangmanStatus !== 'playing' ? (
                              <div className="mt-4">
                                  <h3>{hangmanStatus === 'won' ? 'VOCÊ VENCEU!' : `PERDEU! A palavra era ${hangmanWord}`}</h3>
                                  <button className="btn btn-primary mt-2" onClick={startHangman}>Jogar Novamente</button>
                              </div>
                          ) : (
                              <div className="hangman-keyboard">
                                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
                                      <button 
                                          key={char} 
                                          className="key-btn" 
                                          onClick={() => handleHangmanGuess(char)}
                                          disabled={hangmanGuessed.has(char)}
                                      >
                                          {char}
                                      </button>
                                  ))}
                              </div>
                          )}
                      </>
                  )}
              </div>
          )}

          {winner && winner !== 'JACKPOT' && !moleActive && (
            <div className="winner-overlay">
              <div className="winner-card">
                <Trophy size={64} className="text-warning mb-4" />
                <h2>{winner.includes('Pontuação') ? 'Fim de Jogo' : 'VENCEDOR!'}</h2>
                <div className="winner-name">{winner}</div>
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
