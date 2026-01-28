import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Phone, Download } from 'lucide-react';
import { leadService } from '../services/leadService';
import './LeadsModal.css';

const LeadsModal = ({ campaign, onClose }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [campaign.id]);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getLeads({ campaignId: campaign.id });
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.phone.includes(searchTerm)
  );

  const exportToCSV = () => {
    const headers = ['Data', 'Telefone', 'Dispositivo'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        new Date(lead.created_at).toLocaleString('pt-BR'),
        lead.phone,
        lead.device_type
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${campaign.name.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  return (
    <div className="leads-modal-overlay">
      <div className="leads-modal">
        <header className="leads-modal-header">
          <div>
            <h3>Leads: {campaign.name}</h3>
            <p>{filteredLeads.length} contatos registrados</p>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </header>

        <div className="leads-modal-controls">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={exportToCSV} className="export-btn" disabled={loading || leads.length === 0}>
            <Download size={18} />
            Exportar CSV
          </button>
        </div>

        <div className="leads-list-container">
          {loading ? (
            <div className="leads-loading">Carregando leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="leads-empty">Nenhum lead encontrado.</div>
          ) : (
            <table className="leads-table">
              <thead>
                <tr>
                  <th><Phone size={14} /> Telefone</th>
                  <th><Calendar size={14} /> Data</th>
                  <th>Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="phone-cell">{lead.phone}</td>
                    <td>{new Date(lead.created_at).toLocaleString('pt-BR')}</td>
                    <td><span className={`device-badge ${lead.device_type?.toLowerCase()}`}>{lead.device_type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsModal;
