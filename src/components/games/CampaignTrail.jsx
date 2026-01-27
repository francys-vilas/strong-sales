import React from 'react';
import { Trophy, Star, CheckCircle } from 'lucide-react';
import styles from './CampaignTrail.module.css';

const CampaignTrail = ({ campaigns, currentCampaignId, completedIds, onPlayNext, onNodeClick, pendingRedemptionId }) => {
  // Find the current campaign index
  const campaignList = Object.values(campaigns);
  const currentIndex = campaignList.findIndex(c => c.id === currentCampaignId);

  const totalStats = {
      trophies: completedIds.length,
      currentLevel: currentIndex + 1
  };

  return (
    <div className={styles.trailContainer}>
      <div className={styles.statsHeader}>
          <div className={styles.statItem}>
              <Trophy size={18} className="text-warning" />
              <span>{totalStats.trophies} Troféus</span>
          </div>
          <div className={styles.statItem}>
              <Star size={18} className="text-secondary" />
              <span>Fase {totalStats.currentLevel}</span>
          </div>
      </div>

      <div className={styles.trailHeader}>
        <p className={styles.bonusText}>
          Você ganhou <strong>2 troféus de bônus</strong> na sua primeira vitória.
        </p>
        <p className={styles.instructionText}>
          A cada visita complete a trilha e ganhe <br />
          <span className={styles.superPrize}>SUPER PRÊMIOS</span>
        </p>
      </div>

      <div className={styles.trailMap}>
        <div className={styles.connectorLine}></div>
        {campaignList.map((campaign, index) => {
          const isCompleted = completedIds.includes(campaign.id);
          const isCurrent = index === currentIndex && !isCompleted;
          const isPendingRedeem = campaign.id === pendingRedemptionId;
          const isLocked = index > currentIndex && !isCompleted;
          
          // Zig-zag offset
          const offset = index % 2 === 0 ? '20%' : '-20%';

          return (
            <div 
                key={campaign.id} 
                className={styles.nodeWrapper}
                style={{ transform: `translateX(${offset})` }}
                onClick={() => (isCompleted || isPendingRedeem) && onNodeClick && onNodeClick(campaign)}
            >
              <div className={`
                ${styles.node} 
                ${isCompleted ? styles.completed : ''} 
                ${isCurrent ? styles.current : ''} 
                ${isPendingRedeem ? styles.pending : ''}
                ${isLocked ? styles.locked : ''}
              `}>
                {isCompleted || isPendingRedeem ? (
                  <div className={styles.trophyIcon}>
                      <img 
                        src="https://img.icons8.com/color/96/prize--v1.png" 
                        alt="Won" 
                        className={styles.nodeImage}
                      />
                      <div className={styles.badge}>{isPendingRedeem ? 'RESGATAR!' : 'GANHOU!'}</div>
                      {isPendingRedeem && <div className={styles.pulseRing}></div>}
                  </div>
                ) : isCurrent ? (
                    <Trophy size={40} className={styles.currentTrophy} />
                ) : (
                  <Star size={40} className={styles.starIcon} />
                )}
              </div>
              <div className={styles.nodeLabel}>{campaign.name}</div>
            </div>
          );
        })}
      </div>

      <button className={styles.playButton} onClick={onPlayNext}>
        CONTINUAR TRILHA
      </button>
    </div>
  );
};

export default CampaignTrail;
