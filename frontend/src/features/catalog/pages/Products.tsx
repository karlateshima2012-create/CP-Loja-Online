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
    Search, ShoppingCart, Box, X,
    LayoutGrid, ChevronRight, Cpu, Monitor, ExternalLink
} from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { ProductCard } from './components/ProductCard';
import { Starfield } from '../../../components/ui/Starfield';
import './Products.css';

const CATEGORIES = [
    { id: 'Todos', label: 'Todos', short: 'Todos' },
    { id: 'Impressão 3D', label: 'Impressão 3D', short: '3D' },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', short: 'NFC' },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', short: 'Soluções' }
];

export const Products: React.FC = () => {
    const { user, role } = useAuth();
    const { cart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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

            {/* IMMERSIVE HERO SECTION (Banner + Floating Dock) */}
            <section className="relative w-full overflow-hidden">
                {/* Main Banner Image */}
                <div className="w-full h-[60vh] md:h-[70vh] bg-slate-900 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2500&auto=format&fit=crop" 
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" 
                        alt="Creative Print Store Banner"
                    />
                    
                    {/* Floating Content Over Banner */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center">
                        {/* CATEGORY NAV - COMPACT MOBILE VERSION */}
                        <nav className="w-full py-8 px-4 md:px-6 animate-fade-in-down">
                            <div className={`container mx-auto flex items-center justify-between transition-all duration-500 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-full p-1.5 shadow-2xl ${isSearchExpanded ? 'lg:pr-6' : 'pr-4 lg:pr-6'}`}>
                                
                                {!isSearchExpanded && (
                                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                                        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                                        {CATEGORIES.map(cat => (
                                            <button 
                                                key={cat.id} 
                                                onClick={() => handleCategoryChange(cat.id)}
                                                className={`px-3 md:px-6 py-2.5 md:py-3 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${catParam === cat.id ? 'bg-brand-blue text-slate-950 shadow-[0_0_15px_rgba(56,182,255,0.4)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                            >
                                                <span className="md:hidden">{cat.short}</span>
                                                <span className="hidden md:inline">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className={`flex items-center gap-2 ${isSearchExpanded ? 'w-full' : 'w-auto'}`}>
                                    {isSearchExpanded ? (
                                        <div className="flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-2 w-full animate-fade-in">
                                            <Search size={14} className="text-brand-blue" />
                                            <input 
                                                autoFocus
                                                className="bg-transparent border-none text-[10px] md:text-[11px] text-white outline-none pl-3 w-full font-bold placeholder:text-white/20 uppercase tracking-widest" 
                                                placeholder="Buscar..." 
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                onBlur={() => !searchTerm && setIsSearchExpanded(false)}
                                            />
                                            <button onClick={() => {setSearchTerm(''); setIsSearchExpanded(false);}} className="text-white/40 hover:text-white"><X size={14}/></button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setIsSearchExpanded(true)}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-brand-blue transition-all border border-white/5"
                                        >
                                            <Search size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </nav>

                        {/* Banner Text */}
                        <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
                            <span className="text-brand-blue font-black uppercase tracking-[0.5em] text-xs mb-6 animate-fade-in">Inovação & Design</span>
                            <h2 className="text-4xl md:text-7xl font-black text-white leading-none uppercase tracking-tighter max-w-4xl">
                                Tecnologia de <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">Ponta</span><br/>
                                <span className="text-brand-blue drop-shadow-[0_0_15px_rgba(56,182,255,0.5)]">Para sua Empresa.</span>
                            </h2>
                        </div>
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

        </div>
    );
};
// Trigger deploy #145
