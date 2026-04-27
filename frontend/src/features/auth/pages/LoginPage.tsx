import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Users, User, ArrowRight } from 'lucide-react';
import { Logo } from '@/src/components/ui/Logo';
import { CustomerLoginForm } from '../components/CustomerLoginForm';
import { AdminLoginForm } from '../components/AdminLoginForm';
import { UserRole } from '@/src/types';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleLoginSuccess = () => {
    if (redirect) {
      navigate(redirect);
    } else {
      // O sistema detecta o role automaticamente do AuthContext após o login
      if (role === UserRole.ADMIN) {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    }
  };

  const handleForgotPassword = () => {
    alert('Um link para redefinir sua senha foi enviado para seu email: suporte@creativeprintjp.com');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Starfield />
      
      {/* ATMOSPHERIC GLOWS (NEBULOSAS) */}
      <div className="absolute top-0 -left-[10%] w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-0 -right-[10%] w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-brand-blue/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(56,182,255,0.1)] overflow-hidden relative z-10 animate-fade-in-up">
        <div className="p-8 text-center border-b border-white/5 bg-white/5 backdrop-blur-md">
          <div className="flex justify-center mb-6">
            <Logo className="h-12" withText={true} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Bem-vindo de volta</h2>
          <div className="w-16 h-1 bg-brand-blue rounded-full mx-auto shadow-[0_0_10px_rgba(56,182,255,0.5)]"></div>
        </div>

        <div className="p-8">
          <CustomerLoginForm
            onSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
          />
          
          <div className="text-center pt-6 border-t border-white/5 mt-6">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Ainda não tem conta?</p>
            <Link
              to={`/register${redirect ? `?redirect=${redirect}` : ''}`}
              className="inline-block px-8 py-3 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-slate-950 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(56,182,255,0.1)]"
            >
              Criar conta grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
