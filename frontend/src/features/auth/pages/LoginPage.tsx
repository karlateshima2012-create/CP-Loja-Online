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
  const { role, devLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  const handleQuickAccess = (role: UserRole) => {
    devLogin(role);
    if (role === UserRole.ADMIN) {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  const handleLoginSuccess = () => {
    if (redirect) {
      navigate(redirect);
    } else {
      switch (role) {
        case UserRole.ADMIN:
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/customer/dashboard');
      }
    }
  };

  const handleForgotPassword = (type: string) => {
    if (type === 'customer') {
      alert('Um link para redefinir sua senha foi enviado para seu email.');
    } else {
      alert('Entre em contato com o suporte: suporte@creativeprint.jp');
    }
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
          <h2 className="text-xl font-bold text-white mb-2">Acesso</h2>
          <p className="text-brand-gray text-sm">Selecione seu perfil para continuar</p>
        </div>

        <div className="p-2 bg-slate-950 flex">
          <TabButton
            active={activeTab === 'customer'}
            onClick={() => setActiveTab('customer')}
            icon={<User size={16} />}
            label="Cliente"
            activeColor="text-white bg-slate-800"
          />
          <TabButton
            active={activeTab === 'admin'}
            onClick={() => setActiveTab('admin')}
            icon={<ShieldCheck size={16} />}
            label="Admin"
            activeColor="text-brand-blue bg-slate-800"
          />
        </div>

        <div className="p-8">
          {activeTab === 'customer' && (
            <>
              <CustomerLoginForm
                onSuccess={handleLoginSuccess}
                onForgotPassword={() => handleForgotPassword('customer')}
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
            </>
          )}


          {activeTab === 'admin' && (
            <AdminLoginForm onSuccess={handleLoginSuccess} />
          )}

          {/* QUICK ACCESS BUTTON (DEV ONLY) */}
          <div className="mt-8 pt-4 border-t border-slate-800/50">
            <button
              onClick={() => handleQuickAccess(activeTab === 'admin' ? UserRole.ADMIN : UserRole.CUSTOMER)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all border border-slate-700 group"
            >
              Entrada Rápida <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2 uppercase tracking-tighter">Bypass para Desenvolvimento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, activeColor }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 ${active
      ? `${activeColor} shadow-lg border border-slate-700`
      : 'text-brand-gray hover:text-white'
      }`}
  >
    {icon} {label}
  </button>
);
