import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Settings, 
  Star, 
  Ticket, 
  Truck, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Layers,
  Globe,
  Monitor,
  FileText
} from 'lucide-react';
import { AdminOverview } from './components/AdminOverview';
import { OrdersManager } from './components/OrdersManager';
import { ProductsManager } from './components/ProductsManager';
import { CustomersManager } from './components/CustomersManager';
import { SettingsManager } from './components/SettingsManager';
import { TestimonialsManager } from './components/TestimonialsManager';
import { CouponsManager } from './components/CouponsManager';
import { MaterialsManager } from './components/MaterialsManager';
import { FlixManager } from './components/FlixManager';
import { ContentManager } from './components/ContentManager';
import { useNavigate } from 'react-router-dom';

type TabType = 'overview' | 'orders' | 'customers' | 'flix' | 'products' | 'stock' | 'testimonials' | 'coupons' | 'settings';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'flix', label: 'Páginas Flix', icon: Globe },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'stock', label: 'Estoque', icon: Layers },
    { id: 'testimonials', label: 'Depoimentos', icon: Star },
    { id: 'coupons', label: 'Cupons', icon: Ticket },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview />;
      case 'orders': return <OrdersManager />;
      case 'customers': return <CustomersManager />;
      case 'flix': return <FlixManager />;
      case 'products': return <ProductsManager />;
      case 'stock': return <MaterialsManager />;
      case 'testimonials': return <TestimonialsManager />;
      case 'coupons': return <CouponsManager />;
      case 'settings': return <SettingsManager />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 h-20">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shrink-0">
            <Monitor className="text-slate-900" size={20} />
          </div>
          {isSidebarOpen && <span className="font-black text-white uppercase tracking-tighter text-xl">Super Admin</span>}
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-brand-blue text-slate-900 font-bold' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-slate-900' : 'group-hover:scale-110 transition-transform'} />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-bold">Sair do Painel</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Pesquisar no painel..." 
                className="bg-slate-950 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-brand-blue/50 outline-none w-64 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-pink rounded-full border-2 border-slate-900"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-white uppercase leading-none">Creative Print</p>
                  <p className="text-[10px] text-brand-blue font-bold uppercase tracking-widest mt-1">Administrador</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-tr from-brand-blue to-brand-pink rounded-full p-0.5">
                   <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-black text-white">CP</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};
