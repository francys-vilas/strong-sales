import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import logoIcon from '../assets/logo_icon.png';
import styles from './Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error === "Invalid login credentials" ? "Email ou senha incorretos." : result.error);
    }
  };

  const handleGoogleLogin = async () => {
    // Placeholder for Google Login
    console.log("Google login clicked");
  };

  return (
    <div className={styles.authContainer}>
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
          {/* Logo only visible on Mobile via CSS */}
          <div className={styles.logoSection}>
            <img src={logoIcon} alt="Strong Sales" className={styles.mobileLogo} />
            <h1 className={styles.mobileAppName}>Strong Sales</h1>
          </div>

          <div className={styles.headerSection}>
            <h2 className={styles.title}>Bem-vindo de volta</h2>
            <p className={styles.subtitle}>Insira seus dados para acessar o painel.</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
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
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Esqueceu a senha?
              </Link>
            </div>

            <button type="submit" className={styles.primaryButton} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na plataforma'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>ou continue com</span>
          </div>

          <button className={styles.googleButton} onClick={handleGoogleLogin}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.29.81-.55z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div className={styles.footer}>
            Não tem uma conta? 
            <Link to="/register" className={styles.link}>Criar agora</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
