import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import NewCampaign from './pages/NewCampaign';
import Marketing from './pages/Marketing';

import MinhaLoja from './pages/MinhaLoja';
import Winners from './pages/Winners';
import Games from './pages/Games';
import Subscription from './pages/Subscription';

import CampaignGame from './pages/CampaignGame';
import Whatsapp from './pages/Whatsapp';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import CampaignRouter from './components/CampaignRouter';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Smart Router for Shops */}
      <Route path="/app/:orgId" element={<CampaignRouter />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="minha-loja" element={<MinhaLoja />} />
        <Route path="store" element={<MinhaLoja />} />
        <Route path="winners" element={<Winners />} />
        <Route path="marketing" element={<Marketing />} />

        <Route path="campaigns" element={<Campaigns />} />
        <Route path="whatsapp" element={<Whatsapp />} />
        <Route path="campaigns/new" element={<NewCampaign />} />
        <Route path="campaigns/edit/:id" element={<NewCampaign />} />

        <Route path="games" element={<Games />} />
        <Route path="subscription" element={<Subscription />} />
      </Route>
      <Route path="/play/:campaignId" element={<CampaignGame />} />
    </Routes>
    <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
