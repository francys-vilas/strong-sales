import React from 'react';
import './Loading.css';

const Loading = ({ text = 'Carregando...' }) => {
    return (
        <div className="loading-overlay">
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">{text}</p>
            </div>
        </div>
    );
};

export default Loading;
