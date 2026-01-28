import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Gift, Trophy, MessageCircle, User, Users } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import styles from './CampaignGame.module.css';
import RouletteGame from '../components/games/RouletteGame';
import SlotGame from '../components/games/SlotGame';
import ScratchGame from '../components/games/ScratchGame';
import CampaignTrail from '../components/games/CampaignTrail';

// Mock Campaign Data
const CAMPAIGNS = {
  '1': { 
      id: '1',
      name: 'Promoção Black Friday', 
      gameType: 'roulette', 
      prize: 'Cupom 20% OFF',
      platform: 'Instagram',
      action: 'Seguir e curtir foto',
      url: 'https://instagram.com/loja',
      nextId: '2'
  },
  '2': { 
      id: '2',
      name: 'Lançamento Verão', 
      gameType: 'slots', 
      prize: 'Brinde Exclusivo',
      platform: 'Facebook',
      action: 'Compartilhar postagem',
      url: 'https://facebook.com/loja',
      nextId: '3'
  },
  '3': { 
      id: '3',
      name: 'WhatsApp VIP', 
      gameType: 'scratch', 
      prize: 'Frete Grátis',
      platform: 'WhatsApp',
      action: 'Enviar mensagem',
      url: 'https://wa.me/5511999999999',
      nextId: '1' // Loop back for demo
  }
};

const formatPhone = (value) => {
  if (!value) return "";
  
  // Clean non digits
  const numbers = value.replace(/\D/g, "");
  
  // Limit to 11 digits
  const char = { 0: "(", 2: ") ", 7: "-" };
  let formatted = "";
  
  for (let i = 0; i < numbers.length; i++) {
      if (char[i]) formatted += char[i];
      formatted += numbers[i];
  }
  
  // Simple masking logic based on length
  // Or better: use standard replace logic
  let v = numbers;
  if (v.length > 11) v = v.slice(0, 11);
  
  if (v.length > 10) {
      return v.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (v.length > 5) {
      return v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (v.length > 2) {
      return v.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2");
  } else {
      return v.replace(/^(\d*)/, "($1");
  }
};

const CampaignGame = () => {
  const {
    campaign,
    loading,
    gameState,
    result,
    completedCampaigns,
    showAuthModal,
    phoneNumber,
    handlePhoneChange,
    leadSubmitting,
    handleLeadSubmit,
    showPrizeModal,
    setShowPrizeModal,
    prizeRecipient,
    setPrizeRecipient,
    friendName,
    setFriendName,
    friendPhone,
    setFriendPhone,
    showActionModal,
    setShowActionModal,
    pendingRedemption,
    handleAttemptPlay,
    handleGameFinish,
    handlePerformAction,
    handleRedeem,
    handleNodeClick,
    resetGuest
  } = useGame();

  const handlePlayNext = () => {
    // Redirect to the Smart Router to determine next step
    if (campaign?.organization_id) {
        window.location.href = `/app/${campaign.organization_id}`;
    } else {
        // Fallback or Mock
        const nextId = campaign?.nextId;
        if (nextId) window.location.href = `/play/${nextId}`;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Carregando jogo...</p>
      </div>
    );
  }

  return (
    <div className={gameState === 'trail' ? styles.trailBackground : styles.gameContainer}>
      {/* Guest Identification Bar */}
      {!showAuthModal && phoneNumber && (
        <div style={{
            background: 'rgba(255,255,255,0.9)', 
            padding: '0.5rem 1rem', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 100, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontSize: '0.8rem',
            backdropFilter: 'blur(4px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
            <span style={{color: '#64748b', marginRight: '0.5rem'}}>Jogando como:</span>
            <strong style={{color: '#334155'}}>{formatPhone(phoneNumber)}</strong>
            <button 
                onClick={resetGuest}
                style={{
                    marginLeft: '1rem', 
                    color: '#ef4444', 
                    textDecoration: 'underline', 
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                Trocar
            </button>
        </div>
      )}

      {/* Lead Capture Modal */}
      {showAuthModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <Trophy className={styles.modalIcon} size={48} />
            <h2 className={styles.modalTitle}>Bem-vindo ao Jogo!</h2>
            <p className={styles.modalText}>Informe seu WhatsApp para começar a jogar e concorrer a prêmios.</p>
            <form onSubmit={handleLeadSubmit}>
              <input 
                type="tel" 
                placeholder="(00) 00000-0000" 
                className={styles.input}
                value={formatPhone(phoneNumber)}
                onChange={handlePhoneChange}
                maxLength="15"
                required
              />
              <button type="submit" className={styles.submitButton} disabled={leadSubmitting}>
                {leadSubmitting ? 'SALVANDO...' : 'ENTRAR NO JOGO'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Action Verification Modal */}
      {showActionModal && (
        <div className={styles.overlay}>
          <div className={styles.modal} style={{ textAlign: 'left',  maxWidth: '450px' }}>
            <button 
              className={styles.backButton} 
              style={{ position: 'relative', top: 'auto', left: 'auto', marginBottom: '1rem', color: '#64748b', padding: 0 }}
              onClick={() => setShowActionModal(false)}
            >
              <ArrowLeft size={16} /> Voltar
            </button>

            <h2 className={styles.modalTitle} style={{ fontSize: '1.5rem' }}>Sua opinião é importante!</h2>
            
            <div className={styles.stepList}>
                <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>1</div>
                    <p>Vá ao <strong>{campaign.platform}</strong> e veja o <strong>{campaign.name}</strong></p>
                </div>
                <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>2</div>
                    <p>Realize a ação: <strong>{campaign.action}</strong></p>
                </div>
                <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>3</div>
                    <p>Volte ao jogo</p>
                </div>
                <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>4</div>
                    <p>Tente sua sorte</p>
                </div>
            </div>

            <p className={styles.modalText} style={{ fontSize: '0.9rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              Sua análise não influenciará nas chances do jogo
            </p>

            <button 
                className={styles.submitButton}
                onClick={handlePerformAction}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
                Ir para {campaign.platform} ({campaign.action})
            </button>
          </div>
        </div>
      )}

      {/* Prize Redemption Modal */}
      {showPrizeModal && (
        <div className={styles.overlay}>
          <div className={styles.modal} style={{ maxWidth: '500px' }}>
            <Gift className={styles.modalIcon} size={48} style={{ color: '#22c55e' }} />
            <h2 className={styles.modalTitle}>Parabéns! Você ganhou!</h2>
            <p className={styles.modalText}>Você ganhou: <strong>{result}</strong></p>
            
            <p style={{ marginBottom: '1rem', fontWeight: '600' }}>Para quem é este prêmio?</p>
            
            <div className={styles.recipientOptions}>
                <button 
                    className={`${styles.optionBtn} ${prizeRecipient === 'me' ? styles.optionActive : ''}`}
                    onClick={() => setPrizeRecipient('me')}
                >
                    <User size={20} />
                    Para Mim
                </button>
                <button 
                    className={`${styles.optionBtn} ${prizeRecipient === 'friend' ? styles.optionActive : ''}`}
                    onClick={() => setPrizeRecipient('friend')}
                >
                    <Users size={20} />
                    Para um Amigo
                </button>
            </div>

            {prizeRecipient === 'friend' && (
                <div className={styles.friendFields} style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                    <div className={styles.formGroup}>
                        <label>Nome do Amigo</label>
                        <input 
                            type="text" 
                            className={styles.input} 
                            placeholder="Ex: Maria Silva"
                            value={friendName}
                            onChange={(e) => setFriendName(e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                        <label>WhatsApp do Amigo</label>
                        <input 
                            type="tel" 
                            className={styles.input} 
                            placeholder="(00) 00000-0000"
                            value={friendPhone}
                            onChange={(e) => setFriendPhone(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <button 
                className={styles.submitButton} 
                style={{ marginTop: '2rem' }}
                onClick={handleRedeem}
                disabled={!prizeRecipient || (prizeRecipient === 'friend' && (!friendName || !friendPhone))}
            >
                RESGATAR PRÊMIO
            </button>
          </div>
        </div>
      )}

      {gameState !== 'trail' && (
        <header className={styles.header}>
            <button className={styles.backButton} onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
            <span>Sair do Jogo</span>
            </button>
            <div className={styles.brand}>
            {/* Icon removed per user request */}
            <span>{campaign?.organizations?.name || ''}</span>
            </div>
        </header>
      )}

      <div className={styles.gameWrapper} style={{ filter: (showAuthModal || showPrizeModal || showActionModal) ? 'blur(5px)' : 'none' }}>
        {gameState === 'trail' ? (
            <CampaignTrail 
                campaigns={CAMPAIGNS} 
                currentCampaignId={campaign.id}
                completedIds={completedCampaigns}
                onPlayNext={handlePlayNext}
                onNodeClick={handleNodeClick}
                pendingRedemptionId={pendingRedemption}
            />
        ) : (
          <div className={styles.gameContainerInside}>
            <GameDispatcher 
                type={campaign.gameType} 
                onAttemptPlay={handleAttemptPlay}
                onFinish={handleGameFinish}
                prize={campaign.prize}
                gameConfig={campaign.game_config}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Component to dispatch the correct game type
const GameDispatcher = ({ type, onFinish, onAttemptPlay, prize, gameConfig }) => {
    switch (type) {
      case 'roulette': 
        // Use configured prizes if available, otherwise default fallback
        const participants = gameConfig?.prizes?.map(p => p.label);
        return <RouletteGame 
                    onFinish={onFinish} 
                    onAttemptPlay={onAttemptPlay} 
                    participants={participants} 
               />;
      case 'slots': return <SlotGame onFinish={onFinish} onAttemptPlay={onAttemptPlay} />; // TODO: Pass config to slots
      case 'scratch': return <ScratchGame onFinish={onFinish} onAttemptPlay={onAttemptPlay} prizeName={prize} />;
      default: return <RouletteGame onFinish={onFinish} onAttemptPlay={onAttemptPlay} />;
    }
};

export default CampaignGame;
