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
                {/* THEMATIC BANNER (Father's Day) - Responsive Height */}
                <div className="w-full h-[250px] md:h-[450px] bg-slate-900 relative overflow-hidden group">
                    <img 
                        src="https://midias.creativeprintjp.com/wp-content/uploads/2026/04/Preto-Azul-e-Branco-Moderno-Mes-dos-Pais-Banner.png" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                        alt="Especial Mês dos Pais"
                    />
                </div>
            </section>

            {/* UNIFIED RESULTS SECTION */}
            <section id="catalog-results" className="relative z-20 pb-32 px-6 overflow-hidden min-h-screen">
                {/* REFERENCE NEBULA GLOW (Unified & Immersive) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 -left-[20%] w-[1000px] h-[1000px] bg-brand-blue/12 blur-[200px] rounded-full animate-pulse" style={{ animationDuration: '10s' }}></div>
                    <div className="absolute bottom-0 -right-[20%] w-[1000px] h-[1000px] bg-brand-blue/10 blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '3s', animationDuration: '10s' }}></div>
                </div>

                <div className="container mx-auto relative z-10 pt-20">
                    {/* MINIMALIST HEADER */}
                    <div className="flex flex-col items-center mb-16 animate-fade-in">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white text-center leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                            Creative Print
                        </h2>
                        <div className="w-16 h-1 bg-brand-blue rounded-full mt-6 opacity-80 shadow-[0_0_10px_rgba(56,182,255,0.5)]"></div>
                    </div>

                    {/* THREE MAIN CATEGORY CARDS (Replacing Marquee & Dock) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 animate-fade-in">
                        {CATEGORIES.filter(c => c.id !== 'Todos').map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`group relative h-48 md:h-80 rounded-[2.5rem] overflow-hidden border transition-all duration-700 ${catParam === cat.id ? 'border-brand-blue ring-4 ring-brand-blue/20 scale-[1.03]' : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'}`}
                            >
                                <div className={`absolute inset-0 z-10 transition-colors duration-700 ${catParam === cat.id ? 'bg-brand-blue/20' : 'bg-black/50 group-hover:bg-black/30'}`}></div>
                                <img src={cat.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={cat.label} />
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 transition-colors ${catParam === cat.id ? 'text-white' : 'text-brand-blue'}`}>Explorar</span>
                                    <h3 className="text-xl md:text-3xl font-black uppercase tracking-[0.15em] text-white drop-shadow-lg">
                                        {cat.label}
                                    </h3>
                                    <div className={`w-10 h-1 bg-white rounded-full mt-4 transition-all duration-500 ${catParam === cat.id ? 'opacity-100 w-16' : 'opacity-0'}`}></div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* ACTIVE CATEGORY INDICATOR */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-[2px] w-8 bg-brand-blue shadow-[0_0_10px_rgba(56,182,255,0.5)]"></div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-blue">
                            {catParam === 'Todos' ? 'Catálogo Completo' : catParam}
                        </span>
                        {catParam !== 'Todos' && (
                            <button 
                                onClick={() => handleCategoryChange('Todos')}
                                className="ml-auto text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all flex items-center gap-2 group"
                            >
                                <span className="group-hover:mr-1 transition-all">Ver Tudo</span>
                                <div className="w-4 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-6 transition-all"></div>
                            </button>
                        )}
                    </div>

                    {/* PRODUCT GRID */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-12">
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
