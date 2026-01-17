import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import NewCampaign from './pages/NewCampaign';
import Marketing from './pages/Marketing';
import Whatsapp from './pages/Whatsapp';
import MinhaLoja from './pages/MinhaLoja';
import Winners from './pages/Winners';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/new" element={<NewCampaign />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/whatsapp" element={<Whatsapp />} />
        <Route path="/store" element={<MinhaLoja />} />
        <Route path="/winners" element={<Winners />} />
      </Routes>
    </Layout>
  );
}

export default App;
