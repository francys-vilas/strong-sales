import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Settings, Trash2, TrendingUp, Users } from 'lucide-react';
import './Campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Promoção Black Friday",
      platform: 'Facebook',
      url: 'https://www.facebook.com/minhaloja/black-friday',
      action: "Conversão de Vendas",
      isSuperCampaign: true,
      isActive: true,
      stats: {
        clicks: 1247,
        conversions: 89
      }
    },
    {
      id: 2,
      name: "Lançamento Coleção Verão",
      platform: 'Instagram',
      url: 'https://www.instagram.com/minhaloja',
      action: "Engajamento e Alcance",
      isSuperCampaign: false,
      isActive: true,
      stats: {
        clicks: 856,
        conversions: 34
      }
    },
    {
      id: 3,
      name: "Campanha WhatsApp Clientes VIP",
      platform: 'WhatsApp',
      url: 'https://wa.me/5511999999999',
      action: "Remarketing",
      isSuperCampaign: false,
      isActive: false,
      stats: {
        clicks: 432,
        conversions: 67
      }
    }
  ]);

  const toggleSuperCampaign = (id) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, isSuperCampaign: !c.isSuperCampaign } : c
    ));
  };

  const toggleActive = (id) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const getPlatformColor = (platform) => {
    const colors = {
      Facebook: '#1877F2',
      Instagram: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
      WhatsApp: '#25D366'
    };
    return colors[platform] || '#6366f1';
  };

  return (
    <div className="campaigns">
      <header className="page-header">
        <div>
          <h2>Minhas Campanhas</h2>
          <p className="page-subtitle">Gerencie e monitore suas campanhas de marketing</p>
        </div>
        <div className="header-actions">
          <select className="select-field">
            <option>Todas as Campanhas</option>
            <option>Ativas</option>
            <option>Pausadas</option>
          </select>
          <Link to="/campaigns/new" className="btn btn-primary">+ Nova Campanha</Link>
        </div>
      </header>

      <div className="campaigns-stats">
        <div className="stat-card">
          <TrendingUp size={20} />
          <div>
            <span className="stat-value">{campaigns.length}</span>
            <span className="stat-label">Campanhas Ativas</span>
          </div>
        </div>
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span className="stat-value">
              {campaigns.reduce((sum, c) => sum + c.stats.clicks, 0).toLocaleString()}
            </span>
            <span className="stat-label">Total de Cliques</span>
          </div>
        </div>
      </div>

      <div className="campaigns-list">
        {campaigns.map(campaign => (
          <div key={campaign.id} className={`campaign-card ${!campaign.isActive ? 'inactive' : ''}`}>
            <div className="campaign-header">
              <div className="campaign-title-area">
                <h3 className="campaign-name">{campaign.name}</h3>
                <span 
                  className="platform-badge" 
                  style={{ background: getPlatformColor(campaign.platform) }}
                >
                  {campaign.platform}
                </span>
                {campaign.isSuperCampaign && (
                  <span className="super-badge">⭐ SUPER</span>
                )}
                <span className={`status-badge ${campaign.isActive ? 'active' : 'paused'}`}>
                  {campaign.isActive ? '● Ativa' : '○ Pausada'}
                </span>
              </div>
              
              <div className="campaign-actions">
                <button className="icon-btn" title="Copiar Link">
                  <Link2 size={18} />
                </button>
                <button className="icon-btn" title="Configurações">
                  <Settings size={18} />
                </button>
                <button className="icon-btn delete-btn" title="Excluir">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="campaign-body">
              <div className="campaign-details">
                <div className="detail-item">
                  <span className="detail-label">URL Destino:</span>
                  <a href={campaign.url} className="detail-link" target="_blank" rel="noopener noreferrer">
                    {campaign.url}
                  </a>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Objetivo:</span>
                  <span className="detail-value">{campaign.action}</span>
                </div>
              </div>

              <div className="campaign-stats">
                <div className="stat-item">
                  <span className="stat-number">{campaign.stats.clicks.toLocaleString()}</span>
                  <span className="stat-text">Cliques</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">{campaign.stats.conversions}</span>
                  <span className="stat-text">Conversões</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">
                    {((campaign.stats.conversions / campaign.stats.clicks) * 100).toFixed(1)}%
                  </span>
                  <span className="stat-text">Taxa Conv.</span>
                </div>
              </div>
            </div>

            <div className="campaign-footer">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={campaign.isSuperCampaign}
                  onChange={() => toggleSuperCampaign(campaign.id)}
                  className="toggle-input"
                />
                <span className="toggle-text">Destacar como Super Campanha</span>
              </label>

              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={campaign.isActive}
                  onChange={() => toggleActive(campaign.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
