import React from 'react';
import { Check } from 'lucide-react';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, title = "Sucesso!", message = "Operação realizada com sucesso." }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon-container">
          <Check size={40} color="white" strokeWidth={3} />
        </div>
        
        <h3 className="success-title">{title}</h3>
        <p className="success-message">{message}</p>
        
        <button className="success-button" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
