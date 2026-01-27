import { useState, useEffect } from 'react';
import { campaignService } from '../services/campaignService';

/**
 * Custom hook for managing campaigns
 */
export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas as Campanhas');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await campaignService.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSuperCampaign = async (id, currentValue) => {
    try {
      await campaignService.toggleSuperCampaign(id, currentValue);
      setCampaigns(campaigns.map(c =>
        c.id === id ? { ...c, is_super_campaign: !c.is_super_campaign } : c
      ));
    } catch (err) {
      console.error('Error updating campaign:', err);
    }
  };

  const toggleActive = async (id, currentValue) => {
    try {
      await campaignService.toggleActive(id, currentValue);
      setCampaigns(campaigns.map(c =>
        c.id === id ? { ...c, is_active: !c.is_active } : c
      ));
    } catch (err) {
      console.error('Error updating campaign:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) return;

    try {
      await campaignService.deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting campaign:", err);
      alert("Erro ao excluir campanha.");
    }
  };

  const reorderCampaign = async (id, direction) => {
    try {
      const currentIndex = campaigns.findIndex(c => c.id === id);
      if (currentIndex === -1) return;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= campaigns.length) return;

      const currentCampaign = campaigns[currentIndex];
      const targetCampaign = campaigns[targetIndex];

      await campaignService.reorderCampaigns(currentCampaign, targetCampaign);

      // Refresh campaigns after reorder
      await fetchCampaigns();
    } catch (err) {
      console.error('Error reordering campaign:', err);
      alert('Erro ao reordenar campanha.');
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === 'Ativas') return c.is_active;
    if (filter === 'Pausadas') return !c.is_active;
    return true;
  });

  return {
    campaigns,
    loading,
    filter,
    setFilter,
    filteredCampaigns,
    toggleSuperCampaign,
    toggleActive,
    handleDelete,
    reorderCampaign,
    fetchCampaigns
  };
};
