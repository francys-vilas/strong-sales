import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Trophy, Gift, Repeat, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const winnersData = Array(10).fill({
    cod: 'X3EAD31',
    nome: 'Francys',
    premio: 'Cafézinho',
    data: '17/12/2023'
  });

  const chartData = [
    { mes: 'Jan', jogadores: 30, vencedores: 18 },
    { mes: 'Fev', jogadores: 45, vencedores: 25 },
    { mes: 'Mar', jogadores: 38, vencedores: 20 },
    { mes: 'Abr', jogadores: 52, vencedores: 30 },
    { mes: 'Mai', jogadores: 48, vencedores: 28 },
    { mes: 'Jun', jogadores: 55, vencedores: 34 },
  ];

  return (
    <div className="dashboard">
      <header className="page-header">
        <div>
          <h2>Painel</h2>
          <p>Bem vindo, aqui está as informações referente a sua strong loja</p>
        </div>
      </header>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Estabelecimento</label>
          <select className="select-field select-input">
            <option>Escolha o estabelecimento</option>
          </select>
        </div>
        <div className="filter-group date-group">
          <label>Periodo</label>
          <div className="date-inputs">
            <span>De</span>
            <input type="text" value="17/01/2026" readOnly className="input-field" />
            <span>Até</span>
            <input type="text" value="17/01/2026" readOnly className="input-field" />
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Jogadores</span>
            <div className="kpi-icon-bg primary">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">55</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>12% este mês</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Vencedores</span>
            <div className="kpi-icon-bg secondary">
              <Trophy size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">34</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>8% este mês</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Presentes</span>
            <div className="kpi-icon-bg success">
              <Gift size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">32</div>
            <div className="kpi-trend positive">
              <ArrowUpRight size={14} />
              <span>24% este mês</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Repetidores</span>
            <div className="kpi-icon-bg warning">
              <Repeat size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">5</div>
            <div className="kpi-trend negative">
              <ArrowDownRight size={14} />
              <span>2% este mês</span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="chart-section card">
          <h3 className="section-title text-primary">Jogadores e vencedores</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="jogadores" 
                stroke="#6d28d9" 
                strokeWidth={2}
                name="Jogadores"
              />
              <Line 
                type="monotone" 
                dataKey="vencedores" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                name="Vencedores"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="winners-section card">
          <h3 className="section-title text-primary">Últimos ganhadores</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Cod ref</th>
                <th>Nome</th>
                <th>Prêmio</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {winnersData.map((winner, i) => (
                <tr key={i}>
                  <td className="text-gray">{winner.cod}</td>
                  <td className="text-gray">{winner.nome}</td>
                  <td className="text-gray">{winner.premio}</td>
                  <td className="text-gray">{winner.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
