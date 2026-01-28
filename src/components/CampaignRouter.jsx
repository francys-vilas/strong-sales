
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameService } from '../services/gameService';
import { Phone, ArrowRight, CheckCircle, MapPin } from 'lucide-react';
import './CampaignRouter.css';

const CampaignRouter = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [inputPhone, setInputPhone] = useState(''); // For the form
  const [error, setError] = useState(null);
  const [trailStatus, setTrailStatus] = useState(null); // { completed: boolean, message: string }

  useEffect(() => {
    checkIdentityAndRoute();
  }, [orgId]);

  const checkIdentityAndRoute = async (phoneOverride) => {
    setLoading(true);
    try {
        const savedPhone = phoneOverride || localStorage.getItem('guest_phone');
        
        if (!savedPhone) {
            setLoading(false);
            return; // Show Login Form
        }

        setPhone(savedPhone);

        // Fetch Trail Data
        const { campaigns, winners } = await gameService.getCampaignTrailStatus(orgId, savedPhone);

        if (campaigns.length === 0) {
            setError('Nenhuma campanha ativa nesta loja.');
            setLoading(false);
            return;
        }

        // --- THE LOGIC ENGINE ---
        let nextCampaign = null;

        for (const campaign of campaigns) {
            const winRecord = winners.find(w => w.campaign_id === campaign.id);
            
            if (!winRecord) {
                // Never won -> THIS is the next step (Play)
                nextCampaign = campaign;
                break; 
            }

            if (!winRecord.is_redeemed) {
                // Won but NOT Redeemed -> THIS is the next step (Redeem)
                nextCampaign = campaign;
                break;
            }

            // If Won AND Redeemed -> Continue loop to next campaign
        }

        if (nextCampaign) {
            // Redirect to the Game Page
            navigate(`/play/${nextCampaign.id}`);
        } else {
            // No next campaign found -> Trail Completed!
            setTrailStatus({
                completed: true,
                message: 'Parabéns! Você completou toda a trilha de prêmios desta loja!'
            });
            setLoading(false);
        }

    } catch (err) {
        console.error('Routing error:', err);
        setError('Erro ao carregar a trilha.');
        setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPhone.length < 10) {
        alert('Digite um telefone válido com DDD.');
        return;
    }
    // Clean phone
    const cleanPhone = inputPhone.replace(/\D/g, '');
    localStorage.setItem('guest_phone', cleanPhone);
    checkIdentityAndRoute(cleanPhone);
  };

  // --- RENDER ---

  if (loading) {
    return (
        <div className="router-loading">
            <div className="spinner"></div>
            <p>Calculando sua trilha...</p>
        </div>
    );
  }

  if (trailStatus?.completed) {
      return (
          <div className="router-container success">
              <div className="status-card">
                <CheckCircle size={64} className="success-icon" />
                <h1>Trilha Completada!</h1>
                <p>{trailStatus.message}</p>
                <div className="confetti-bg"></div>
              </div>
          </div>
      );
  }

  if (error) {
    return (
        <div className="router-container error">
             <div className="status-card">
                <h3>Ops!</h3>
                <p>{error}</p>
             </div>
        </div>
    );
  }

  // Show Login Form
  return (
    <div className="router-container login">
        <div className="login-card">
            <div className="icon-wrapper">
                <MapPin size={40} />
            </div>
            <h1>Bem-vindo à Loja!</h1>
            <p>Digite seu WhatsApp para acessar seus prêmios e jogos disponíveis.</p>
            
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <Phone size={20} />
                    <input 
                        type="tel" 
                        placeholder="(DDD) 99999-9999"
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value)} // Add mask later if needed
                        className="phone-input"
                    />
                </div>
                <button type="submit" className="start-btn">
                    Começar Trilha <ArrowRight size={20} />
                </button>
            </form>
        </div>
    </div>
  );
};

export default CampaignRouter;
