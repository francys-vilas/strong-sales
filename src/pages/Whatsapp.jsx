import React, { useState } from 'react';
import { Smartphone, Check, X, Search, MessageCircle } from 'lucide-react';
import './Whatsapp.css';

const Whatsapp = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  // Simulated logs
  const logs = [
    { id: 1, event: 'Inicialização', status: 'Sucesso', time: '10:00:00' },
    { id: 2, event: 'Verificação de Status', status: 'Aguardando', time: '10:00:02' },
  ];

  const handleDisconnect = () => setIsConnected(false);
  const handleConnect = () => setIsConnected(true);

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
          <div className="connection-status-card">
            <div className="card-header">
              <h3>Status da Conexão</h3>
              <span className={`status-badge ${isConnected ? "active" : "inactive"}`}>
                {isConnected ? "Online" : "Offline"}
              </span>
            </div>

            <div className="connection-diagram">
              {/* Left Node: Company/System */}
              <div className="icon-node source">
                <div className="platform-icon">
                  <img 
                    src="https://abf89c3a76439933ec83fa59dc3c3770.cdn.bubble.io/f1702286204693x234542999103598340/SemTexto_SEM_FUNDO%20-%20Copia.png" 
                    alt="Strong Sales Logo" 
                    className="logo-image" 
                  />

                </div>
              </div>

              {/* Center: Dotted Line with Status Icon */}
              <div className="connection-line">
                 <div className={`status-indicator ${isConnected ? 'success' : 'error'}`}>
                    {isConnected ? <Check size={20} /> : <X size={20} />}
                 </div>
              </div>

              {/* Right Node: WhatsApp */}
              <div className="icon-node target whatsapp-node">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
            </div>

            {isConnected ? (
              <div className="status-action-area">
                <p className="status-text">Sessão ativa e pronta para envio.</p>
                <button className="btn btn-secondary btn-disconnect" onClick={handleDisconnect}>
                  Desconectar Dispositivo
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
                  {logs.map((log) => (
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
              <span className="value">{isConnected ? "+55 11 99999-9999" : "-"}</span>
            </div>
            <div className="info-item">
              <span className="label">Bateria:</span>
              <span className="value">{isConnected ? "85%" : "-"}</span>
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
