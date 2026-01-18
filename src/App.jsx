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
import Games from './pages/Games';
import Subscription from './pages/Subscription';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="minha-loja" element={<MinhaLoja />} />
        <Route path="store" element={<MinhaLoja />} />
        <Route path="winners" element={<Winners />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="campaigns/new" element={<NewCampaign />} />
        <Route path="whatsapp" element={<Whatsapp />} />
        <Route path="games" element={<Games />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>
    </Routes>
  );
}

export default App;
