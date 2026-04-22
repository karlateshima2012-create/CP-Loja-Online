
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
              {/* ================================================
                  LOJA ONLINE - PÁGINA PRINCIPAL
                  Todas as rotas antigas redirecionam para cá
              ================================================ */}
              <Route path="/" element={<Layout><Products /></Layout>} />
              <Route path="/produto/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/cart" element={<Layout><CartPage /></Layout>} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Dashboards */}
              <Route path="/customer/dashboard" element={<Layout><CustomerDashboard /></Layout>} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Redirecionamentos de rotas legadas */}
              <Route path="/produtos" element={<Navigate to="/" replace />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/inicio" element={<Navigate to="/" replace />} />
              <Route path="/flix" element={<Navigate to="/" replace />} />
              <Route path="/flix/*" element={<Navigate to="/" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </TextProvider>
    </HashRouter>
  );
}

export default App;
