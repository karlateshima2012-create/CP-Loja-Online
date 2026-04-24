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
    { id: 'Todos', label: 'Todos', short: 'Todos', img: '' },
    { id: 'Impressão 3D', label: 'Impressão 3D', short: 'IMPRESSÃO 3D', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop' },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', short: 'NFC', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop' },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', short: 'SOLUÇÕES', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop' }
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
                {/* THEMATIC BANNER (Father's Day) - Responsive Scaling */}
                <div className="w-full h-[180px] sm:h-[250px] md:h-[450px] lg:h-[500px] bg-slate-900 relative overflow-hidden group">
                    <img 
                        src="https://midias.creativeprintjp.com/wp-content/uploads/2026/04/Preto-Azul-e-Branco-Moderno-Mes-dos-Pais-Banner.png" 
                        className="absolute inset-0 w-full h-full object-cover md:object-center group-hover:scale-105 transition-transform duration-[10s]" 
                        alt="Especial Mês dos Pais"
                    />
                </div>
            </section>

            {/* UNIFIED RESULTS SECTION */}
            <section id="catalog-results" className="relative z-20 pb-32 px-4 overflow-hidden min-h-screen">
                {/* REFERENCE NEBULA GLOW (Unified & Immersive) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 -left-[20%] w-[1000px] h-[1000px] bg-brand-blue/12 blur-[200px] rounded-full animate-pulse" style={{ animationDuration: '10s' }}></div>
                    <div className="absolute bottom-0 -right-[20%] w-[1000px] h-[1000px] bg-brand-blue/10 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '3s', animationDuration: '10s' }}></div>
                </div>

                <div className="container mx-auto relative z-10 pt-10">
                    {/* CABEÇALHO DE NAVEGAÇÃO INSPIRADO NO LAYOUT CINEMÁTICO */}
                    <div className="mb-16 text-center animate-fade-in">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">
                            Conheça nossos produtos
                        </h2>
                        
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
                                            : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* BARRA DE BUSCA DISCRETA */}
                            <div className="relative group w-full md:w-64">
                                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-blue transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="BUSCAR PRODUTO..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-[10px] font-black text-white placeholder:text-white/20 focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all uppercase tracking-widest"
                                />
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT GRID */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
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
// Trigger deploy #145
