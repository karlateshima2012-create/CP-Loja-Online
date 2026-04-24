import React from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Clapperboard, LogOut, LayoutDashboard, Truck, ShieldCheck, Box, Clock } from 'lucide-react';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { Logo } from '../ui/Logo';
import { UserRole } from '@/src/types';
import { T } from '@/src/contexts/TextContext';
import { Footer } from './Footer';

const NavLink = ({ to, children, active, onClick }: { to: string, children?: React.ReactNode, active: boolean, onClick?: () => void }) => {
  return (
    <Link
      to={to}
      className={`relative px-2 py-1 text-sm font-bold uppercase tracking-wide transition-colors ${active ? 'text-brand-blue' : 'text-brand-gray hover:text-white'
        }`}
      onClick={onClick}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue shadow-[0_0_10px_rgba(36,155,203,1)]"></span>
      )}
    </Link>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart } = useCart();
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Efeito de neon para os botões usando Azul Principal
  const glowBorder = "border border-brand-blue/30 hover:border-brand-blue shadow-[0_0_15px_rgba(36,155,203,0.15)] hover:shadow-[0_0_20px_rgba(36,155,203,0.4)]";
  
  // Hover permanente para mobile
  const mobileGlow = "border-brand-blue/50 shadow-[0_0_20px_rgba(36,155,203,0.4)] bg-brand-blue/10";

  // Context Navigation Logic
  const homeLink = '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === UserRole.ADMIN) return '/admin/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-brand-blue/30">
      
      {/* Header (High Contrast) */}
      <header className="bg-slate-900/90 backdrop-blur-2xl border-b border-brand-blue/40 sticky top-0 z-50 shadow-[0_4px_30px_rgba(36,155,203,0.15)]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          {/* Logo Area */}
          <Link to={homeLink} className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
            <Logo className="h-14 md:h-16" withText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: 'Impressão 3D', cat: 'Impressão 3D' },
              { label: 'Tecnologia NFC', cat: 'Tecnologia NFC' },
              { label: 'Soluções Digitais', cat: 'Soluções Digitais' }
            ].map((item) => (
              <Link 
                key={item.cat}
                to={`/?cat=${item.cat}`}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-blue transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(56,182,255,0.8)]"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 md:gap-4">

            {/* Auth Area */}
            {user ? (
              <Link to={getDashboardLink()} className="flex items-center gap-2 text-xs font-bold text-white hover:text-brand-blue transition-colors">
                <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-brand-blue shadow-[0_0_10px_rgba(36,155,203,0.3)]">
                  {role === UserRole.CUSTOMER ? <User size={18} fill="currentColor" /> : <LayoutDashboard size={18} />}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="leading-none text-[10px] text-slate-500 uppercase">Conta</span>
                  <span className="leading-none">{user.name.split(' ')[0]}</span>
                </div>
              </Link>
            ) : (
              <>
                {/* Botão Entrar Mobile */}
                <Link to="/login" className="flex md:hidden flex-col items-center gap-0.5 text-white transition-opacity">
                   <User size={20} fill="currentColor" className="text-white" />
                   <span className="text-[8px] font-black uppercase tracking-tighter">Entrar</span>
                </Link>

                {/* Botão Entrar Desktop */}
                <Link to="/login" className="hidden md:flex items-center gap-2 text-xs text-white bg-brand-blue hover:bg-brand-blue/80 transition-all uppercase tracking-wider font-bold px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(36,155,203,0.5)] border border-brand-blue">
                  ENTRAR
                </Link>
              </>
            )}

            {/* Carrinho */}
            <Link to="/cart" className={`relative p-2.5 md:p-3 rounded-full text-brand-blue transition-all ${glowBorder} md:border-transparent ${mobileGlow} md:bg-transparent`}>
              <ShoppingCart size={20} className="md:w-[22px] md:h-[22px]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[9px] md:text-[10px] font-bold rounded-full w-4 md:w-5 h-4 md:h-5 flex items-center justify-center shadow-lg ring-2 ring-slate-900">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};
