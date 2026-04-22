
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { UserRole } from '@/src/types';
import { ShieldCheck, Users, ShoppingBag, X, Command, Store, Globe, User } from 'lucide-react';

export const DevRoleSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { devLogin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (path: string, role?: UserRole) => {
    if (role) {
      devLogin(role);
    }
    navigate(path);
    setIsOpen(false);
  };

  // Função para limpar sessão e simular visitante "deslogado"
  const simulateVisitor = (path: string) => {
    logout(); // Usa a função do contexto para limpar tudo corretamente
    navigate(path);
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCustomerTest = () => {
    devLogin(UserRole.CUSTOMER);
    navigate('/customer/dashboard');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 border border-brand-blue/50 text-brand-blue p-3 rounded-full shadow-[0_0_20px_rgba(36,155,203,0.3)] hover:scale-110 transition-transform flex items-center gap-2"
          title="Alternar Perfil (Modo Teste)"
        >
          <Command size={20} />
        </button>
      )}

      {isOpen && (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl w-72 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ambiente de Teste</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
          </div>

          <div className="space-y-4">

            {/* SIMULAR CLIENTE (VISÃO DA LOJA) */}
            <div>
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-2 block">Simular Cliente (Storefront)</span>
              <div className="space-y-2">
                <button
                  onClick={() => simulateVisitor('/inicio')}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-medium border border-transparent hover:border-slate-700"
                >
                  <div className="bg-slate-800 p-1.5 rounded text-white"><Globe size={14} /></div>
                  Home Padrão (Visitante)
                </button>

                <button
                  onClick={() => simulateVisitor('/produtos')}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-brand-blue transition-colors text-sm font-medium border border-transparent hover:border-brand-blue/30"
                >
                  <div className="bg-brand-blue/10 p-1.5 rounded text-brand-blue"><Store size={14} /></div>
                  Catálogo de Produtos
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-slate-800"></div>

            {/* SIMULAR LOGIN (PAINÉIS) */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Acesso Restrito (Login)</span>
              <div className="space-y-2">
                <button
                  onClick={handleCustomerTest}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-medium"
                >
                  <div className="bg-slate-800 p-1.5 rounded text-white"><User size={14} /></div>
                  Área do Cliente (Teste)
                </button>

                <button
                  onClick={() => handleSwitch('/admin/dashboard', UserRole.ADMIN)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-brand-pink transition-colors text-sm font-medium"
                >
                  <div className="bg-brand-pink/20 p-1.5 rounded text-brand-pink"><ShieldCheck size={14} /></div>
                  Painel Admin CP
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-2 mt-2">
              <button
                onClick={() => handleSwitch('/')}
                className="w-full text-center text-xs text-brand-gray hover:text-white py-1"
              >
                Voltar ao Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
