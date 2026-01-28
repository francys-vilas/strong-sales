import React, { useState, useEffect } from 'react';
import { Trophy, RotateCw, Plus, Trash2, Grid, Target, Lightbulb, Keyboard, Shuffle, Save, ArrowLeft, Palette, Gift, Tag, Percent, DollarSign, CreditCard, ShoppingBag, Truck, Star, Heart, Smile, ThumbsUp, Settings, X, Ticket, ChevronDown, Check, Copy } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './Games.module.css';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';

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

const ICON_MAP = {
  'Gift': Gift, 'Tag': Tag, 'Percent': Percent, 'Dollar': DollarSign, 
  'Card': CreditCard, 'Bag': ShoppingBag, 'Truck': Truck, 
  'Star': Star, 'Heart': Heart, 'Smile': Smile, 'Like': ThumbsUp
};

const DEFAULT_PRIZES = [
  { label: '5% OFF', color: '#ef4444', probability: 25, icon: 'Tag' },
  { label: '10% OFF', color: '#3b82f6', probability: 25, icon: 'Percent' },
  { label: 'Frete Grátis', color: '#22c55e', probability: 25, icon: 'Truck' },
  { label: 'Ganhou Nada', color: '#94a3b8', probability: 25, icon: 'Smile' },
];

const Games = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // Initialize from URL but allow local toggle
  const [isEditorMode, setIsEditorMode] = useState(searchParams.get('mode') === 'edit');
  
  const campaignId = searchParams.get('campaignId');
  const gameType = searchParams.get('gameType') || 'roulette';

  const [activeTab, setActiveTab] = useState(gameType);
  const [winner, setWinner] = useState(null);
  
  // Editor State
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);

  // Roulette/Game settings
  const [prizes, setPrizes] = useState(DEFAULT_PRIZES);
  
  // New Prize Input State
  const [newPrizeLabel, setNewPrizeLabel] = useState('');
  const [newPrizeColor, setNewPrizeColor] = useState('#8b5cf6'); // Default purple
  const [newPrizeIcon, setNewPrizeIcon] = useState('Gift');

  const [templateId, setTemplateId] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [organizationId, setOrganizationId] = useState(null);

  // Sync state with URL param only on mount/change if needed
  useEffect(() => {
    setIsEditorMode(searchParams.get('mode') === 'edit');
  }, [searchParams]);

  // Handle Toggle Editor
  const toggleEditor = () => {
    const newMode = !isEditorMode;
    setIsEditorMode(newMode);
    
    // Update URL to reflect state
    const newParams = new URLSearchParams(searchParams);
    if (newMode) {
      newParams.set('mode', 'edit');
    } else {
      newParams.delete('mode');
    }
    setSearchParams(newParams);
  };

  // Load Data
  useEffect(() => {
    if (campaignId) {
      loadCampaignAndTemplate();
    } else if (searchParams.get('templateId')) {
        // Direct template load (future use)
        loadTemplateDirectly(searchParams.get('templateId'));
    }
    
    if (gameType) {
        setActiveTab(gameType);
    }
  }, [campaignId, gameType]);

  const [availableTemplates, setAvailableTemplates] = useState([]);

  // Fetch Organization ID if not loaded via campaign (for standalone Template creation)
  useEffect(() => {
      const fetchOrg = async () => {
          if (!organizationId) {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                  const { data: profile } = await supabase
                      .from('profiles')
                      .select('organization_id')
                      .eq('id', user.id)
                      .single();
                  if (profile) setOrganizationId(profile.organization_id);
              }
          }
      };
      
      // Only fetch if we didn't get it from campaign
      if (!campaignId) {
          fetchOrg();
      }
  }, [campaignId, organizationId]);

  // Fetch Available Templates for Sidebar
  useEffect(() => {
      const fetchTemplates = async () => {
          if (organizationId) {
              const { data, error } = await supabase
                  .from('game_templates')
                  .select('id, name')
                  .eq('organization_id', organizationId)
                  .eq('game_type', activeTab);
              
              if (data) {
                  setAvailableTemplates(data);
              }
          }
      };
      
      fetchTemplates();
  }, [organizationId, activeTab, savingConfig]); // Refresh list when saving/changing game

  const loadCampaignAndTemplate = async () => {
    setLoadingConfig(true);
    try {
      // 1. Get Campaign Info (Org + Linked Template)
      const { data: campaign, error: campError } = await supabase
        .from('campaigns')
        .select('organization_id, game_template_id')
        .eq('id', campaignId)
        .single();
      
      if (campError) throw campError;
      setOrganizationId(campaign.organization_id);

      // 2. If has template, load it. Else default.
      if (campaign.game_template_id) {
          setTemplateId(campaign.game_template_id);
          const { data: template, error: tempError } = await supabase
            .from('game_templates')
            .select('*')
            .eq('id', campaign.game_template_id)
            .single();
          
          if (tempError) throw tempError;

          if (template) {
            setTemplateName(template.name);
            setGameConfig(template.config || {});
            setPrizes(template.config?.prizes || DEFAULT_PRIZES);
            // Also update active tab to match template type?
            // setActiveTab(template.game_type); 
          }
      } else {
        // No template linked -> default state
        setGameConfig({}); 
        setPrizes(DEFAULT_PRIZES);
        setTemplateName('Novo Modelo');
      }
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Erro ao carregar dados.");
    } finally {
        setLoadingConfig(false);
    }
  };

  const loadTemplateDirectly = async (id) => {
      setLoadingConfig(true);
      try {
          // If loading directly, we need to respect the organization check (RLS handles this mostly)
          // But we should also verify if we have org info loaded? 
          // Actually, just loading by ID is fine, RLS protects us.
          const { data: template, error } = await supabase
              .from('game_templates')
              .select('*')
              .eq('id', id)
              .single();
          
          if (error) throw error;

          if (template) {
              setTemplateId(template.id);
              setTemplateName(template.name);
              setGameConfig(template.config || {});
              setPrizes(template.config?.prizes || DEFAULT_PRIZES);
              // setActiveTab(template.game_type); // Optional: Force game type to match template?
          }
      } catch (err) {
          console.error("Error loading template directly:", err);
          toast.error("Erro ao carregar modelo.");
      } finally {
          setLoadingConfig(false);
      }
  };

  const saveTemplate = async () => {
      if (!organizationId) {
        toast.error("Erro: Organização não identificada.");
        return;
      }
      if (!templateName.trim()) {
          toast.error("Digite um nome para o modelo.");
          return;
      }

      setSavingConfig(true);
      try {
          const configToSave = {
              ...gameConfig,
              prizes: prizes
          };

          let currentTemplateId = templateId;

          // 1. Upsert Template
          const templateData = {
              organization_id: organizationId,
              name: templateName,
              game_type: activeTab,
              config: configToSave
          };

          let error;
          let newTemplate;

          if (templateId) {
              // Update existing
              const { error: upError } = await supabase
                  .from('game_templates')
                  .update(templateData)
                  .eq('id', templateId);
              error = upError;
          } else {
              // Create new
              const { data, error: insError } = await supabase
                  .from('game_templates')
                  .insert([templateData])
                  .select()
                  .single();
              error = insError;
              newTemplate = data;
              if (data) currentTemplateId = data.id;
          }

          if (error) throw error;

          // 2. Link to Campaign if connected
          if (campaignId && (!templateId || newTemplate)) {
              const { error: linkError } = await supabase
                  .from('campaigns')
                  .update({ game_template_id: currentTemplateId })
                  .eq('id', campaignId);
              
              if (linkError) throw linkError;
          }

          setTemplateId(currentTemplateId);
          
          // CRITICAL FIX: Update URL so refresh keeps the template loaded
          const newParams = new URLSearchParams(searchParams);
          newParams.set('templateId', currentTemplateId);
          setSearchParams(newParams);

          toast.success("Modelo salvo e vinculado!");
      } catch (err) {
          console.error("Error saving template:", err);
          toast.error("Erro ao salvar modelo.");
      } finally {
          setSavingConfig(false);
      }
  };

  const handleDuplicate = () => {
      setTemplateId(null); // Clear ID to force new creation
      setTemplateName(`${templateName} (Cópia)`); // Append suffix
      
      // Clear URL param to reflect "New" state
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('templateId');
      setSearchParams(newParams);
      
      toast.success("Modelo duplicado! Salve para persistir.");
  };

  const handleAddPrize = () => {
    if (newPrizeLabel.trim()) {
      setPrizes([...prizes, { 
          label: newPrizeLabel.trim(), 
          color: newPrizeColor,
          probability: 0, 
          icon: newPrizeIcon
      }]);
      setNewPrizeLabel('');
      // Random color for next
      const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
      setNewPrizeColor(colors[Math.floor(Math.random() * colors.length)]);
      toast.success('Prêmio adicionado!');
    }
  };

  const handleRemovePrize = (index) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const handleColorChange = (index, color) => {
      const newPrizes = [...prizes];
      newPrizes[index].color = color;
      setPrizes(newPrizes);
  };

  // State for Game Selector Modal
  const [showGameSelector, setShowGameSelector] = useState(false);

  // Available Games Configuration
  const AVAILABLE_GAMES = [
    { id: 'roulette', label: 'Roleta', icon: RotateCw, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'slots', label: 'Caça-Níquel', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'jokenpo', label: 'Jokenpô', icon: Star, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'memory', label: 'Memória', icon:  Lightbulb, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'scratch', label: 'Raspadinha', icon: Ticket, color: 'text-red-500', bg: 'bg-red-50' }, // Using Ticket as proxy for Scratch if needed or existing icon
    { id: 'tictactoe', label: 'Velha', icon: Grid, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'whack', label: 'Alvo', icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'simon', label: 'Genius', icon: Lightbulb, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'guess', label: 'Adivinhe', icon: Shuffle, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'hangman', label: 'Forca', icon: Keyboard, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  // Helper to get current game label
  const currentGameLabel = AVAILABLE_GAMES.find(g => g.id === activeTab)?.label || 'Jogo';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditorMode ? 'Configurar Jogo' : 'Área de Jogos'}</h1>
          <p className="page-subtitle">
            {isEditorMode ? 'Personalize o jogo da sua campanha' : 'Gamificação para premiar seus melhores clientes e vendedores'}
          </p>
        </div>
      </div>

       <div className={`${styles.gamesLayout} ${isEditorMode ? styles.withSidebar : ''}`}>
        
        <div className={styles.gameContainer}>
            {/* TOP LEFT: Game Switcher Button */}
            <button 
                className={styles.gameSwitcherBtn}
                onClick={() => setShowGameSelector(true)}
                title="Trocar de Jogo"
            >
                <Grid size={18} />
                <span style={{fontWeight: 600}}>{currentGameLabel}</span>
                <ChevronDown size={14} style={{opacity: 0.6}} />
            </button>


            {/* TOP RIGHT: Config Toggle Button (Embedded) */}
            {!isEditorMode && (
                <button 
                    className={styles.configToggleBtn}
                    onClick={toggleEditor}
                    title="Configurar Jogo"
                >
                    <Settings size={20} />
                </button>
            )}

            {loadingConfig && <p>Carregando configuração...</p>}
          
          <div className={styles.gameContentArea}>
            {/* ROULETTE */}
            {activeTab === 'roulette' && (
                <div className={styles.rouletteWrapper}>
                <div style={{ textAlign: 'center', marginBottom: '1rem', width: '100%' }}>
                    {!isEditorMode && <h3 style={{color: '#64748b'}}>Tente a Sorte!</h3>}
                </div>
                <RouletteGame 
                        participants={prizes.map(p => p.label)}
                        colors={prizes.map(p => p.color)}
                        items={prizes.map(p => ({
                            ...p,
                            icon: p.icon ? ICON_MAP[p.icon] : null
                        }))}
                        onFinish={(p) => setWinner(p)} 
                />
                </div>
            )}

            {activeTab === 'slots' && <SlotGame onFinish={setWinner} />}
            {activeTab === 'jokenpo' && <JokenpoGame onFinish={setWinner} />}
            {activeTab === 'memory' && <MemoryGame onFinish={setWinner} />}
            {activeTab === 'scratch' && <ScratchGame onFinish={setWinner} />}
            {activeTab === 'tictactoe' && <TicTacToeGame onFinish={setWinner} />}
            {activeTab === 'whack' && <WhackAMoleGame onFinish={setWinner} />}
            {activeTab === 'simon' && <SimonGame onFinish={setWinner} />}
            {activeTab === 'guess' && <GuessNumberGame onFinish={setWinner} />}
            {activeTab === 'hangman' && <HangmanGame onFinish={setWinner} />}

            {winner && (
                <div className={styles.winnerOverlay}>
                <div className={styles.winnerCard}>
                    <Trophy size={64} className="text-warning mb-4" />
                    <h2>PARABÉNS!</h2>
                    <div className={styles.winnerName}>{winner}</div>
                    <button className="btn btn-primary mt-4" onClick={() => setWinner(null)}>
                    <RotateCw size={20} className="mr-2" /> Tentar Novamente
                    </button>
                </div>
                </div>
            )}
          </div>

          {/* GAME SELECTOR MODAL OVERLAY */}
          {showGameSelector && (
            <div className={styles.gameSelectorOverlay} onClick={() => setShowGameSelector(false)}>
                <div className={styles.gameSelectorModal} onClick={e => e.stopPropagation()}>
                    <div className={styles.gameSelectorHeader}>
                        <h3>Escolha um Jogo</h3>
                        <button onClick={() => setShowGameSelector(false)}><X size={18} /></button>
                    </div>
                    <div className={styles.gameGrid}>
                        {AVAILABLE_GAMES.map(game => (
                            <button 
                                key={game.id} 
                                className={`${styles.gameOptionCard} ${activeTab === game.id ? styles.gameOptionActive : ''}`}
                                onClick={() => {
                                    setActiveTab(game.id);
                                    setShowGameSelector(false);
                                }}
                            >
                                <div className={`${styles.gameIconWrapper} ${game.color}`}>
                                    <game.icon size={24} />
                                </div>
                                <span>{game.label}</span>
                                {activeTab === game.id && <div className={styles.activeCheck}><Check size={12} /></div>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          )}
          </div> {/* Closing gameContainer */}

          {/* EMBEDDED SIDEBAR */}
          {isEditorMode && (
            <div className={styles.embeddedSidebar}>
                <div className={styles.editorHeader}>
                    <div className={styles.editorTitle}>
                        <Palette size={18} className="text-primary" /> Configurar
                    </div>
                    <button onClick={() => setIsEditorMode(false)} className={styles.btnCloseSidebar}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.editorContent}>
                    {/* Template Management Card */}
                    <div className={styles.cardEditor}>
                        {/* Header / Toolbar */}
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                GERENCIAR MODELOS
                            </span>
                            
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button 
                                    onClick={() => {
                                        setTemplateId(null);
                                        setTemplateName('Novo Modelo');
                                        setGameConfig({});
                                        setPrizes(DEFAULT_PRIZES);
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.delete('templateId');
                                        setSearchParams(newParams);
                                        toast.success("Iniciando novo modelo");
                                    }}
                                    className="btn-icon-small"
                                    title="Novo Modelo"
                                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                                >
                                    <Plus size={14} color="#3b82f6" />
                                </button>
                                <button 
                                    onClick={handleDuplicate}
                                    className="btn-icon-small"
                                    title="Duplicar Atual"
                                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                                >
                                    <Copy size={14} color="#f59e0b" />
                                </button>
                            </div>
                        </div>

                        <div className={styles.sectionContent}>
                             {/* Dropdown for Existing Templates */}
                             {availableTemplates.length > 0 && (
                                 <div className="input-field-group" style={{ marginBottom: '1rem' }}>
                                     <label style={{display: 'block', fontSize: '10px', marginBottom: '4px', color: '#64748b', fontWeight: '600'}}>SELECIONAR EXISTENTE</label>
                                     <select 
                                         className="input-field" 
                                         value={templateId || ''} 
                                         onChange={(e) => {
                                             const selectedId = e.target.value;
                                             if (selectedId) {
                                                 loadTemplateDirectly(selectedId);
                                                  const newParams = new URLSearchParams(searchParams);
                                                  newParams.set('templateId', selectedId);
                                                  setSearchParams(newParams);
                                             }
                                         }}
                                         style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc' }}
                                     >
                                         <option value="" disabled>-- Selecione --</option>
                                         {availableTemplates.map(t => (
                                             <option key={t.id} value={t.id}>{t.name}</option>
                                         ))}
                                     </select>
                                 </div>
                             )}

                            <div className="input-field-group">
                                <label style={{display: 'block', fontSize: '10px', marginBottom: '4px', color: '#64748b', fontWeight: '600'}}>
                                    NOME DO MODELO <span style={{fontWeight: 'normal', fontStyle: 'italic', marginLeft: '4px'}}>({templateId ? 'Editando' : 'Novo'})</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Ex: Roleta de Natal" 
                                    value={templateName} 
                                    onChange={(e) => setTemplateName(e.target.value)} 
                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '500' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.cardEditor}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>Novo Prêmio</span>
                        </div>
                        
                        <div className={styles.sectionContent}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <div className="input-field-group">
                                <label style={{display: 'block', fontSize: '10px', marginBottom: '2px', color: '#64748b', fontWeight: '600'}}>NOME</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    placeholder="Ex: 5% OFF" 
                                    value={newPrizeLabel} 
                                    onChange={(e) => setNewPrizeLabel(e.target.value)} 
                                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                />
                            </div>
                            
                            <div>
                                <label style={{display: 'block', fontSize: '10px', marginBottom: '2px', color: '#64748b', fontWeight: '600'}}>COR</label>
                                <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                                    <input 
                                        type="color" 
                                        value={newPrizeColor}
                                        onChange={(e) => setNewPrizeColor(e.target.value)}
                                        style={{ 
                                            position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' 
                                        }}
                                    />
                                    <div style={{ 
                                        width: '100%', height: '100%', backgroundColor: newPrizeColor, borderRadius: '4px', border: '2px solid #fff', boxShadow: '0 0 0 1px #cbd5e1' 
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                            <label style={{display: 'block', fontSize: '10px', marginBottom: '4px', color: '#64748b', fontWeight: '600'}}>ÍCONE</label>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {Object.entries(ICON_MAP).map(([key, IconComponent]) => (
                                    <button
                                        key={key}
                                        onClick={() => setNewPrizeIcon(key)}
                                        className={`btn-icon-select ${newPrizeIcon === key ? 'active' : ''}`}
                                        style={{
                                            padding: '4px',
                                            borderRadius: '4px',
                                            border: newPrizeIcon === key ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                            background: newPrizeIcon === key ? '#eff6ff' : '#fff',
                                            color: newPrizeIcon === key ? 'var(--color-primary)' : '#64748b',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                        title={key}
                                    >
                                        <IconComponent size={16} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            className="btn btn-primary" 
                            onClick={handleAddPrize}
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '6px', padding: '8px', fontSize: '13px', borderRadius: '6px' }}
                            disabled={!newPrizeLabel.trim()}
                        >
                            <Plus size={14} /> Adicionar
                        </button>
                    </div>
                </div>

                    <div className={styles.cardEditor}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>LISTA DE PRÊMIOS ({prizes.length})</span>
                        </div>
                        <div className={styles.sectionContent} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {prizes.map((p, i) => {
                                    const IconC = p.icon && ICON_MAP[p.icon] ? ICON_MAP[p.icon] : null;
                                    return (
                                        <div key={i} className={styles.sidebarPrizeItem}>
                                            <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
                                                <input 
                                                    type="color" 
                                                    value={p.color} 
                                                    onChange={(e) => handleColorChange(i, e.target.value)}
                                                    style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                                                />
                                                <div style={{ width: '100%', height: '100%', backgroundColor: p.color, borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                                            </div>
                                            
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.label}</div>
                                                {IconC && <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}><IconC size={10}/> {p.icon}</div>}
                                            </div>

                                            <button onClick={() => handleRemovePrize(i)} style={{ background: '#fee2e2', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', color: '#ef4444', display: 'flex' }} title="Remover">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                                {prizes.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem' }}>Sem prêmios.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.editorFooter}>
                    <button className={styles.btnSaveBig} onClick={saveTemplate} disabled={savingConfig}>
                        <Save size={18} /> {savingConfig ? 'SALVANDO...' : 'SALVAR MODELO'}
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default Games;
