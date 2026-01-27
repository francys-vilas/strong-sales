import React from 'react';
import { Package } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ 
    title = 'Nenhum dado encontrado', 
    description = 'Não há nada para exibir aqui no momento.', 
    icon: Icon = Package, 
    actionLabel, 
    onAction 
}) => {
    return (
        <div className="empty-state">
            <div className="empty-state-icon-wrapper">
                <Icon size={40} strokeWidth={1.5} />
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            
            {actionLabel && onAction && (
                <button onClick={onAction} className="empty-state-action">
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
