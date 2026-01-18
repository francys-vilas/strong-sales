import React, { useState } from 'react';
import { Download } from 'lucide-react';
import styles from './Winners.module.css';

const Winners = () => {
  const [searchRef, setSearchRef] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const winnersData = Array(10).fill({
    codRef: 'x3y45d',
    nome: 'Thiago',
    email: 'thiago@hotmail.com',
    dataHora: '01/12/2023',
    ganhou: 'café',
    expiracao: '60',
    quantasJogou: '3',
    campanha: 'Campanha ganhar muito',
    curtir: 'Curtir e...'
  });

  const topWinners = [
    {
      id: 2,
      name: 'João Souza',
      rank: 2,
      prize: 'R$ 2.000',
      initial: 'J',
      color: 'silver'
    },
    {
      id: 1,
      name: 'Maria Silva',
      rank: 1,
      prize: 'iPhone 15 Pro',
      initial: 'M',
      color: 'gold'
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      rank: 3,
      prize: 'Kit Churrasco',
      initial: 'A',
      color: 'bronze'
    }
  ];

  return (
    <div className={styles.winnersContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h2>Vencedores</h2>
          <p className={styles.pageSubtitle}>Histórico e gestão de participantes premiados</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnPrimary} title="Exportar planilha">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </header>

      {/* Podium Section */}
      <div className={styles.podiumSection}>
        {topWinners.map((winner) => (
          <div key={winner.id} className={`${styles.podiumCard} ${styles[winner.color]}`}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarCircle}>
                {winner.initial}
              </div>
              <div className={styles.rankBadge}>
                {winner.rank}º Lugar
              </div>
            </div>
            <h3 className={styles.winnerName}>{winner.name}</h3>
            <p className={styles.winnerPrize}>{winner.prize}</p>
          </div>
        ))}
      </div>

      <div className={styles.winnersCard}>
        <div className={styles.filtersRow}>
          <div className={styles.filterInputGroup}>
            <input 
              type="text" 
              placeholder="🔍 Código de referência"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.filterInputGroup}>
            <input 
              type="text" 
              placeholder="👤 Nome do vencedor"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.filterInputGroup}>
            <input 
              type="text" 
              placeholder="✉️ Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className={styles.inputField}
            />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Cód. ref</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Data e hora</th>
                <th>Ganhou?</th>
                <th>Expiração</th>
                <th>Quantas x jogou</th>
                <th>Campanha</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {winnersData.map((winner, index) => (
                <tr key={index}>
                  <td>{winner.codRef}</td>
                  <td>{winner.nome}</td>
                  <td>{winner.email}</td>
                  <td>{winner.dataHora}</td>
                  <td>
                    <span className={styles.prizeBadge}>
                      🎁 {winner.ganhou}
                    </span>
                  </td>
                  <td>{winner.expiracao}</td>
                  <td>{winner.quantasJogou}</td>
                  <td>{winner.campanha}</td>
                  <td>
                    <span className={styles.actionCell}>Ver detalhes</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Winners;
