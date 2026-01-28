import React, { useState, useEffect } from 'react';
import { Upload, Copy, QrCode, Instagram, Facebook, Globe, Star, MapPin, Phone, Mail, Building2, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../services/supabase';
import Loading from '../components/Loading';
import './MinhaLoja.css';

const MinhaLoja = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    whatsapp: "",
    observacao: "",
    logo_url: "",
    instagram: "",
    instagramFollowers: "",
    facebook: "",
    googleReviews: "",
    site: "",
    tripAdvisorReviews: "",
  });

  const generatedLink = formData.nome 
    ? `https://app.strongsales.com.br/loja/${formData.nome.toLowerCase().replace(/\s+/g, '-')}`
    : "https://app.strongsales.com.br/loja/";

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile?.organization_id) {
        console.error("User has no organization");
        return;
      }
      
      setOrganizationId(profile.organization_id);

      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .maybeSingle();

      if (storeError) throw storeError;

      if (store) {
        setStoreId(store.id);
        setFormData({
          nome: store.name || "",
          cnpj: store.cnpj || "",
          email: store.email || "",
          whatsapp: store.whatsapp || "",
          observacao: store.description || "",
          logo_url: store.logo_url || "",
          instagram: store.social_media?.instagram || "",
          instagramFollowers: store.metrics?.instagramFollowers || "",
          facebook: store.social_media?.facebook || "",
          googleReviews: store.metrics?.googleReviews || "",
          site: store.social_media?.site || "",
          tripAdvisorReviews: store.metrics?.tripAdvisorReviews || "",
        });
      }
    } catch (err) {
      console.error("Error fetching store data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('store-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('store-logos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      
      // Save logo URL immediately
      if (storeId) {
        await supabase
          .from('stores')
          .update({ logo_url: publicUrl })
          .eq('id', storeId);
      }
      
      alert("Logo atualizado com sucesso!");
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Erro ao enviar logo.');
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (field) => {
    setEditingField(field);
    setTempValue(formData[field] || '');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const saveField = async (field) => {
    if (!storeId || !organizationId) {
      alert("Erro: Dados da loja não encontrados.");
      return;
    }

    try {
      let updatePayload = {};
      
      // Map form fields to database fields
      const fieldMapping = {
        nome: 'name',
        cnpj: 'cnpj',
        email: 'email',
        whatsapp: 'whatsapp',
        observacao: 'description',
      };

      const socialFields = ['instagram', 'facebook', 'site'];
      const metricFields = ['instagramFollowers', 'googleReviews', 'tripAdvisorReviews'];

      if (fieldMapping[field]) {
        updatePayload[fieldMapping[field]] = tempValue;
      } else if (socialFields.includes(field)) {
        const currentSocial = { ...formData };
        updatePayload.social_media = {
          instagram: field === 'instagram' ? tempValue : currentSocial.instagram,
          facebook: field === 'facebook' ? tempValue : currentSocial.facebook,
          site: field === 'site' ? tempValue : currentSocial.site,
        };
      } else if (metricFields.includes(field)) {
        const currentMetrics = { ...formData };
        updatePayload.metrics = {
          instagramFollowers: field === 'instagramFollowers' ? tempValue : currentMetrics.instagramFollowers,
          googleReviews: field === 'googleReviews' ? tempValue : currentMetrics.googleReviews,
          tripAdvisorReviews: field === 'tripAdvisorReviews' ? tempValue : currentMetrics.tripAdvisorReviews,
        };
      }

      const { error } = await supabase
        .from('stores')
        .update(updatePayload)
        .eq('id', storeId);

      if (error) throw error;

      setFormData(prev => ({ ...prev, [field]: tempValue }));
      setEditingField(null);
      setTempValue('');
    } catch (err) {
      console.error("Error saving field:", err);
      alert("Erro ao salvar.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link copiado!");
  };

  const EditableField = ({ label, field, icon: Icon, multiline = false }) => {
    const isEditing = editingField === field;
    const value = formData[field];

    return (
      <div className="editable-field">
        <div className="field-label">
          {Icon && <Icon size={16} className="field-icon" />}
          <span>{label}</span>
        </div>
        {isEditing ? (
          <div className="field-edit">
            {multiline ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="edit-input"
                rows={3}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="edit-input"
                autoFocus
              />
            )}
            <div className="inline-actions">
              <button className="btn-save" onClick={() => saveField(field)}>
                <Check size={16} />
              </button>
              <button className="btn-cancel" onClick={cancelEdit}>
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="field-display">
            <span className="field-value">{value || <em className="empty-value">Não informado</em>}</span>
            <button className="edit-btn" onClick={() => startEdit(field)}>
              <Edit2 size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="minha-loja-page loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="loader-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#666' }}>Carregando dados da loja...</p>
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
    <div className="minha-loja-page">

      
      <header className="page-header">
        <div>
          <h2>Minha Loja</h2>
          <p className="page-subtitle">Gerencie as informações do seu estabelecimento</p>
        </div>
      </header>

      <div className="store-sections">
        {/* Store Identity Card */}
        <div className="card identity-card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              <h3>Identidade da Loja</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="identity-row">
              <div className="logo-section">
                <label className="section-label">Logo</label>
                <div 
                  className="logo-preview"
                  onClick={() => document.getElementById('logo-upload').click()}
                  style={{ 
                    backgroundImage: formData.logo_url ? `url(${formData.logo_url})` : 'none',
                  }}
                >
                  {!formData.logo_url && !uploading && (
                    <div className="logo-placeholder">
                      <Upload size={32} />
                      <span>Adicionar Logo</span>
                    </div>
                  )}
                  {uploading && <span className="uploading-text">Enviando...</span>}
                  {formData.logo_url && (
                    <div className="logo-overlay">
                      <Edit2 size={24} />
                      <span>Alterar</span>
                    </div>
                  )}
                  <input 
                    id="logo-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </div>
              </div>
              
              <div className="identity-fields">
                <EditableField label="Nome da Loja" field="nome" icon={Building2} />
                <EditableField label="CNPJ" field="cnpj" />
              </div>
            </div>
            
            <EditableField label="Observação" field="observacao" multiline />
          </div>
        </div>

        {/* Contact Card */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Phone size={20} className="text-primary" />
              <h3>Contato</h3>
            </div>
          </div>
          <div className="card-body contact-grid">
            <EditableField label="Email" field="email" icon={Mail} />
            <EditableField label="WhatsApp" field="whatsapp" icon={Phone} />
          </div>
        </div>

        {/* Social & Metrics Card */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              <h3>Redes Sociais & Métricas</h3>
            </div>
          </div>
          <div className="card-body social-grid">
            <EditableField label="Instagram" field="instagram" icon={Instagram} />
            <EditableField label="Seguidores Instagram" field="instagramFollowers" icon={Star} />
            <EditableField label="Facebook" field="facebook" icon={Facebook} />
            <EditableField label="Avaliações Google" field="googleReviews" icon={Star} />
            <EditableField label="Site" field="site" icon={Globe} />
            <EditableField label="Avaliações TripAdvisor" field="tripAdvisorReviews" icon={MapPin} />
          </div>
        </div>

        {/* Generated Link Card */}
        <div className="card link-card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-primary" />
              <h3>Link & QR Code</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="link-display-section">
              <label className="section-label">Link do Estabelecimento</label>
              <div className="link-container">
                <input 
                  type="text" 
                  value={generatedLink} 
                  readOnly 
                  className="link-input"
                />
                <button className="btn btn-secondary" onClick={copyToClipboard}>
                  <Copy size={18} />
                  Copiar
                </button>
                <button className="btn btn-primary">
                  <QrCode size={18} />
                  Gerar QR Code
                </button>
              </div>
              <p className="link-info">
                <span className="info-icon">ℹ️</span>
                Seu link é gerado automaticamente com base no nome da sua loja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhaLoja;
