
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout as Layout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { DevRoleSwitcher } from './features/admin/components/DevRoleSwitcher';
import { LandingPortal } from './features/public-pages/pages/LandingPortal';
// Modular Public Pages
import { Home } from './features/public-pages/pages/Home';
import { Products } from './features/catalog/pages/Products';
import { ProductDetail } from './features/catalog/pages/ProductDetail';
import { CartPage as Cart } from './features/cart/pages/CartPage';
import { ConnectPage as Connect } from './features/clients/pages/ConnectPage';
import { PlansPage as Plans } from './features/clients/pages/PlansPage';
import { RegisterPage as Register } from './features/auth/pages/RegisterPage';
import { LegalDocs } from './features/public-pages/pages/LegalDocs';

// FLIX PAGES (NEW)
import { FlixHome } from './features/flix/FlixHome';
import { FlixProfileView } from './features/flix/FlixProfileView';

import { LoginPage as Login } from './features/auth/pages/LoginPage';
import { AdminDashboard } from './features/admin/pages/AdminDashboard';
import { CustomerDashboard } from './features/clients/pages/CustomerDashboard';
import { UserRole } from '@/src/types';
import { AuthProvider } from '@/src/features/auth/context/AuthContext';
import { TextProvider } from '@/src/contexts/TextContext';
import { CartProvider } from './features/cart/CartContext';
import { mockService } from '@/src/services/mockData';

// --- INNER APP FOR ROUTING ---
const InnerApp: React.FC = () => {
  return (
    <HashRouter>
      {/* BOTÃO FLUTUANTE PARA TESTES (TROCA DE SESSÃO) */}
      <DevRoleSwitcher />

      <Routes>
        {/* =======================================================
            0. HUB CENTRAL (LANDING)
        ======================================================= */}
        <Route path="/" element={<LandingPortal />} />

        {/* =======================================================
            1. TELAS PÚBLICAS (CLIENTE FINAL) - MODULARIZADAS
        ======================================================= */}
        {/* MODO GLOBAL */}
        <Route path="/inicio" element={<Layout><Home /></Layout>} />
        <Route path="/produtos" element={<Layout><Products /></Layout>} />


        {/* OUTRAS PÁGINAS */}
        <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />

        <Route path="/connect" element={<Layout><Connect /></Layout>} />
        <Route path="/planos" element={<Layout><Plans /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />

        <Route path="/legal" element={<Layout><LegalDocs /></Layout>} />

        {/* REDIRECT LEGACY */}
        <Route path="/shop" element={<Navigate to="/inicio" replace />} />

        {/* =======================================================
            2. CREATIVE FLIX (NEW ECOSYSTEM)
        ======================================================= */}
        <Route path="/flix" element={<FlixHome />} />
        <Route path="/p/:slug" element={<FlixProfileView />} /> {/* URL DO NFC */}

        {/* =======================================================
            3. AUTH & DASHBOARDS
        ======================================================= */}
        <Route path="/login" element={<Login />} />


        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard/*" element={
          <AdminLayout role={UserRole.ADMIN}>
            <AdminDashboard />
          </AdminLayout>
        } />

        <Route path="/customer/dashboard" element={<Layout><CustomerDashboard /></Layout>} />

      </Routes>
    </HashRouter>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TextProvider>
        <CartProvider>
          <InnerApp />
        </CartProvider>
      </TextProvider>
    </AuthProvider>
  );
};

export default App;
