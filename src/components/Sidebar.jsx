import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Trophy, 
  TrendingUp, 
  MessageCircle, 
  Store, 
  Network, 
  CreditCard, 
  LogOut,
  Gamepad2
} from 'lucide-react';
import logoIcon from '../assets/logo_icon.png';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Painel', path: '/', sub: 'Dashboard' },
    { icon: Megaphone, label: 'Minhas campanhas', path: '/campaigns', sub: 'Campanhas' },
    { icon: Trophy, label: 'Vencedores', path: '/winners', sub: 'Ranking' },
    { icon: TrendingUp, label: 'Marketing', path: '/marketing', sub: 'Materiais' },
    { icon: MessageCircle, label: 'Whatsapp', path: '/whatsapp', sub: 'Mensagens' },
    { icon: Gamepad2, label: 'Jogos', path: '/games', sub: 'Sorteios' },
    { icon: Store, label: 'Minha loja', path: '/store', sub: 'Configurações' },
    { icon: Network, label: 'Rede', sub: '(Em breve)' },
    { icon: CreditCard, label: 'Assinatura', sub: '(Em breve)' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logoIcon} alt="Strong Sales" className="logo-symbol" style={{ height: '40px', width: 'auto' }} />
          <div className="logo-text-area">
            <h1 className="logo-title">Strong Sales</h1>
            <p className="logo-tagline">"Fazer negócio é nossa principal aptidão"</p>
          </div>
        </div>
        <p className="user-info">contato@strongsales.com.br</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={`nav-item ${item.path && location.pathname === item.path ? 'active' : ''} ${!item.path ? 'disabled' : ''}`}>
              {item.path ? (
                <Link to={item.path} className="nav-link">
                  <div className="nav-icon">
                    <item.icon size={20} strokeWidth={2} />
                  </div>
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    {item.sub && <span className="nav-sub">{item.sub}</span>}
                  </div>
                </Link>
              ) : (
                <a href="#" className="nav-link">
                  <div className="nav-icon">
                    <item.icon size={20} strokeWidth={2} />
                  </div>
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    {item.sub && <span className="nav-sub">{item.sub}</span>}
                  </div>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <div className="nav-icon">
            <LogOut size={20} strokeWidth={2} />
          </div>
          <span className="nav-label">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
