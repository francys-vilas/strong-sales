import React from 'react';
import { Download, QrCode } from 'lucide-react';
import './Marketing.css';

const Marketing = () => {
  const products = [
    {
      id: 1,
      title: "Adesivo",
      type: "sticker",
      preview: (
        <div className="preview-sticker">
          <div className="sticker-content">
            <h3>GANHE</h3>
            <p>UM PRESENTE</p>
            <p>A CADA VISITA</p>
            <div className="qr-placeholder">
              <div className="qr-mini"></div>
            </div>
          </div>
        </div>
      ),
      details: [
        { label: "📦 Material", value: "Adesivo" },
        { label: "🏷️ Tipo", value: "Porta Copo" },
        { label: "⚪ Forma", value: "Redonda" },
        { label: "📍 Aplicação", value: "Mesas que servem o público" },
        { label: "📐 Dimensões", value: "11L x 11W cm" },
      ]
    },
    {
      id: 2,
      title: "Tablet",
      type: "tablet",
      preview: (
        <div className="preview-tablet">
          <div className="screen-content">
            <h3>GANHE</h3>
            <p>UM PRESENTE A CADA VISITA</p>
            <QrCode size={48} />
          </div>
        </div>
      ),
      details: [
        { label: "📱 Material", value: "Para tela de Tablet" },
        { label: "📐 Tamanhos", value: "1160 x 720 px" },
      ]
    },
    {
      id: 3,
      title: "Display de Mesa",
      type: "stand",
      preview: (
        <div className="preview-stand">
          <div className="stand-content">
            <h3>GANHE</h3>
            <p>UM PRESENTE</p>
            <QrCode size={40} />
          </div>
        </div>
      ),
      details: [
        { label: "Material", value: "Folhetos" },
        { label: "Tamanho dos compartimentos", value: "A6" },
        { label: "Impressão", value: "Frente e Verso" },
        { label: "Orientação", value: "Vertical" },
        { label: "Dimensões", value: "15 cm x 10 cm x 5 cm" },
      ]
    }
  ];

  const digitalProducts = [
    {
      id: 4,
      title: "Post Instagram",
      type: "digital",
      preview: <div className="preview-digital post"></div>,
      details: [
        { label: "📐 Formato", value: "1080x1080px" },
        { label: "📷 Tipo", value: "PNG / JPG" },
        { label: "🌍 Uso", value: "Feed" }
      ]
    },
    {
      id: 5,
      title: "Stories",
      type: "digital",
      preview: <div className="preview-digital story"></div>,
      details: [
        { label: "📐 Formato", value: "1080x1920px" },
        { label: "📷 Tipo", value: "PNG / JPG" },
        { label: "🌍 Uso", value: "Stories" }
      ]
    }
  ];

  return (
    <div className="marketing-page">
      <header className="page-header">
        <div>
          <h2>Marketing</h2>
          <p className="page-subtitle">Materiais de divulgação para seu estabelecimento</p>
        </div>
      </header>
      
      <section className="marketing-section">
        <h3 className="section-title">Impressos</h3>
        <div className="marketing-grid">
            {products.map(product => (
            <div key={product.id} className="marketing-card">
                <div className="card-preview">
                {product.preview}
                </div>
                <h3 className="card-title">{product.title}</h3>
                <span className="card-type">{product.type}</span>
                
                <ul className="card-details">
                {product.details.map((detail, index) => (
                    <li key={index}>
                    <span className="detail-label">{detail.label}</span>
                    <span className="detail-value">{detail.value}</span>
                    </li>
                ))}
                </ul>

                <button className="marketing-export-btn" title="Baixar">
                  <Download size={18} />
                </button>
            </div>
            ))}
        </div>
      </section>

      <section className="marketing-section">
        <h3 className="section-title">Digitais</h3>
        <div className="marketing-grid">
            {digitalProducts.map(product => (
            <div key={product.id} className="marketing-card">
                <div className="card-preview">
                {product.preview}
                </div>
                <h3 className="card-title">{product.title}</h3>
                <span className="card-type">{product.type}</span>
                
                <ul className="card-details">
                {product.details.map((detail, index) => (
                    <li key={index}>
                    <span className="detail-label">{detail.label}</span>
                    <span className="detail-value">{detail.value}</span>
                    </li>
                ))}
                </ul>

                <button className="marketing-export-btn" title="Baixar">
                  <Download size={18} />
                </button>
            </div>
            ))}
        </div>
      </section>

      <div className="request-banner">
        <div className="banner-content">
            <h3>Precisa de algo personalizado?</h3>
            <p>Nossa equipe de design pode criar materiais exclusivos para sua loja.</p>
        </div>
        <button className="btn btn-primary">Solicitar Personalização</button>
      </div>
    </div>
  );
};

export default Marketing;
