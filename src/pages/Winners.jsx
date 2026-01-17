import React, { useState } from 'react';
import { Download } from 'lucide-react';
import './Winners.css';

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

  return (
    <div className="winners">
      <header className="page-header">
        <div>
          <h2>Vencedores</h2>
          <p className="page-subtitle">Histórico e gestão de participantes premiados</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" title="Exportar planilha">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </header>

      <div className="winners-card">
        <div className="filters-row">
          <div className="filter-input-group">
            <input 
              type="text" 
              placeholder="🔍 Código de referência"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="filter-input-group">
            <input 
              type="text" 
              placeholder="👤 Nome do vencedor"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="filter-input-group">
            <input 
              type="text" 
              placeholder="✉️ Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
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
                    <span className="prize-badge">
                      🎁 {winner.ganhou}
                    </span>
                  </td>
                  <td>{winner.expiracao}</td>
                  <td>{winner.quantasJogou}</td>
                  <td>{winner.campanha}</td>
                  <td>
                    <span className="action-cell">Ver detalhes</span>
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
