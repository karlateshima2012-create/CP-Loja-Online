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

const MobileNavLink = ({ to, children, onClick }: { to: string, children?: React.ReactNode, onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3 rounded-lg text-brand-gray hover:bg-slate-800 hover:text-brand-blue font-bold uppercase transition-colors"
  >
    {children}
  </Link>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart } = useCart();
  const { user, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

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
    if (role === UserRole.PARTNER) return '/partner/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-gray-100 font-sans selection:bg-brand-blue/30">
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-[#020617] border-b border-white/5 py-2 overflow-hidden relative z-[100]">
          <div className="animate-marquee whitespace-nowrap flex items-center w-max">
              {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-10 px-4">
                      <div className="flex items-center gap-2 text-brand-blue text-[8px] font-black uppercase tracking-widest opacity-80">
                          <Truck size={10} /> Envio para todo Japão
                      </div>
                      <div className="flex items-center gap-2 text-brand-pink text-[8px] font-black uppercase tracking-widest opacity-80">
                          <ShieldCheck size={10} /> Tecnologia NFC 2.0
                      </div>
                      <div className="flex items-center gap-2 text-brand-yellow text-[8px] font-black uppercase tracking-widest opacity-80">
                          <Box size={10} /> Impressão 3D Premium
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-[8px] font-black uppercase tracking-widest">
                          <Clock size={10} /> Suporte Rápido - WhatsApp
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-brand-blue/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          {/* Logo Area */}
          <Link to={homeLink} className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
            <Logo className="h-16" withText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/?cat=Impressão 3D" active={location.search.includes('Impressão%203D')}>Impressão 3D</NavLink>
            <NavLink to="/?cat=Tecnologia NFC" active={location.search.includes('Tecnologia%20NFC')}>Tecnologia NFC</NavLink>
            <NavLink to="/?cat=Sistemas" active={location.search.includes('Sistemas')}>SOLUÇÕES DIGITAIS</NavLink>
          </nav>

          <div className="flex items-center gap-4">

            {/* Auth Area */}
            {user ? (
              <div className="hidden lg:flex items-center gap-4">
                <Link to={getDashboardLink()} className="flex items-center gap-2 text-xs font-bold text-white hover:text-brand-blue transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-brand-blue">
                    {role === UserRole.CUSTOMER ? <User size={16} /> : <LayoutDashboard size={16} />}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="leading-none text-[10px] text-slate-500 uppercase"><T k="nav_dashboard" default="Conta" /></span>
                    <span className="leading-none">{user.name.split(' ')[0]}</span>
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Sair">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex items-center gap-2 text-xs text-white bg-brand-blue hover:bg-brand-blue/80 transition-all uppercase tracking-wider font-bold px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(36,155,203,0.5)] hover:shadow-[0_0_25px_rgba(36,155,203,0.8)] border border-brand-blue">
                <T k="nav_login" default="ENTRAR" />
              </Link>
            )}

            {/* Carrinho com Hover Ativado no Mobile */}
            <Link to="/cart" className={`relative p-3 rounded-full text-brand-blue transition-all ${glowBorder} md:border-transparent ${mobileGlow} md:bg-transparent`}>
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg ring-2 ring-slate-900">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Hambúrguer removido do Mobile (oculto) */}
            <button
              className="hidden md:hidden p-2 text-brand-blue hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
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
