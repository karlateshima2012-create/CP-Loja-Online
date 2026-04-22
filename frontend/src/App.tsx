
import React from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Products } from './features/catalog/pages/Products';
import { Cart } from './features/cart/pages/Cart';
import { Checkout } from './features/checkout/pages/Checkout';
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { TextProvider } from './contexts/TextContext';

// Layout wrapper simplificado
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
                  ESTRUTURA SIMPLIFICADA: 
                  A LOJA É A PÁGINA PRINCIPAL E ÚNICA 
              */}
              <Route path="/" element={<Layout><Products /></Layout>} />
              
              {/* Redirecionamentos para evitar erros e telas brancas */}
              <Route path="/produtos" element={<Navigate to="/" replace />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/inicio" element={<Navigate to="/" replace />} />

              {/* Demais rotas funcionais da loja */}
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Fallback para qualquer rota inexistente */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </TextProvider>
    </HashRouter>
  );
}

export default App;
