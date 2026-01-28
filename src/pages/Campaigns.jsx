import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Settings, Trash2, TrendingUp, Users, Gamepad2, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import LeadsModal from '../components/LeadsModal';
import { useCampaigns } from '../hooks/useCampaigns';
import './Campaigns.css';

const Campaigns = () => {
  const {
    campaigns,
    loading,
    filter,
    setFilter,
    filteredCampaigns,
    toggleSuperCampaign,
    toggleActive,
    handleDelete,
    reorderCampaign
  } = useCampaigns();

  const [expandedCampaigns, setExpandedCampaigns] = useState(new Set());
  const [selectedCampaignForLeads, setSelectedCampaignForLeads] = useState(null);




  




  const getPlatformColor = (platform) => {
    const colors = {
      Facebook: '#1877F2',
      Instagram: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
      WhatsApp: '#25D366',
      Google: '#DB4437',
      Tiktok: '#000000',
      Youtube: '#FF0000'
    };
    return colors[platform] || '#6366f1';
  };



  // Removed dedicated loading return to allow background visibility

  if (loading) {
      return (
          <div className="campaigns-page loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
              <div className="loader-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ color: '#666' }}>Carregando campanhas...</p>
              <style>{`
                  @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                  }
              `}</style>
          </div>
      );
  }

  return (
    <div className="campaigns" style={{ position: 'relative', minHeight: '400px' }}>
      <header className="page-header">
        <div>
          <h2>Minhas Campanhas</h2>
          <p className="page-subtitle">Gerencie e monitore suas campanhas de marketing</p>
        </div>
        <div className="header-actions">
          <select 
            className="select-field"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Todas as Campanhas">Todas as Campanhas</option>
            <option value="Ativas">Ativas</option>
            <option value="Pausadas">Pausadas</option>
          </select>
          <Link to="/campaigns/new" className="btn btn-primary">+ Nova Campanha</Link>
        </div>
      </header>

      <div className="campaigns-stats">
        <div className="stat-card">
          <TrendingUp size={20} />
          <div>
            <span className="stat-value">{campaigns.filter(c => c.is_active).length}</span>
            <span className="stat-label">Campanhas Ativas</span>
          </div>
        </div>
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span className="stat-value">
              {campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0).toLocaleString()}
            </span>
            <span className="stat-label">Total de Cliques</span>
          </div>
        </div>
      </div>

      {campaigns.length === 0 && !loading ? (
        <EmptyState 
            title="Nenhuma campanha encontrada"
            description={filter === 'Todas as Campanhas' 
                ? "Você ainda não criou nenhuma campanha. Crie sua primeira campanha para começar a atrair clientes!" 
                : `Não há campanhas ${filter.toLowerCase()} no momento.`
            }
            actionLabel={filter === 'Todas as Campanhas' ? "Criar Nova Campanha" : null}
            onAction={filter === 'Todas as Campanhas' ? () => window.location.href = '/campaigns/new' : null}
        />
      ) : (
        <div className="campaigns-list">
          {filteredCampaigns.map(campaign => {
            const isExpanded = expandedCampaigns.has(campaign.id);
            const currentIndex = filteredCampaigns.findIndex(c => c.id === campaign.id);
            const isFirst = currentIndex === 0;
            const isLast = currentIndex === filteredCampaigns.length - 1;
            
            const toggleExpand = () => {
              const newExpanded = new Set(expandedCampaigns);
              if (isExpanded) {
                newExpanded.delete(campaign.id);
              } else {
                newExpanded.add(campaign.id);
              }
              setExpandedCampaigns(newExpanded);
            };
            
            return (
            <div key={campaign.id} className={`campaign-card ${!campaign.is_active ? 'inactive' : ''}`}>
                <div className="campaign-header">
                  <div className="campaign-title-area">
                    <div className="campaign-order-controls">
                      <span className="order-badge">#{currentIndex + 1}</span>
                      <div className="order-buttons">
                        <button 
                          className="order-btn" 
                          onClick={() => reorderCampaign(campaign.id, 'up')}
                          disabled={isFirst}
                          title="Mover para cima"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          className="order-btn" 
                          onClick={() => reorderCampaign(campaign.id, 'down')}
                          disabled={isLast}
                          title="Mover para baixo"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                    <h3 className="campaign-name">{campaign.name}</h3>
                    <span 
                      className="platform-badge" 
                      style={{ background: getPlatformColor(campaign.platform) }}
                    >
                      {campaign.platform}
                    </span>
                    {campaign.is_super_campaign && (
                      <span className="super-badge">⭐ SUPER</span>
                    )}
                    <span className={`status-badge ${campaign.is_active ? 'active' : 'paused'}`}>
                      {campaign.is_active ? '● Ativa' : '○ Pausada'}
                    </span>
                  </div>
                  
                  <div className="campaign-actions">
                    <button 
                      className="icon-btn expand-btn" 
                      title={isExpanded ? "Recolher" : "Expandir"}
                      onClick={toggleExpand}
                    >
                      <ChevronDown size={18} className={isExpanded ? 'expanded' : ''} />
                    </button>
                    <Link to={`/play/${campaign.id}`} className="icon-btn" title="Visualizar Jogo">
                      <Gamepad2 size={18} />
                    </Link>
                    <button className="icon-btn" title="Visualizar Leads" onClick={() => setSelectedCampaignForLeads(campaign)}>
                      <Users size={18} />
                    </button>
                    <button className="icon-btn" title="Copiar Link" onClick={() => {
                        navigator.clipboard.writeText(campaign.target_url);
                        alert("Link copiado!");
                    }}>
                      <Link2 size={18} />
                    </button>
                    <Link to={`/campaigns/edit/${campaign.id}`} className="icon-btn" title="Configurações">
                      <Settings size={18} />
                    </Link>
                    <button className="icon-btn delete-btn" title="Excluir" onClick={() => handleDelete(campaign.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {!isExpanded && (
                  <div className="campaign-compact-stats">
                    <div className="compact-stat">
                      <span className="compact-stat-value">{(campaign.clicks || 0).toLocaleString()}</span>
                      <span className="compact-stat-label">cliques</span>
                    </div>
                    <div className="compact-stat-divider">•</div>
                    <div className="compact-stat">
                      <span className="compact-stat-value">{campaign.conversions || 0}</span>
                      <span className="compact-stat-label">conversões</span>
                    </div>
                    <div className="compact-stat-divider">•</div>
                    <div className="compact-stat">
                      <span className="compact-stat-value">
                        {campaign.clicks > 0 
                          ? (((campaign.conversions || 0) / campaign.clicks) * 100).toFixed(1) 
                          : '0.0'}%
                      </span>
                      <span className="compact-stat-label">taxa</span>
                    </div>
                    <div className="compact-stat-divider">•</div>
                    <div className="compact-stat compact-stat-url">
                      <span className="compact-stat-label">Objetivo:</span>
                      <span className="compact-stat-value">{campaign.conversion_goal}</span>
                    </div>
                  </div>
                )}
                
                {isExpanded && (
                  <>
                    <div className="campaign-body">
                      <div className="campaign-details">
                        <div className="detail-item">
                          <span className="detail-label">URL Destino:</span>
                          <a href={campaign.target_url} className="detail-link" target="_blank" rel="noopener noreferrer">
                            {campaign.target_url}
                          </a>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Objetivo:</span>
                          <span className="detail-value">{campaign.conversion_goal}</span>
                        </div>
                      </div>

                      <div className="campaign-stats">
                        <div className="stat-item">
                          <span className="stat-number">{(campaign.clicks || 0).toLocaleString()}</span>
                          <span className="stat-text">Cliques</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                          <span className="stat-number">{campaign.conversions || 0}</span>
                          <span className="stat-text">Conversões</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                          <span className="stat-number">
                            {campaign.clicks > 0 
                                ? (((campaign.conversions || 0) / campaign.clicks) * 100).toFixed(1) 
                                : '0.0'}%
                          </span>
                          <span className="stat-text">Taxa Conv.</span>
                        </div>
                      </div>
                    </div>

                    <div className="campaign-footer">
                      <label className="toggle-label">
                        <input 
                          type="checkbox" 
                          checked={campaign.is_super_campaign}
                          onChange={() => toggleSuperCampaign(campaign.id, campaign.is_super_campaign)}
                          className="toggle-input"
                        />
                        <span className="toggle-text">Destacar como Super Campanha</span>
                      </label>

                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={campaign.is_active}
                          onChange={() => toggleActive(campaign.id, campaign.is_active)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </>
                )}
            </div>
            );
          })}
        </div>
      )}

      
      {selectedCampaignForLeads && (
        <LeadsModal 
          campaign={selectedCampaignForLeads} 
          onClose={() => setSelectedCampaignForLeads(null)} 
        />
      )}
    </div>
  );
};

export default Campaigns;
