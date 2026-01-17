import React, { useState } from 'react';
import { Upload, Copy, Save, QrCode, Instagram, Facebook, Globe, Star, MapPin, Phone, Mail, Building2 } from 'lucide-react';
import './MinhaLoja.css';

const MinhaLoja = () => {
  const [formData, setFormData] = useState({
    nome: "Strong Sales Loja Exemplo",
    cnpj: "12.345.678/0001-90",
    email: "contato@strongsales.com.br",
    whatsapp: "(11) 99999-8888",
    observacao: "Horário de funcionamento: Segunda a Sábado, 9h às 18h",
    instagram: "@strongsales",
    instagramFollowers: "12.5K",
    facebook: "facebook.com/strongsales",
    googleReviews: "4.8 (156 avaliações)",
    site: "www.strongsales.com.br",
    tripAdvisorReviews: "4.5 (89 avaliações)",
  });

  const generatedLink = "https://app.strongsales.com.br/loja/strong-sales-exemplo";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    // Could add a toast notification here
  };

  return (
    <div className="minha-loja-page">
      <header className="page-header">
        <div>
          <h2>Minha Loja</h2>
          <p className="page-subtitle">Gerencie as informações e a identidade visual do seu estabelecimento</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </header>

      <div className="store-sections">
        {/* Seção 1: Informações Básicas */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              <h3>Informações Básicas</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="logo-info-row">
              <div className="logo-upload-area">
                <label className="section-label">Logo da Loja</label>
                <div className="logo-upload-circle">
                  <Upload size={32} className="upload-icon" />
                  <span>Clique ou arraste</span>
                  <span className="upload-hint">PNG, JPG até 5MB</span>
                </div>
              </div>

              <div className="basic-inputs">
                <div className="input-group">
                  <label className="form-label">Nome da Loja</label>
                  <input 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleChange}
                    placeholder="Digite o nome da sua loja"
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label className="form-label">CNPJ</label>
                  <input 
                    type="text" 
                    name="cnpj" 
                    value={formData.cnpj} 
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="input-group full-width">
              <label className="form-label">Observação</label>
              <textarea 
                name="observacao" 
                value={formData.observacao} 
                onChange={handleChange}
                placeholder="Informações adicionais sobre sua loja"
                rows={3}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Seção 2: Contato */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Phone size={20} className="text-primary" />
              <h3>Contato</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="input-group with-icon">
                <label className="form-label">Email</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="input-group with-icon">
                <label className="form-label">WhatsApp</label>
                <div className="input-with-icon whatsapp">
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="whatsapp" 
                    value={formData.whatsapp} 
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 3: Redes Sociais & Métricas */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              <h3>Redes Sociais & Métricas</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="input-group with-icon">
                <label className="form-label">Instagram</label>
                <div className="input-with-icon instagram">
                  <Instagram size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="instagram" 
                    value={formData.instagram} 
                    onChange={handleChange}
                    placeholder="@seuusuario"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group with-icon">
                <label className="form-label">Seguidores Instagram</label>
                <div className="input-with-icon">
                  <Star size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="instagramFollowers" 
                    value={formData.instagramFollowers} 
                    onChange={handleChange}
                    placeholder="Ex: 10K"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group with-icon">
                <label className="form-label">Facebook</label>
                <div className="input-with-icon facebook">
                  <Facebook size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="facebook" 
                    value={formData.facebook} 
                    onChange={handleChange}
                    placeholder="facebook.com/suapagina"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group with-icon">
                <label className="form-label">Avaliações Google</label>
                <div className="input-with-icon">
                  <Star size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="googleReviews" 
                    value={formData.googleReviews} 
                    onChange={handleChange}
                    placeholder="4.5 (100 avaliações)"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group with-icon">
                <label className="form-label">Site</label>
                <div className="input-with-icon">
                  <Globe size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="site" 
                    value={formData.site} 
                    onChange={handleChange}
                    placeholder="www.seusite.com.br"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group with-icon">
                <label className="form-label">Avaliações TripAdvisor</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="tripAdvisorReviews" 
                    value={formData.tripAdvisorReviews} 
                    onChange={handleChange}
                    placeholder="4.0 (50 avaliações)"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 4: Link Gerado */}
        <div className="card link-section">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <QrCode size={20} className="text-primary" />
              <h3>Link & QR Code</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="input-group full-width">
              <label className="form-label">Link do Estabelecimento</label>
              <div className="link-display">
                <input 
                  type="text" 
                  value={generatedLink} 
                  readOnly 
                  className="input-field link-input"
                />
                <button className="btn btn-secondary" onClick={copyToClipboard} title="Copiar link">
                  <Copy size={18} />
                </button>
                <button className="btn btn-primary">
                  <QrCode size={18} />
                  Gerar QR Code
                </button>
              </div>
            </div>
            <p className="link-info">
              <span className="info-icon">ℹ️</span>
              Seu link é gerado automaticamente com base no nome da sua loja. Compartilhe com seus clientes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhaLoja;
