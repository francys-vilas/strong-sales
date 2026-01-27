import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { leadService } from '../services/leadService';

/**
 * Custom hook for managing game state
 */
export const useGame = () => {
  const { campaignId } = useParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [gameState, setGameState] = useState('ready'); // ready, playing, won, lost, trail
  const [result, setResult] = useState(null);
  const [completedCampaigns, setCompletedCampaigns] = useState(() => {
    const saved = localStorage.getItem('completed_campaigns');
    return saved ? JSON.parse(saved) : [];
  });

  // Auth/Lead State
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  // Prize Redemption State
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [prizeRecipient, setPrizeRecipient] = useState(null);
  const [friendName, setFriendName] = useState('');
  const [friendPhone, setFriendPhone] = useState('');

  // Action Verification State
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionVerified, setActionVerified] = useState(false);
  const [pendingRedemption, setPendingRedemption] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const data = await gameService.getCampaignForGame(campaignId);
      setCampaign(data);
    } catch (err) {
      console.error('Error fetching campaign:', err);
      // Could handle fallback to mock data here
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;

    setLeadSubmitting(true);
    try {
      const leadData = leadService.captureLeadMetadata(campaign.id, phoneNumber);
      await leadService.createLead(leadData);
      await gameService.trackGamePlay(campaign.id);
      setShowAuthModal(false);
    } catch (err) {
      console.error('Error saving lead:', err);
      // Still allow user to play even if lead save fails
      setShowAuthModal(false);
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setPhoneNumber(val);
  };

  const handleAttemptPlay = () => {
    if (!actionVerified && campaign && campaign.target_url) {
      setShowActionModal(true);
      return false;
    }
    return true;
  };

  const handleGameFinish = (prize) => {
    setResult(prize);
    setPendingRedemption(campaign.id);
    setGameState('trail');
  };

  const handlePerformAction = () => {
    window.open(campaign.target_url, '_blank');
    setActionVerified(true);
    setShowActionModal(false);
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    
    try {
      const winnerData = {
        phone: phoneNumber,
        recipientName: prizeRecipient === 'friend' ? friendName : null,
        recipientPhone: prizeRecipient === 'friend' ? friendPhone : null,
        isForFriend: prizeRecipient === 'friend'
      };

      await gameService.saveWinner(campaign.id, winnerData);

      const newCompleted = [...new Set([...completedCampaigns, pendingRedemption])];
      setCompletedCampaigns(newCompleted);
      localStorage.setItem('completed_campaigns', JSON.stringify(newCompleted));

      setPendingRedemption(null);
      setShowPrizeModal(false);
    } catch (err) {
      console.error('Error saving winner:', err);
      alert('Erro ao salvar prêmio. Tente novamente.');
    }
  };

  const handleNodeClick = (nodeCampaign) => {
    if (nodeCampaign.id === pendingRedemption) {
      setShowPrizeModal(true);
    } else if (completedCampaigns.includes(nodeCampaign.id)) {
      alert(`Você já resgatou o prêmio desta campanha!`);
    }
  };

  return {
    campaign,
    loading,
    gameState,
    setGameState,
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
    actionVerified,
    pendingRedemption,
    handleAttemptPlay,
    handleGameFinish,
    handlePerformAction,
    handleRedeem,
    handleNodeClick
  };
};
