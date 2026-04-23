import React, { useState, useEffect } from 'react';
const SUBCATEGORIES = [
    { id: 'Chaveiros NFC', label: 'Chaveiros com NFC', img: 'https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?q=80&w=800&auto=format&fit=crop' },
    { id: 'Displays NFC', label: 'Displays com NFC', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop' },
    { id: 'Chaveiros 3D', label: 'Chaveiros 3D', img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=800&auto=format&fit=crop' },
    { id: 'Displays', label: 'Displays', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop' },
    { id: 'Letreiros', label: 'Letreiros Personalizados', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop' }
];
import { useSearchParams, Link } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product, UserRole } from '@/src/types';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import {
    Search, LayoutGrid, ShoppingBag, User as UserIcon, 
    ChevronRight, Box, Cpu, Monitor, ExternalLink
} from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { ProductCard } from './components/ProductCard';
import { Starfield } from '../../../components/ui/Starfield';

const CATEGORIES = [
    { id: 'Todos', label: 'Todos', icon: LayoutGrid },
    { id: 'Impressão 3D', label: 'Impressão 3D', icon: Box },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', icon: Cpu },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', icon: Monitor },
];

export const Products: React.FC = () => {
    const { user, role } = useAuth();
    const { cart } = useCart();
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
        <div className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-brand-blue/30">
            <Starfield />
            
            {/* STRATEGIC LIGHT POINTS (More Subtle) */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[180px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-pink/3 rounded-full blur-[180px] pointer-events-none z-0"></div>

            {/* CATEGORY NAV - GLASSMORPHIC TAB BAR (Option 3) */}
            <nav className="sticky top-16 z-40 py-4 px-6 animate-fade-in">
                <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 pr-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    
                    {/* Tabs Area (Clean) */}
                    <div className="flex items-center gap-1 overflow-x-auto p-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                        <div className="flex items-center gap-1 no-scrollbar">
                            {CATEGORIES.map(cat => (
                            <button 
                                key={cat.id} 
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`px-6 py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${catParam === cat.id ? 'bg-brand-blue text-slate-950 shadow-[0_0_20px_rgba(56,182,255,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Integrated Search */}
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="flex items-center bg-black/40 border border-white/5 rounded-full px-5 py-2.5 focus-within:border-brand-blue/30 transition-all w-full lg:w-72">
                            <Search size={16} className="text-slate-500" />
                            <input 
                                className="bg-transparent border-none text-[11px] text-white outline-none pl-3 w-full font-bold placeholder:text-slate-700 uppercase tracking-widest" 
                                placeholder="Procurar no catálogo..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* MAIN BANNER (Full Width) */}
            <section className="w-full relative z-10">
                <div className="w-full aspect-[16/10] md:aspect-[2.8/1] bg-slate-900 border-y border-white/5 overflow-hidden relative group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1635332309325-189f7f45b546?q=80&w=2500&auto=format&fit=crop" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                        alt="Banner"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
                        <span className="text-brand-blue font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 animate-fade-in">Novidades 2026</span>
                        <h2 className="text-3xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                            Tecnologia de Ponta<br/>
                            <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">para sua Empresa.</span>
                        </h2>
                    </div>
                </div>
            </section>

            {/* SUBCATEGORY INFINITE MARQUEE */}
            <section className="w-full overflow-hidden py-8 relative z-10 group">
                <style>{`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(calc(-220px * 5 - 1rem * 5)); }
                    }
                    @media (min-width: 768px) {
                        @keyframes scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(calc(-300px * 5 - 1rem * 5)); }
                        }
                    }
                    .animate-scroll {
                        animation: scroll 35s linear infinite;
                    }
                    .animate-scroll:hover {
                        animation-play-state: paused;
                    }
                `}</style>
                
                <div className="flex gap-4 animate-scroll whitespace-nowrap w-fit">
                    {/* Render twice for infinite loop effect */}
                    {[...SUBCATEGORIES, ...SUBCATEGORIES].map((cat, idx) => (
                        <button 
                            key={`${cat.id}-${idx}`}
                            onClick={() => handleCategoryChange(cat.id)}
                            className="w-[220px] md:w-[300px] h-32 md:h-40 bg-slate-900 rounded-2xl border border-white/10 relative overflow-hidden flex-shrink-0 group/card transition-all hover:border-brand-blue/50"
                        >
                            <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/20 z-10 transition-colors"></div>
                            <img src={cat.img} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/card:scale-110 transition-transform duration-1000" alt={cat.label} />
                            <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
                                <span className="text-sm md:text-base font-black uppercase tracking-widest text-white text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                    {cat.label}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* PRODUCT GRID - DEEP LAYER CONTRAST (More Compact) */}
            <section className="relative z-20 mt-8">
                {/* STRATEGIC LIGHT POINT BEHIND TRAY */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-brand-blue/20 blur-[100px] -z-10"></div>
                
                {/* The 'Tray' Layer */}
                <div className="bg-slate-900/60 backdrop-blur-3xl rounded-t-[4rem] border-t-2 border-white/10 shadow-[0_-30px_80px_rgba(0,0,0,0.9)] pt-16 pb-32 px-6">
                    <div className="container mx-auto">
                        <div className="flex flex-col items-center text-center mb-16 animate-fade-in">
                            <div className="w-12 h-1 bg-brand-blue rounded-full mb-6 opacity-50"></div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                                Coleção <span className="text-brand-blue">Exclusiva</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                                [ {filteredProducts.length} itens ]
                            </p>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                                {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-slate-950/50 rounded-3xl border border-white/5">
                                <p className="text-slate-500 font-bold">Nenhum produto encontrado para "{searchTerm}"</p>
                                <button onClick={() => {setSearchTerm(''); handleCategoryChange('Todos');}} className="mt-4 text-brand-blue text-xs font-black uppercase tracking-widest border-b border-brand-blue/30 pb-1">Ver Tudo</button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* FOOTER AREA (Simple for now) */}
            <footer className="bg-black py-12 border-t border-white/5 relative z-10">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Box className="text-brand-blue" size={24} />
                        <span className="text-lg font-black uppercase tracking-tighter">Creative<span className="text-brand-blue">Print</span></span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Sobre Nós</a>
                        <a href="#" className="hover:text-white transition-colors">Termos</a>
                        <a href="#" className="hover:text-white transition-colors">Contato</a>
                    </div>
                    <span className="text-[10px] text-slate-700 font-mono">© 2026 CREATIVE PRINT JP</span>
                </div>
            </footer>
        </div>
    );
};
// Trigger deploy #145
