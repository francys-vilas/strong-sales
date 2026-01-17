import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Save, X, Globe, MessageCircle, BarChart2 } from 'lucide-react'; // Example icons
import './NewCampaign.css';

const NewCampaign = () => {
    const navigate = useNavigate(); // Hook for navigation

    const [formData, setFormData] = useState({
        name: '',
        platform: 'Facebook',
        url: '',
        action: 'Cadastro', // Default action
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically save the data to a backend or context
        console.log('Submitting campaign:', formData);
        
        // Simulate success and navigate back
        alert('Campanha criada com sucesso!'); // Temporary feedback
        navigate('/campaigns');
    };

    const handleCancel = () => {
        navigate('/campaigns');
    };

    return (
        <div className="new-campaign-page">
            <header className="page-header">
                <div className="header-content">
                    <h2>Nova Campanha</h2>
                    <p>Crie uma nova campanha para rastrear seus leads e vendas.</p>
                </div>
            </header>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="campaign-form">
                    <div className="form-section">
                        <h3>Detalhes da Campanha</h3>
                        
                        <div className="form-group">
                            <label htmlFor="name">Nome da Campanha</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Promoção de Verão 2024"
                                required
                                className="input-field"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="platform">Plataforma</label>
                                <div className="select-wrapper">
                                    <select
                                        id="platform"
                                        name="platform"
                                        value={formData.platform}
                                        onChange={handleChange}
                                        className="select-field"
                                    >
                                        <option value="Facebook">Facebook Ads</option>
                                        <option value="Google">Google Ads</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Tiktok">TikTok</option>
                                         <option value="Youtube">Youtube</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="action">Ação de Conversão</label>
                                <div className="select-wrapper">
                                    <select
                                        id="action"
                                        name="action"
                                        value={formData.action}
                                        onChange={handleChange}
                                        className="select-field"
                                    >
                                        <option value="Cadastro">Cadastro (Lead)</option>
                                        <option value="Compra">Compra</option>
                                        <option value="Clique">Clique no Link</option>
                                        <option value="Mensagem">Enviar Mensagem</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="url">URL de Destino</label>
                            <div className="input-with-icon">
                                <Globe size={18} className="input-icon" />
                                <input
                                    type="url"
                                    id="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="https://seu-site.com/landing-page"
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleCancel} className="btn btn-secondary">
                            <X size={18} /> Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} /> Salvar Campanha
                        </button>
                    </div>
                </form>

                <div className="help-card">
                    <div className="help-icon">
                        <BarChart2 size={24} color="var(--color-primary)" />
                    </div>
                    <h4>Dica Pro</h4>
                    <p>
                        Certifique-se de usar parâmetros UTM na sua URL para um rastreamento mais preciso em outras ferramentas de análise.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NewCampaign;
