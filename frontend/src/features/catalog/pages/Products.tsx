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
    LayoutGrid, ChevronRight, Cpu, Monitor, ExternalLink, ArrowUp
} from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { ProductCard } from './components/ProductCard';
import { Starfield } from '../../../components/ui/Starfield';
const CATEGORIES = [
    { id: 'Todos', label: 'Todos', short: 'Todos', img: '' },
    { id: 'Impressão 3D', label: 'Impressão 3D', short: 'IMPRESSÃO 3D', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop' },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', short: 'NFC', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop' },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', short: 'SOLUÇÕES', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop' }
];

export const Products: React.FC = () => {
    const { user, role } = useAuth();
    const { cart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [bannerConfig, setBannerConfig] = useState<any>(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const catParam = searchParams.get('cat') || 'Todos';
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());
        setBannerConfig(mockService.getStoreBanner());
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

            {/* UNIFIED RESULTS SECTION */}
            <section id="catalog-results" className="relative z-20 pb-32 px-4 overflow-hidden min-h-screen pt-24 md:pt-32">
                {/* REFERENCE NEBULA GLOW (Unified & Immersive) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 -left-[20%] w-[1000px] h-[1000px] bg-brand-blue/12 blur-[200px] rounded-full animate-pulse" style={{ animationDuration: '10s' }}></div>
                    <div className="absolute bottom-0 -right-[20%] w-[1000px] h-[1000px] bg-brand-blue/10 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '3s', animationDuration: '10s' }}></div>
                </div>

                <div className="container mx-auto relative z-10">
                    {/* TÍTULO DE IMPACTO (UI/UX SUGGESTION) */}
                    <div className="mb-12 text-center animate-fade-in-up">
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-3">
                            Exclusividade em <span className="text-brand-blue">Cada Detalhe</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] max-w-2xl mx-auto leading-relaxed">
                            Tecnologia NFC & Impressão 3D de Alta Precisão
                        </p>
                        <div className="w-[80%] max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-brand-blue to-transparent mx-auto mt-12 opacity-40"></div>
                    </div>

                    {/* CABEÇALHO DE NAVEGAÇÃO INSPIRADO NO LAYOUT CINEMÁTICO - AGORA NO TOPO */}
                    <div className="mb-16 text-center animate-fade-in">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            {/* CATEGORY PILLS (FILTROS PEQUENOS E DISCRETOS) */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                            catParam === cat.id 
                                            ? 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-[0_0_15px_rgba(56,182,255,0.3)]' 
                                            : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/30'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* BARRA DE BUSCA COM MAIOR DESTAQUE */}
                            <div className="relative group w-full md:w-80">
                                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue/60 group-focus-within:text-brand-blue transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="BUSCAR PRODUTO..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/10 border border-brand-blue/30 rounded-full py-3 pl-11 pr-4 text-[11px] font-black text-white/70 placeholder:text-white/30 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:bg-white/15 transition-all uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(56,182,255,0.15)] focus:shadow-[0_0_25px_rgba(56,182,255,0.4)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT GRID WITH INLINE BANNER */}
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map((product, index) => (
                                    <React.Fragment key={product.id}>
                                        <ProductCard product={product} />
                                        
                                        {/* UI/UX SPECIALIST: INLINE BANNER PLACEMENT (After 4 products) */}
                                        {index === 3 && filteredProducts.length > 4 && bannerConfig?.active && (
                                            <div className="col-span-full my-12 animate-fade-in-up">
                                                <div className="relative w-full h-[180px] md:h-[350px] rounded-3xl overflow-hidden group border border-white/5 shadow-2xl">
                                                    <img 
                                                        src={bannerConfig.imageUrl} 
                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" 
                                                        alt="Promoção Especial"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center p-8 md:p-20">
                                                        <div className="max-w-xl">
                                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-blue mb-4 block">{bannerConfig.tagline}</span>
                                                            <h3 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                                                                {bannerConfig.title} <br/> <span className="text-brand-blue">{bannerConfig.subtitle}</span>
                                                            </h3>
                                                            <p className="text-white/60 text-xs md:text-base font-medium max-w-sm hidden md:block">
                                                                {bannerConfig.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            
                            {/* BOTÃO VOLTAR AO TOPO */}
                            <div className="flex justify-center mt-20">
                                <button 
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all group"
                                >
                                    <span className="w-8 h-[1px] bg-white/10 group-hover:bg-brand-blue group-hover:w-12 transition-all"></span>
                                    Voltar ao Topo
                                    <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform text-brand-blue" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-40 text-center">
                            <div className="inline-block p-8 rounded-full bg-white/5 border border-white/10 mb-6">
                                <Search size={32} className="text-white/20" />
                            </div>
                            <p className="text-white/30 font-black uppercase tracking-[0.4em] text-sm">Nenhum produto disponível</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
// Trigger deploy #146
