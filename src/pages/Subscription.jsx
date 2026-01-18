import React from 'react';
import { Check, CreditCard, ShieldCheck } from 'lucide-react';
import styles from './Subscription.module.css';

const Subscription = () => {
  const planFeatures = [
    'Acesso completo ao Dashboard',
    'Gestão ilimitada de Campanhas',
    'CRM de Vendas Avançado',
    'Integração com WhatsApp',
    'Área de Jogos e Sorteios',
    'Suporte Prioritário 24/7',
    'Relatórios em PDF e Excel',
    '30 dias de garantia',
  ];

  return (
    <div className={styles.subscriptionPage}>
      <header className={styles.header}>
        <h2>Escolha o plano ideal para o seu negócio</h2>
        <p className={styles.subtitle}>
          Potencialize suas vendas com a ferramenta mais completa do mercado.
          Sem fidelidade, cancele quando quiser.
        </p>
      </header>

      <div className={styles.plansContainer}>
        <div className={`${styles.planCard} ${styles.featuredPlan}`}>
          <div className={styles.badge}>Recomendado</div>
          <h3 className={styles.planName}>Plano PRO</h3>
          
          <div className={styles.priceContainer}>
            <span className={styles.currency}>R$</span>
            <span className={styles.price}>497</span>
            <span className={styles.decimal}>,00</span>
            <div className={styles.period}>/mês</div>
          </div>

          <ul className={styles.featuresList}>
            {planFeatures.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                <Check size={20} className={styles.checkIcon} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button className={styles.subscribeButton}>
            <CreditCard size={20} />
            Assinar Agora
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} />
            Pagamento 100% Seguro
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
