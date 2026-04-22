
import React from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AuthProvider } from './features/auth/context/AuthContext';
import { CartProvider } from './features/cart/CartContext';
import { TextProvider } from './contexts/TextContext';

// Pages
import { Products } from './features/catalog/pages/Products';
import { ProductDetail } from './features/catalog/pages/ProductDetail';
import { CartPage } from './features/cart/pages/CartPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { CustomerDashboard } from './features/clients/pages/CustomerDashboard';
import { AdminDashboard } from './features/admin/pages/AdminDashboard';
import { LandingPortal } from './features/public-pages/pages/LandingPortal';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

function App() {
  return (
    <HashRouter>
      <TextProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* 
                  ESTRUTURA DEFINITIVA:
                  1. LOJA (RAIZ)
                  2. PORTAL (ACESSO RÁPIDO)
              */}
              
              {/* Rota Principal: Loja Online */}
              <Route path="/" element={<Layout><Products /></Layout>} />
              <Route path="/produto/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/cart" element={<Layout><CartPage /></Layout>} />

              {/* Rota de Suporte: Portal de Acesso Rápido */}
              <Route path="/portal" element={<LandingPortal />} />

              {/* Área Autenticada e Dashboards */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/customer/dashboard" element={<Layout><CustomerDashboard /></Layout>} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* 
                  LIMPEZA TOTAL: 
                  Qualquer outra rota (inicio, produtos, flix, etc) 
                  agora é redirecionada para a Loja principal.
              */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </TextProvider>
    </HashRouter>
  );
}

export default App;
