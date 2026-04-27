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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8 text-center border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="flex justify-center mb-6">
            <Logo className="h-12" withText={true} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Bem-vindo de volta</h2>
        </div>

        <div className="p-8">
          <CustomerLoginForm
            onSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
          />
          
          <div className="text-center pt-4 border-t border-slate-800 mt-6">
            <p className="text-sm text-slate-500">Ainda não tem conta?</p>
            <Link
              to={`/register${redirect ? `?redirect=${redirect}` : ''}`}
              className="text-brand-blue hover:text-white font-bold text-sm"
            >
              Criar conta grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
