import React, { useState } from 'react';
import { Globe, MessageCircle, RefreshCw, X, Check, Search, Star } from 'lucide-react'; // Example icons
import './Whatsapp.css';

const Whatsapp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messagesEnabled, setMessagesEnabled] = useState(false);
  const [logs] = useState([
    { id: 1, event: 'Conexão iniciada', status: 'Sucesso', time: '10:42 - 17/01/2026' },
    { id: 2, event: 'Sincronização de mensagens', status: 'Completo', time: '10:43 - 17/01/2026' },
    { id: 3, event: 'Verificação de status', status: 'Ativo', time: '10:45 - 17/01/2026' },
  ]);

  const handleConnect = () => {
    // Simulate connection process
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMessagesEnabled(false);
  };

  return (
    <div className="whatsapp-page">
      <header className="page-header">
        <div>
            <h2>Whatsapp</h2>
            <p className="subtitle">Gerencie sua conexão e monitore o status do envio de mensagens.</p>
        </div>
      </header>

      <div className="whatsapp-dashboard">
        
        <div className="whatsapp-main">
            {/* Connection Card */}
            <div className="connection-status-card">
                <div className="card-header">
                    <h3>Status da Conexão</h3>
                    <span className={`status-badge ${isConnected ? 'active' : 'inactive'}`}>
                        {isConnected ? 'Online' : 'Offline'}
                    </span>
                </div>
            
                <div className="connection-diagram">
                <div className="icon-node source">
                    <div className="platform-icon">
                    <img 
                      src="https://abf89c3a76439933ec83fa59dc3c3770.cdn.bubble.io/f1702286204693x234542999103598340/SemTexto_SEM_FUNDO%20-%20Copia.png" 
                      alt="Strong Sales Logo" 
                      className="logo-image"
                    />
                    <Search size={20} className="search-overlay" />
                    </div>
                </div>

                <div className={`connection-line ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? (
                    <div className="status-icon success"><Check size={20} /></div>
                    ) : (
                    <div className="status-icon error"><X size={20} /></div>
                    )}
                </div>

                <div className="icon-node target">
                    <MessageCircle size={48} className="whatsapp-icon" />
                </div>
                </div>

                {isConnected ? (
                <div className="status-action-area">
                    <p className="status-text">Sessão ativa e pronta para envio.</p>
                    
                    <div className="toggle-group">
                    <span className="toggle-label">Envio de mensagens</span>
                    <label className="switch">
                        <input 
                        type="checkbox" 
                        checked={messagesEnabled}
                        onChange={(e) => setMessagesEnabled(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                    </div>

                    <button className="btn btn-secondary btn-disconnect" onClick={handleDisconnect}>
                        Desconectar
                    </button>
                </div>
                ) : (
                <div className="status-action-area">
                    <p className="status-text">Escaneie o QR Code para conectar.</p>
                    <button className="btn btn-primary btn-connect" onClick={handleConnect}>
                        Conectar Dispositivo
                    </button>
                </div>
                )}
            </div>

            {/* Connection Logs */}
            <div className="logs-section">
                <h3>Log de Conexão</h3>
                <div className="logs-table-container">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Evento</th>
                                <th>Status</th>
                                <th>Horário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>{log.event}</td>
                                    <td><span className="log-status success">{log.status}</span></td>
                                    <td>{log.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="whatsapp-sidebar-help">
            <div className="help-card">
                <h3>Como Conectar?</h3>
                <ol className="steps-list">
                    <li>Abra o Whatsapp no seu celular.</li>
                    <li>Toque em <strong>Menu</strong> (Android) ou <strong>Configurações</strong> (iPhone).</li>
                    <li>Toque em <strong>Aparelhos conectados</strong>.</li>
                    <li>Toque em <strong>Conectar um aparelho</strong>.</li>
                    <li>Aponte seu celular para esta tela para capturar o código.</li>
                </ol>
            </div>

            <div className="info-card">
                <h3>Informações da Instância</h3>
                <div className="info-item">
                    <span className="label">Número:</span>
                    <span className="value">{isConnected ? '+55 11 99999-9999' : '-'}</span>
                </div>
                <div className="info-item">
                    <span className="label">Bateria:</span>
                    <span className="value">{isConnected ? '85%' : '-'}</span>
                </div>
                <div className="info-item">
                    <span className="label">Versão WA:</span>
                    <span className="value">2.23.1.5</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Whatsapp;
