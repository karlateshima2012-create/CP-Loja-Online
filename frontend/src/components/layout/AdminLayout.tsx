
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  Settings,
  ShoppingBag,
  LogOut,
  User,
  Tags,
  MessageSquare,
  Ticket,
  Boxes,
  Type,
  Smile,
  Clapperboard
} from 'lucide-react';
import { UserRole } from '@/src/types';
import { Logo } from '../ui/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, role }) => {
  const location = useLocation();
  const isAdmin = true; // Always admin in single-store portal
  const prefix = '/admin/dashboard';

  const NavItem = ({ to, icon: Icon, label, end = false }: { to: string, icon: any, label: string, end?: boolean }) => {
    // Exact match for dashboard home, partial match for sub-routes
    const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
          ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/20 shadow-[0_0_10px_rgba(36,155,203,0.1)]'
          : 'text-brand-gray hover:bg-slate-800 hover:text-white'
          }`}
      >
        <Icon size={20} className={isActive ? "text-brand-blue" : "text-slate-500"} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 mb-4 group hover:opacity-90 transition-opacity">
            <Logo className="h-8" withText={true} />
          </Link>
          <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest bg-brand-blue/20 px-2 py-1 rounded border border-brand-blue/30 inline-block">
            Portal Admin
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {/* Dashboard Home - Exact Match needed */}
          <NavItem to={`${prefix}`} icon={LayoutDashboard} label="Dashboard" end={true} />

          <NavItem to={`${prefix}/orders`} icon={ShoppingBag} label="Pedidos" />
          <NavItem to={`${prefix}/customers`} icon={Smile} label="Clientes (CRM)" />
          <NavItem to={`${prefix}/flix`} icon={Clapperboard} label="CreativeFlix" />
          <NavItem to={`${prefix}/products`} icon={Package} label="Produtos" />
          <NavItem to={`${prefix}/materials`} icon={Boxes} label="Estoque & Insumos" />
          <NavItem to={`${prefix}/content`} icon={Type} label="Editor de Textos" />
          <div className="pt-4 mt-4 border-t border-slate-800">
            <NavItem to={`${prefix}/coupons`} icon={Ticket} label="Cupons" />
            <NavItem to={`${prefix}/testimonials`} icon={MessageSquare} label="Depoimentos" />
            <NavItem to={`${prefix}/settings`} icon={Settings} label="Configurações" />
          </div>

        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-950/10 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sair do Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold text-white flex items-center gap-2">
            <Logo className="h-8" />
            Admin
          </span>
          <Link to="/" className="text-xs font-bold text-brand-blue border border-brand-blue/30 px-3 py-1 rounded-full">Voltar à Loja</Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 text-slate-200">
          {children}
        </main>
      </div>
    </div>
  );
};
