import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import logoIcon from '../assets/logo_icon.png';
import styles from './Auth.module.css';
import SuccessModal from '../components/SuccessModal';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        const result = await register(email, password, { full_name: name });

        if (result.success) {
            setShowSuccess(true);
        } else {
            setError(result.error);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        // Redirect to dashboard as user is likely auto-logged in by Supabase
        navigate('/');
    };

    return (
        <div className={styles.authContainer}>
            <SuccessModal 
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                title="Conta Criada!"
                message="Sua conta foi criada com sucesso. Bem-vindo ao Strong Sales!"
            />

            {/* Left Side - Branding (Desktop Only) */}
            <div className={styles.brandingSide}>
                <div className={styles.brandingContent}>
                    <img src={logoIcon} alt="Strong Sales" className={styles.brandingLogo} />
                    <h1 className={styles.brandingTitle}>Strong Sales</h1>
                    <p className={styles.brandingSubtitle}>
                        "Fazer negócio é nossa principal aptidão"
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.formSide}>
                <div className={styles.authCard}>
                    {/* Logo visible only on Mobile */}
                    <div className={styles.logoSection}>
                        <img src={logoIcon} alt="Strong Sales" className={styles.mobileLogo} />
                        <h1 className={styles.mobileAppName}>Strong Sales</h1>
                    </div>

                    <div className={styles.headerSection}>
                        <h2 className={styles.title}>Crie sua conta</h2>
                        <p className={styles.subtitle}>Preencha os dados abaixo para começar.</p>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nome Completo</label>
                            <div className={styles.inputWrapper}>
                                <User className={styles.inputIconLeft} size={20} />
                                <input
                                    type="text"
                                    className={`${styles.input} ${styles.inputWithIcon}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="João Silva"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <div className={styles.inputWrapper}>
                                <Mail className={styles.inputIconLeft} size={20} />
                                <input
                                    type="email"
                                    className={`${styles.input} ${styles.inputWithIcon}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Senha</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIconLeft} size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`${styles.input} ${styles.inputWithIcon}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <div
                                    className={styles.inputIconRight}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Confirmar Senha</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIconLeft} size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`${styles.input} ${styles.inputWithIcon}`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.primaryButton} disabled={loading}>
                            {loading ? 'Criando conta...' : 'Criar minha conta'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        Já tem uma conta?
                        <Link to="/login" className={styles.link}>Faça login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
