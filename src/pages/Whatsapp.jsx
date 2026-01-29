import React, { useState, useEffect } from 'react';
import { Check, X, Smartphone, QrCode } from 'lucide-react';
import './Whatsapp.css';
import { authService } from '../services/authService';
import { evolutionService } from '../services/evolutionService';
import { supabase } from '../services/supabase';

const Whatsapp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);
  const [instanceName, setInstanceName] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [logs, setLogs] = useState([]);
  const [ownerJid, setOwnerJid] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [orgName, setOrgName] = useState(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const connectionTimeoutRef = React.useRef(null);

  const loadLogs = async () => {
    const fetchedLogs = await evolutionService.getLogs();
    setLogs(fetchedLogs);
  };

  const checkInitialStatus = async () => {
      setPageLoading(true);
      try {
          const user = await authService.getCurrentUser();
          const org = await authService.getUserOrganization();
          
          if (!user || !org) {
              setPageLoading(false);
              return;
          }
          
          setOrgName(org.name || "Sua Empresa");

          // Use Organization ID as Instance Name
          const myInstanceName = evolutionService.sanitizeInstanceName(org.id);
          setInstanceName(myInstanceName);

          // 1. Fetch from API (Live Status) which also updates DB
          const statusResult = await evolutionService.fetchInstanceConnect(myInstanceName);
          
          let foundJid = null;
          let foundStatus = 'close';

          if (statusResult.success && statusResult.data && statusResult.data.instance) {
               foundStatus = statusResult.data.instance.state;
               foundJid = statusResult.data.instance.ownerJid;
          }

          // 2. Fetch from DB (as Backup or if API didn't return JID but we have it stored)
          const { data: dbInstance } = await supabase
              .from('evolution_instances')
              .select('*')
              .eq('instance_name', myInstanceName)
              .single();

          if (dbInstance) {
              if (!statusResult.success) {
                  foundStatus = dbInstance.status;
              }
              if (!foundJid && dbInstance.owner_jid) {
                  foundJid = dbInstance.owner_jid;
              }
          }

          if (foundStatus === 'open') {
               setIsConnected(true);
               if (foundJid) {
                   const phone = foundJid.split('@')[0];
                   setOwnerJid(`+${phone}`); 
               }
          } else {
              setIsConnected(false);
          }
      } catch (err) {
          console.error("Check status failed", err);
      } finally {
          setPageLoading(false);
      }
  };

  useEffect(() => {
    loadLogs();
    checkInitialStatus();
    
    // Subscribe to Realtime updates for connection status AND logs
    const setupRealtime = async () => {
        const user = await authService.getCurrentUser();
        const org = await authService.getUserOrganization();

        if (!user || !org) return;
        
        const myInstanceName = evolutionService.sanitizeInstanceName(org.id);

        // 1. Connection Status Updates (Same as before)
        const statusChannel = supabase
            .channel('whatsapp-status-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'evolution_instances',
                    filter: `instance_name=eq.${myInstanceName}`
                },
                (payload) => {
                    const newStatus = payload.new.status;
                    const newQrCode = payload.new.qrcode_base64;
                    const newJid = payload.new.owner_jid;
                    
                    if (newStatus === 'open') {
                        clearTimeout(connectionTimeoutRef.current);
                        setIsConnecting(false);
                        setIsConnected(true);
                        setShowQrModal(false);
                        if (newJid) {
                            const phone = newJid.split('@')[0];
                            setOwnerJid(`+${phone}`);
                        }
                        // Force refresh logs on connection success
                        loadLogs();
                    } else if (newStatus === 'connecting' || newStatus === 'authenticating') {
                        setIsConnecting(true);
                        if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
                         connectionTimeoutRef.current = setTimeout(() => {
                            if (!isConnected) { 
                                handleConnectionTimeout();
                            }
                        }, 30000);
                        // Force refresh logs on connection attempt
                        loadLogs();
                    } else if (newStatus === 'close') {
                        clearTimeout(connectionTimeoutRef.current);
                        setIsConnecting(false);
                        setIsConnected(false);
                        setOwnerJid(null);
                        addLog('Desconectado (Webhook)', 'Aviso');
                        // Force refresh logs on disconnect
                        loadLogs();
                    }
                    
                    if (newStatus === 'qrcode') {
                         clearTimeout(connectionTimeoutRef.current);
                         setIsConnecting(false);
                         if (newQrCode) {
                             setQrCode(newQrCode);
                         }
                         // Force refresh logs on QR update
                         loadLogs();
                    }
                }
            )
            .subscribe();

        // 2. Real-time Logs (API Logs & Webhooks)
        const logsChannel = supabase
            .channel('whatsapp-logs-updates')
            // Listen for new API logs (Start/Disconnect commands)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'evolution_api_logs',
                    filter: `organization_id=eq.${org.id}`
                },
                () => {
                    // When a new log is inserted (e.g. user clicked Connect), refresh list
                    loadLogs();
                }
            )
            // Listen for new Webhooks (Connection Established, QR Code, etc)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'evolution_webhooks',
                    filter: `instance_name=eq.${myInstanceName}`
                },
                () => {
                    // When a new webhook arrives (e.g. "open"), refresh list
                    loadLogs();
                }
            )
            .subscribe();

        return () => {
             supabase.removeChannel(statusChannel);
             supabase.removeChannel(logsChannel);
             clearTimeout(connectionTimeoutRef.current);
        };
    };

    setupRealtime();
  }, []); // isConnected dependency? Ideally refs for timeout.

  if (pageLoading) {
      return (
          <div className="whatsapp-page loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
              <div className="loader-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ color: '#666' }}>Carregando WhatsApp...</p>
              <style>{`
                  @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                  }
              `}</style>
          </div>
      );
  }

  const handleConnectionTimeout = async () => {

      console.log("Connection timed out");
      // Abort
      setIsConnecting(false);
      setShowQrModal(false);
      addLog("Tempo esgotado (30s)", "Falha");
      handleDisconnect(); // Force cleanup
      alert("A conexão demorou muito. Tente novamente."); 
  };

  // Wrapper to add log to local state nicely, but we rely on service to save to DB
  // We can re-fetch or just append locally for "instant" feel
  const addLog = (event, status) => {
    if (event === "Instância Criada" || event === "Instância já existe" || event === "Erro de Conexão" || event === "QR Code Recebido") {
        setTimeout(() => loadLogs(), 1000); 
    }

    const newLog = {
      id: Date.now(),
      event,
      status,
      time: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    setQrCode(null);
    setIsConnecting(false); // Reset
    addLog("Iniciando Conexão", "Processando");

    try {
        const user = await authService.getCurrentUser();
        const org = await authService.getUserOrganization();

        if (!user || !user.email) {
            throw new Error("Usuário não autenticado ou sem e-mail.");
        }
        if (!org) {
             throw new Error("Organização não encontrada.");
        }

        // 1. Try create instance with Org ID as name
        addLog("Criando Instância", "Enviando");
        // Pass org.id as the custom instance name
        const createResult = await evolutionService.createInstance(user.email, org.id);
        setInstanceName(createResult.instanceName);

        if (createResult.success) {
            addLog("Instância Criada", "Sucesso");
            if (createResult.data && createResult.data.qrcode && createResult.data.qrcode.base64) {
                 handleQrCodeReceived(createResult.data.qrcode.base64);
            } else {
                 await fetchExistingQr(createResult.instanceName);
            }
        } else if (createResult.isAlreadyExists) {
            addLog("Instância já existe", "Recuperando");
            await fetchExistingQr(createResult.instanceName);
        } else {
            throw new Error(createResult.error || "Falha ao criar instância");
        }

    } catch (err) {
        console.error(err);
        setError(err.message);
        addLog("Erro de Conexão", "Falha");
    } finally {
        setLoading(false);
    }
  };

  const fetchExistingQr = async (name) => {
      addLog("Buscando Conexão", "Aguardando");
      const connectResult = await evolutionService.fetchInstanceConnect(name);
      
      if (connectResult.success) {
          if (connectResult.data && connectResult.data.base64) {
              handleQrCodeReceived(connectResult.data.base64);
          } else {
              if (connectResult.data && connectResult.data.instance && connectResult.data.instance.state === "open") {
                  setIsConnected(true);
                  addLog("Status", "Já Conectado");
              } else {
                 // Try one more refresh if status is 'connecting' locally?
                 setError("Não foi possível obter o QR Code. Tente novamente.");
              }
          }
      } else {
          throw new Error(connectResult.error || "Falha ao buscar QR Code");
      }
  };

  const handleQrCodeReceived = (base64) => {
      setQrCode(base64);
      addLog("QR Code Recebido", "Aguardando Leitura");
      setShowQrModal(true);
  };

  const handleDisconnect = async () => {
    // If we have state instanceName use it, else try strict org logic
    let targetInstance = instanceName;
    
    if (!targetInstance) {
         // Fallback by fetching org again
         const org = await authService.getUserOrganization();
         if (org) {
             targetInstance = evolutionService.sanitizeInstanceName(org.id);
         }
    }
     
    if (!targetInstance) return;
    
    
    // Optimistic UI update
    setIsConnected(false); 
    addLog("Desconectando...", "Processando");
    
    if (targetInstance) {
        const result = await evolutionService.logoutInstance(targetInstance);
        if (result.success) {
            setQrCode(null);
            setShowQrModal(false);
            setIsConnecting(false);
            addLog('Desconectado', 'Sucesso');
            // We don't delete logs, we just changed status to close
        } else {
            addLog(`Erro ao desconectar: ${result.error}`, 'Falha');
            // If failed, maybe revert UI? But usually safe to assume offline
        }
    }
  };

  const closeModal = () => {
      setShowQrModal(false);
      setIsConnecting(false);
      clearTimeout(connectionTimeoutRef.current);
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
                 <div className={`status-indicator ${isConnected ? 'success' : error ? 'error' : 'default'}`}>
                    {isConnected ? <Check size={20} /> : error ? <X size={20} /> : <div className="dot"></div>}
                 </div>
              </div>

              {/* Right Node: WhatsApp Icon Only (No QR here anymore) */}
              <div className="icon-node target whatsapp-node">
                 <svg viewBox="0 0 24 24" width="48" height="48" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                 </svg>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {isConnected ? (
              <div className="status-action-area">
                <p className="status-text">Sessão ativa e pronta para envio.</p>
                <button className="btn btn-secondary btn-disconnect" onClick={handleDisconnect}>
                  Desconectar Dispositivo
                </button>
              </div>
            ) : (
              <div className="status-action-area">
                <p className="status-text">Clique para gerar o QR Code de conexão.</p>
                <button className="btn btn-primary btn-connect" onClick={handleConnect} disabled={loading}>
                  {loading ? (
                       <>
                         <span className="spinner-small"></span> Conectando...
                       </>
                  ) : "Conectar Dispositivo"}
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
                    <th style={{textAlign: 'right'}}>Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.event}</td>
                      <td style={{textAlign: 'right'}}>{log.time}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                      <tr>
                          <td colSpan="3" style={{textAlign: "center", padding: "1rem"}}>Nenhum log recente.</td>
                      </tr>
                  )}
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
              <li>Toque em <strong>Menu</strong> ou <strong>Configurações</strong>.</li>
              <li>Toque em <strong>Aparelhos conectados</strong>.</li>
              <li>Toque em <strong>Conectar um aparelho</strong>.</li>
              <li>Escaneie o QR Code que será gerado.</li>
            </ol>
          </div>

          <div className="info-card">
            <h3>Informações da Instância</h3>
            <div className="info-item">
              <span className="label">Instância:</span>
              <span 
                  className="value instance-id" 
                  title={instanceName || ""}
                  style={{cursor: 'pointer', fontSize: "0.85rem"}}
                  onClick={() => {
                      if (instanceName) {
                          navigator.clipboard.writeText(instanceName);
                          // Optional: Simple feedback
                          const el = document.getElementById('copy-feedback');
                          if (el) {
                              el.style.opacity = '1';
                              setTimeout(() => el.style.opacity = '0', 2000);
                          }
                      }
                  }}
              >
                  {instanceName ? `${instanceName.substring(0, 15)}...` : "-"}
                  <span id="copy-feedback" style={{
                      opacity: 0, 
                      transition: 'opacity 0.3s', 
                      marginLeft: '8px', 
                      fontSize: '0.7em', 
                      color: '#2ecc71',
                      fontWeight: 'bold'
                  }}>Copiado!</span>
              </span>
            </div>
            {ownerJid && (
                <div className="info-item">
                  <span className="label">Número:</span>
                  <span className="value">{ownerJid}</span>
                </div>
            )}
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value">{isConnected ? "Conectado" : "Desconectado"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="modal-overlay">
          <div className="modal-content qr-modal">
            <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            
            {isConnecting ? (
                 <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <div className="spinner-large" style={{ 
                          width: '60px', height: '60px', 
                          border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', 
                          borderRadius: '50%', animation: 'spin 1s linear infinite', 
                          margin: '0 auto 1.5rem' 
                      }}></div>
                      <h3>Conectando...</h3>
                      <p>Sincronizando com o WhatsApp. Aguarde um momento.</p>
                 </div>
            ) : (
                <>
                    <div className="qr-modal-header">
                        <h3>Escaneie o QR Code</h3>
                        <p>Use seu celular para conectar o WhatsApp</p>
                    </div>
                    
                    <div className="qr-display-container">
                        {qrCode ? (
                            <img src={qrCode} alt="QR Code Login" className="qr-code-large" />
                        ) : (
                            <div style={{width:'250px', height:'250px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <span className="spinner-small" style={{width:'40px', height:'40px', borderTopColor: '#000'}}></span>
                            </div>
                        )}
                    </div>

                    <div className="qr-steps">
                        <div className="step-item">
                            <span className="step-num">1</span>
                            <p>Abra o WhatsApp no seu celular</p>
                        </div>
                        <div className="step-item">
                            <span className="step-num">2</span>
                            <p>Vá em <strong>Configurações</strong> &gt; <strong>Aparelhos Conectados</strong></p>
                        </div>
                        <div className="step-item">
                            <span className="step-num">3</span>
                            <p>Toque em <strong>Conectar um Aparelho</strong></p>
                        </div>
                    </div>
                </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Whatsapp;
