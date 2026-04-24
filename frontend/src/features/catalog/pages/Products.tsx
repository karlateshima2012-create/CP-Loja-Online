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
const CATEGORIES = [
    { id: 'Todos', label: 'Todos', short: 'Todos' },
    { id: 'Impressão 3D', label: 'Impressão 3D', short: 'IMPRESSÃO 3D' },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', short: 'NFC' },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', short: 'SOLUÇÕES' }
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

    const scrollToResults = () => {
        const resultsSection = document.getElementById('catalog-results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Auto-scroll to results when searching
    useEffect(() => {
        if (searchTerm.length > 0) {
            scrollToResults();
        }
    }, [searchTerm]);

    // Auto-scroll when category changes via URL (Navbar)
    useEffect(() => {
        if (catParam !== 'Todos') {
            scrollToResults();
        }
    }, [catParam]);

    const handleCategoryChange = (cat: string) => {
        const p = new URLSearchParams();
        if (cat !== 'Todos') p.set('cat', cat);
        setSearchParams(p);
        scrollToResults();
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
                {/* THEMATIC BANNER (Father's Day) - Responsive Height */}
                <div className="w-full h-[250px] md:h-[450px] bg-slate-900 relative overflow-hidden group">
                    <img 
                        src="https://midias.creativeprintjp.com/wp-content/uploads/2026/04/Preto-Azul-e-Branco-Moderno-Mes-dos-Pais-Banner.png" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                        alt="Especial Mês dos Pais"
                    />
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
                                    className="w-[180px] md:w-[280px] h-32 md:h-40 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 relative overflow-hidden flex-shrink-0 group/card transition-all hover:border-brand-blue/50 shadow-xl"
                                >
                                    <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/5 z-10 transition-colors"></div>
                                    <img src={cat.img} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover/card:scale-110 transition-transform duration-1000" alt={cat.label} />
                                    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white text-center drop-shadow-[0_2px_15px_rgba(0,0,0,1)] leading-tight">
                                            {cat.label}
                                        </span>
                                    </div>
                                </button>
                    ))}
                </div>
            </section>

            {/* PRODUCT GRID - ILLUMINATED LAYER */}
            <section id="catalog-results" className="relative z-20 mt-8 overflow-hidden">
                {/* The 'Tray' Layer (Lightened) */}
                <div className="bg-slate-900/60 backdrop-blur-3xl rounded-t-[4rem] border-t-2 border-white/20 shadow-[0_-30px_80px_rgba(0,0,0,0.8)] pt-12 pb-32 px-6 relative overflow-hidden">
                    
                    {/* HIGH-POWER WAVE-FLOW DYNAMIC LIGHTS */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <style>{`
                            @keyframes wave-flow-intense {
                                0%, 100% { transform: scale(1); opacity: 0.3; filter: blur(100px); }
                                50% { transform: scale(1.6); opacity: 0.7; filter: blur(140px); }
                            }
                            .animate-wave-intense {
                                animation: wave-flow-intense 6s ease-in-out infinite;
                            }
                        `}</style>
                        
                        {/* Top Left */}
                        <div className="absolute -top-20 -left-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-cyan-400/60 blur-[120px] rounded-full animate-wave-intense"></div>
                        
                        {/* Top Right */}
                        <div className="absolute -top-20 -right-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-blue/50 blur-[120px] rounded-full animate-wave-intense" style={{ animationDelay: '1.5s' }}></div>
                        
                        {/* Central Sun (Maximum Intensity) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-cyan-300/40 blur-[160px] rounded-full animate-wave-intense" style={{ animationDelay: '3s' }}></div>
                        
                        {/* Bottom Left */}
                        <div className="absolute -bottom-20 -left-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-blue/50 blur-[120px] rounded-full animate-wave-intense" style={{ animationDelay: '4.5s' }}></div>
                        
                        {/* Bottom Right */}
                        <div className="absolute -bottom-20 -right-20 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-cyan-400/60 blur-[120px] rounded-full animate-wave-intense" style={{ animationDelay: '0.8s' }}></div>
                    </div>
                    <div className="container mx-auto">
                        
                        {/* SHOWROOM SECTION HEADER */}
                        <div className="flex flex-col items-center mb-12 animate-fade-in relative">
                            {/* Premium Badge */}
                            <div className="bg-brand-blue/10 border border-brand-blue/30 px-4 h-6 rounded-full mb-6 shadow-[0_0_15px_rgba(56,182,255,0.3)] flex items-center justify-center">
                                <span className="text-brand-blue text-[9px] font-black uppercase tracking-[0.3em] leading-none">Exclusivo</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white text-center leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                Creative Print
                            </h2>
                            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent rounded-full mt-6 opacity-80 shadow-[0_0_10px_rgba(56,182,255,0.5)]"></div>
                        </div>

                        {/* DOCK - Narrower Version */}
                        <nav className="sticky top-20 z-40 py-2 mb-10 animate-fade-in">
                            <div className={`flex items-center justify-between transition-all duration-500 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-full p-1 shadow-2xl ${isSearchExpanded ? 'pr-6' : 'pr-4'}`}>
                                
                                {!isSearchExpanded && (
                                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                                        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                                        {CATEGORIES.map(cat => (
                                            <button 
                                                key={cat.id} 
                                                onClick={() => handleCategoryChange(cat.id)}
                                                className={`px-3 md:px-8 py-2.5 md:py-4 rounded-full text-[9px] md:text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${catParam === cat.id ? 'bg-brand-blue text-slate-950 shadow-[0_0_15px_rgba(56,182,255,0.4)]' : 'text-white/80 hover:text-white hover:bg-white/5'}`}
                                            >
                                                <span className="md:hidden">{cat.short}</span>
                                                <span className="hidden md:inline">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className={`flex items-center gap-2 ${isSearchExpanded ? 'w-full' : 'w-auto'}`}>
                                    {isSearchExpanded ? (
                                        <div className="flex items-center bg-black/60 border border-white/20 rounded-full px-5 py-2.5 w-full animate-fade-in shadow-2xl">
                                            <Search size={14} className="text-brand-blue" />
                                            <input 
                                                autoFocus
                                                className="bg-transparent border-none text-[10px] md:text-xs text-white outline-none pl-3 w-full font-black placeholder:text-white/40 uppercase tracking-widest" 
                                                placeholder="BUSCAR PRODUTOS..." 
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                onBlur={() => !searchTerm && setIsSearchExpanded(false)}
                                            />
                                            <button onClick={() => {setSearchTerm(''); setIsSearchExpanded(false);}} className="text-white/60 hover:text-white"><X size={16}/></button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setIsSearchExpanded(true)}
                                            className="p-3.5 bg-brand-blue/10 hover:bg-brand-blue/20 rounded-full text-brand-blue transition-all border border-brand-blue/30"
                                        >
                                            <Search size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </nav>

                        {/* ACTIVE CATEGORY INDICATOR */}
                        <div className="flex items-center gap-3 mb-6 animate-fade-in">
                            <div className="h-[2px] w-4 bg-brand-blue"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-blue">
                                {catParam === 'Todos' ? 'Nossos Produtos' : catParam}
                            </span>
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
