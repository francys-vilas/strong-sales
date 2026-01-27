import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import styles from './Auth.module.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/update-password',
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Verifique seu email para redefinir a senha.");
        }
        setLoading(false);
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.logoSection}>
                     <div style={{ position: 'relative' }}>
                         <MessageCircle size={48} color="#3b82f6" fill="white" />
                     </div>
                    <h1 className={styles.appName}>Strong Sales</h1>
                </div>

                <button 
                  onClick={() => navigate('/login')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'rgba(255,255,255,0.7)', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                >
                  <ArrowLeft size={16} /> Voltar
                </button>

                <h2 className={styles.title}>Recuperar Senha</h2>

                {message && (
                    <div style={{ 
                        background: 'rgba(16, 185, 129, 0.2)', 
                        border: '1px solid rgba(16, 185, 129, 0.5)', 
                        color: '#6ee7b7', 
                        padding: '0.8rem', 
                        borderRadius: '8px', 
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem' 
                    }}>
                        {message}
                    </div>
                )}

                {error && (
                    <div className={styles.errorMessage}>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleReset}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Seu email</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                                required
                            />
                            <Mail className={styles.inputIcon} size={20} />
                        </div>
                    </div>

                    <button type="submit" className={styles.primaryButton} disabled={loading}>
                        {loading ? 'Enviando...' : 'Recuperar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
