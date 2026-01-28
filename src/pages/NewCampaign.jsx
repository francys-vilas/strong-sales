import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Globe, MessageCircle, BarChart2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import './NewCampaign.css';

import { supabase } from '../services/supabase';

const NewCampaign = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get campaign ID if editing
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        platform: 'Facebook',
        target_url: '',
        conversion_goal: 'Cadastro',
        game_type: 'roulette',
        game_template_id: ''
    });
    const [loading, setLoading] = useState(false);
    
    // Template System State
    const [organizationId, setOrganizationId] = useState(null);
    const [templates, setTemplates] = useState([]);

    // 1. Fetch User Organization & Templates
    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if(user) {
                const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
                if(profile && profile.organization_id) {
                    setOrganizationId(profile.organization_id);
                    
                    // Fetch templates
                    const { data: temps, error } = await supabase
                        .from('game_templates')
                        .select('*')
                        .eq('organization_id', profile.organization_id);
                    
                    if (temps) setTemplates(temps);
                }
            }
        };
        fetchInitialData();
    }, []);

    // Also enable re-fetching templates on window focus? 
    // Simplified: Just button click reloads? Or just hope user refreshes.
    
    // Filter templates for current game type
    const availableTemplates = templates.filter(t => t.game_type === formData.game_type);

    useEffect(() => {
        if (isEditMode) {
            fetchCampaign();
        }
    }, [id, isEditMode]);

    const fetchCampaign = async () => {
        try {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    name: data.name,
                    platform: data.platform,
                    target_url: data.target_url,
                    conversion_goal: data.conversion_goal,
                    game_type: data.game_type,
                    game_template_id: data.game_template_id || '',
                });
            }
        } catch (error) {
            console.error('Error fetching campaign:', error);
            toast.error('Erro ao carregar detalhes da campanha.');
            navigate('/campaigns');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                toast.error('Você precisa estar logado para criar uma campanha.');
                return;
            }

            // Get user's profile to find organization_id
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (profileError || !profile) {
                throw new Error('Erro ao identificar organização do usuário.');
            }

            const campaignData = {
                ...formData,
                user_id: user.id,
                organization_id: profile.organization_id
            };

            let error;
            if (isEditMode) {
                const { error: updateError } = await supabase
                    .from('campaigns')
                    .update(campaignData)
                    .eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('campaigns')
                    .insert([campaignData]);
                error = insertError;
            }

            if (error) throw error;
            
            toast.success(isEditMode ? 'Campanha atualizada com sucesso!' : 'Campanha criada com sucesso!', {
                description: 'Você já pode configurar o jogo e começar a divulgar.',
                duration: 4000
            });
            navigate('/campaigns');
        } catch (error) {
            console.error('Error saving campaign:', error);
            toast.error(`Erro ao salvar campanha: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/campaigns');
    };

    return (
        <div className="new-campaign-page">
            <header className="page-header">
                <div className="header-content">
                    <h2>{isEditMode ? 'Editar Campanha' : 'Nova Campanha'}</h2>
                    <p>{isEditMode ? 'Atualize os detalhes da sua campanha.' : 'Crie uma nova campanha para rastrear seus leads e vendas.'}</p>
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
                                         <option value="WhatsApp">WhatsApp</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="conversion_goal">Ação de Conversão</label>
                                <div className="select-wrapper">
                                    <select
                                        id="conversion_goal"
                                        name="conversion_goal"
                                        value={formData.conversion_goal}
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
                            <label htmlFor="game_type">Jogo da Campanha</label>
                            <div className="select-wrapper">
                                <select
                                    id="game_type"
                                    name="game_type"
                                    value={formData.game_type}
                                    onChange={handleChange}
                                    className="select-field"
                                >
                                    <option value="roulette">Roleta da Sorte</option>
                                    <option value="slots">Caça-Níquel (Slots)</option>
                                    <option value="scratch">Raspadinha</option>
                                    <option value="memory">Jogo da Memória</option>
                                    <option value="jokenpo">Jokenpô</option>
                                    <option value="tictactoe">Jogo da Velha</option>
                                    <option value="whack">Acerte a Toupeira</option>
                                    <option value="simon">Genius (Simon)</option>
                                    <option value="guess">Adivinhe o Número</option>
                                    <option value="hangman">Jogo da Forca</option>
                                </select>
                            </div>
                            <p className="field-hint">Este é o jogo que seus clientes verão na página da campanha.</p>
                            
                            {/* GAME CONFIGURATION & TEMPLATE SELECTION */}
                            <div className="form-group" style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <label htmlFor="game_template_id" style={{fontWeight: 600}}>Modelo de Configuração</label>
                                <p className="field-hint" style={{marginBottom: '0.5rem'}}>Escolha um modelo de prêmios e cores para este jogo.</p>
                                
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div className="select-wrapper" style={{ flex: 1 }}>
                                        <select
                                            id="game_template_id"
                                            name="game_template_id"
                                            value={formData.game_template_id}
                                            onChange={handleChange}
                                            className="select-field"
                                            required={true}
                                        >
                                            <option value="">Selecione um modelo...</option>
                                            {availableTemplates.length > 0 ? (
                                                availableTemplates.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))
                                            ) : (
                                                <option disabled>Nenhum modelo encontrado para este jogo.</option>
                                            )}
                                        </select>
                                    </div>
                                    
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                                        onClick={() => {
                                            // Open Games Editor in new tab to create template
                                            window.open(`/games?mode=edit&gameType=${formData.game_type}`, '_blank');
                                        }}
                                        title="Criar novo modelo de jogo"
                                    >
                                        <Plus size={16} /> Novo Modelo
                                    </button>
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                                    <Globe size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                    {availableTemplates.length} modelos disponíveis para {formData.game_type}.
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="target_url">URL de Destino</label>
                            <div className="input-with-icon">
                                <Globe size={18} className="input-icon" />
                                <input
                                    type="url"
                                    id="target_url"
                                    name="target_url"
                                    value={formData.target_url}
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
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Campanha'}
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
