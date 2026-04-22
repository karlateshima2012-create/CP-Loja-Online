
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/src/components/ui/Logo';
import { ShoppingBag, ShieldCheck, ArrowRight, Globe, User, Zap } from 'lucide-react';
import { T } from '@/src/contexts/TextContext';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { UserRole } from '@/src/types';

export const LandingPortal: React.FC = () => {
  const navigate = useNavigate();
  const { devLogin } = useAuth();

  const handleQuickAccess = (role: UserRole, path: string) => {
    devLogin(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo className="h-16" withText={true} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            <T k="portal_hero_title" default="Hub de Acesso Rápido" />
          </h1>
          <p className="text-brand-gray text-lg max-w-2xl mx-auto font-medium">
            Acesso direto ao ecossistema oficial Creative Print.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* 1. PUBLIC STORE (BLUE) */}
          <div className="group relative bg-slate-900 rounded-3xl p-1 border border-slate-800 hover:border-brand-blue/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(36,155,203,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-slate-950 rounded-[22px] p-8 h-full flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Loja Pública</h2>
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mb-4">Catálogo Completo</span>
              <p className="text-brand-gray text-sm mb-8 leading-relaxed">
                Navegue pelos produtos NFC e 3D. Visão padrão para qualquer visitante do site.
              </p>
              <button
                onClick={() => navigate('/inicio')}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 py-3 rounded-xl text-white font-bold hover:bg-brand-blue hover:border-brand-blue transition-all group/btn"
              >
                Abrir Catálogo <ArrowRight size={18} className="text-brand-blue group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* 2. CUSTOMER AREA (NEW - REPLACED PARTNER) */}
          <div className="group relative bg-slate-900 rounded-3xl p-1 border border-slate-800 hover:border-brand-yellow/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,242,0,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-slate-950 rounded-[22px] p-8 h-full flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Área do Cliente</h2>
              <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest mb-4">Acesso Rápido</span>
              <p className="text-brand-gray text-sm mb-8 leading-relaxed">
                Acompanhe seus pedidos, baixe comprovantes e gerencie suas páginas NFC/CreativeFlix.
              </p>
              <button
                onClick={() => handleQuickAccess(UserRole.CUSTOMER, '/customer/dashboard')}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-brand-yellow/10 border border-brand-yellow/30 py-3 rounded-xl text-brand-yellow font-bold hover:bg-brand-yellow hover:text-slate-950 transition-all group/btn"
              >
                Entrar como Cliente <Zap size={18} className="fill-current" />
              </button>
            </div>
          </div>

          {/* 3. ADMIN CP (PINK) */}
          <div className="group relative bg-slate-900 rounded-3xl p-1 border border-slate-800 hover:border-brand-pink/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(229,21,122,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-slate-950 rounded-[22px] p-8 h-full flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Painel Admin</h2>
              <span className="text-[10px] font-bold text-brand-pink uppercase tracking-widest mb-4">Gestão do Sistema</span>
              <p className="text-brand-gray text-sm mb-8 leading-relaxed">
                Controle total de produtos, pedidos, clientes e configurações globais da Creative Print.
              </p>
              <button
                onClick={() => handleQuickAccess(UserRole.ADMIN, '/admin/dashboard')}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-brand-pink/10 border border-brand-pink/30 py-3 rounded-xl text-brand-pink font-bold hover:bg-brand-pink hover:text-white transition-all group/btn"
              >
                Acessar Painel <ShieldCheck size={18} />
              </button>
            </div>
          </div>

        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 text-xs flex items-center justify-center gap-2">
            <Globe size={12} /> Creative Print v1.2 • Ambiente de Desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
};
