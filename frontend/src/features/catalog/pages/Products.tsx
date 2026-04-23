import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product, UserRole } from '@/src/types';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import {
    Search, SlidersHorizontal, LayoutGrid, Bell, Heart, 
    Home as HomeIcon, ShoppingBag, User as UserIcon, Plus, ChevronRight
} from 'lucide-react';
import { useCart } from '../../cart/CartContext';

const CATEGORIES = [
    { id: 'Todos', label: 'All', icon: LayoutGrid },
    { id: 'Impressão 3D', label: 'Impressão 3D', icon: ShoppingBag },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', icon: Bell },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', icon: LayoutGrid },
];

export const Products: React.FC = () => {
    const { user, role } = useAuth();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const catParam = searchParams.get('cat') || 'Todos';
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());
    }, []);

    const handleCategoryChange = (cat: string) => {
        const p = new URLSearchParams();
        if (cat !== 'Todos') p.set('cat', cat);
        setSearchParams(p);
    };

    const filteredProducts = products.filter(p => {
        if (searchTerm) return p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return catParam === 'Todos' || p.category === catParam;
    });

    const getDashboardLink = () => {
        if (role === UserRole.ADMIN) return '/admin/dashboard';
        return '/customer/dashboard';
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-32 text-slate-900 font-sans">
            
            {/* APP HEADER */}
            <header className="px-6 pt-12 pb-6 flex items-center justify-between bg-transparent">
                <button className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-800 border border-slate-100">
                    <LayoutGrid size={20} />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Home</h1>
                <div className="flex items-center gap-3">
                    <button className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-800 border border-slate-100 relative">
                        <Bell size={20} />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <Link to={getDashboardLink()} className="w-12 h-12 rounded-xl overflow-hidden shadow-md border-2 border-white">
                        <img src={user?.avatar || "https://i.pravatar.cc/150?u=admin"} className="w-full h-full object-cover" alt="Profile" />
                    </Link>
                </div>
            </header>

            {/* SEARCH AREA */}
            <section className="px-6 py-4 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-slate-700 shadow-sm border border-slate-100 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                    />
                </div>
                <button className="w-14 h-14 bg-brand-blue text-white rounded-2xl shadow-lg shadow-brand-blue/30 flex items-center justify-center">
                    <SlidersHorizontal size={20} />
                </button>
            </section>

            {/* HERO PROMO BANNER */}
            <section className="px-6 py-6">
                <div className="w-full aspect-[16/8] bg-gradient-to-br from-[#00C2FF] to-[#0047FF] rounded-[32px] p-8 relative overflow-hidden shadow-xl shadow-brand-blue/20 group">
                    <div className="relative z-10 h-full flex flex-col justify-between items-start text-white">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black leading-none">20%<br/>OFF</h2>
                        </div>
                        <button className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 hover:scale-105 transition-transform">
                            Shop now <ChevronRight size={14} />
                        </button>
                    </div>
                    {/* Floating Product Image (Representational) */}
                    <img 
                        src={products[0]?.imageUrl} 
                        className="absolute right-[-20px] top-1/2 -translate-y-1/2 h-[120%] rotate-[-15deg] group-hover:rotate-0 transition-all duration-500 pointer-events-none drop-shadow-2xl" 
                        alt="Promo"
                    />
                    {/* Decorative Circles */}
                    <div className="absolute top-10 right-40 w-12 h-12 bg-white/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-5 right-20 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                </div>
                {/* Pagination Dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                    <div className="w-6 h-1.5 bg-slate-800 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                </div>
            </section>

            {/* CATEGORIES BAR */}
            <section className="px-6 py-4">
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl whitespace-nowrap transition-all shadow-sm border ${catParam === cat.id ? 'bg-white text-brand-blue border-brand-blue/20' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
                        >
                            <cat.icon size={18} className={catParam === cat.id ? 'text-brand-blue' : 'text-slate-400'} />
                            <span className="text-sm font-bold">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* POPULAR SECTION */}
            <section className="px-6 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-slate-800">Popular</h2>
                    <button className="text-sm font-bold text-slate-400 hover:text-brand-blue">View all</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map((p, i) => (
                        <div key={p.id} className="bg-white rounded-[32px] p-3 shadow-sm border border-slate-50 relative group overflow-hidden">
                            {/* Card Background Gradient based on index or product */}
                            <div className={`aspect-square rounded-[24px] mb-4 flex items-center justify-center p-4 relative overflow-hidden ${
                                i % 3 === 0 ? 'bg-gradient-to-br from-red-50 to-red-100' : 
                                i % 3 === 1 ? 'bg-gradient-to-br from-indigo-50 to-indigo-100' : 
                                'bg-gradient-to-br from-amber-50 to-amber-100'
                            }`}>
                                <button className="absolute top-3 right-3 text-white drop-shadow-md">
                                    <Heart size={20} className={i === 0 ? 'fill-red-500 text-red-500' : 'text-slate-200'} />
                                </button>
                                <img src={p.imageUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" alt={p.name} />
                            </div>
                            
                            <div className="px-1 pb-1">
                                <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{p.name}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-lg font-black text-slate-900">¥{p.price.toLocaleString()}</span>
                                    <button 
                                        onClick={() => addToCart({ ...p, cartId: `c-${Date.now()}`, quantity: 1 })}
                                        className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-brand-blue transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FLOATING BOTTOM NAV */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white flex items-center justify-around px-4 z-50">
                <button className="p-3 text-brand-blue"><HomeIcon size={24} strokeWidth={2.5} /></button>
                <button className="p-3 text-slate-300 hover:text-brand-blue transition-colors"><Heart size={24} /></button>
                <Link to="/cart" className="p-3 text-slate-300 hover:text-brand-blue transition-colors relative">
                    <ShoppingBag size={24} />
                </Link>
                <Link to={getDashboardLink()} className="p-3 text-slate-300 hover:text-brand-blue transition-colors"><UserIcon size={24} /></Link>
            </div>
        </div>
    );
};
// Trigger deploy #145
