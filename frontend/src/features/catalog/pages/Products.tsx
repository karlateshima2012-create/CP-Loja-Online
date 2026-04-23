import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product } from '@/src/types';
import {
    Search, X, Sparkles, Filter, ChevronDown,
    Box, Cpu, Monitor, ArrowRight, Zap, Flame, Layers, ArrowLeft,
    Truck, ShieldCheck, Clock, Award
} from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { Starfield } from '../../../components/ui/Starfield';

// ============================================================
// CATEGORIAS E SUBCATEGORIAS
// ============================================================
const CATEGORIES = [
    {
        id: 'Impressão 3D',
        label: 'Impressão 3D',
        icon: Box,
        color: 'brand-pink',
        emoji: '🔥',
        subcategories: ['Chaveiros 3D', 'Displays / Suportes', 'Letreiros personalizados', 'Outros acessórios 3D'],
    },
    {
        id: 'Tecnologia NFC',
        label: 'Tecnologia NFC',
        icon: Cpu,
        color: 'brand-blue',
        emoji: '⚡',
        subcategories: ['Chaveiros com NFC', 'Displays com NFC'],
    },
    {
        id: 'Soluções Digitais',
        label: 'Soluções Digitais',
        icon: Monitor,
        color: 'brand-yellow',
        emoji: '🖥️',
        subcategories: [],
    },
];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const catParam = searchParams.get('cat') || 'Todos';
    const subParam = searchParams.get('sub') || '';
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());
    }, []);

    // EFEITO DE SCROLL AUTOMÁTICO PARA O TOPO DA VITRINE
    useEffect(() => {
        const anchor = document.getElementById('product-grid-anchor');
        if (anchor && (catParam !== 'Todos' || subParam || searchTerm)) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [catParam, subParam, searchTerm]);

    const handleCategoryChange = (cat: string) => {
        const p = new URLSearchParams();
        if (cat !== 'Todos') p.set('cat', cat);
        setSearchTerm('');
        setIsSearchExpanded(false);
        setSearchParams(p);
    };

    const handleSubcategoryChange = (sub: string) => {
        const p = new URLSearchParams(searchParams);
        if (sub === subParam) {
            p.delete('sub');
        } else {
            p.set('sub', sub);
        }
        setSearchParams(p);
    };

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        const p = new URLSearchParams(searchParams);
        if (val) {
            p.set('q', val);
            p.delete('cat');
            p.delete('sub');
        } else {
            p.delete('q');
        }
        setSearchParams(p);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setIsSearchExpanded(false);
        setSearchParams(new URLSearchParams());
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = searchTerm
            ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
        const matchesCat = catParam === 'Todos' || p.category === catParam;
        const matchesSub = !subParam || (p as any).subcategory === subParam;
        return matchesSearch && matchesCat && matchesSub;
    });

    const activeCategoryData = CATEGORIES.find(c => c.id === catParam);
    const isFiltering = catParam !== 'Todos' || !!searchTerm || !!subParam;

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col">
            {/* HERO SECTION */}
            <section
                id="hero"
                className="relative min-h-[55vh] flex flex-col items-center justify-center pt-28 pb-10 px-4 overflow-hidden text-center animate-fade-in bg-[#020617]"
            >
                <Starfield />
                <div className="absolute -top-40 -left-40 w-[300px] h-[300px] bg-[#38b6ff] rounded-full blur-[100px] opacity-20 animate-pulse-slow -z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617] -z-10"></div>

                <div className="relative z-10 max-w-5xl mx-auto w-full">
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight animate-fade-in-up">
                        <span className="bg-gradient-to-r from-[#38b6ff] to-[#E5157A] bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(56,182,255,0.3)]">
                            Conheça nossos produtos
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto animate-fade-in-up">
                        Soluções digitais, NFC e Impressão 3D com tecnologia de ponta.
                    </p>
                </div>
            </section>

            {/* ============================================================
                DIVISOR UI/UX: VALUE BAR (Marquee de Diferenciais)
            ============================================================ */}
            <div className="bg-slate-900/50 border-y border-white/5 py-4 overflow-hidden relative">
                <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-12 items-center">
                    {[1, 2, 3].map((n) => (
                        <React.Fragment key={n}>
                            <div className="flex items-center gap-3 text-brand-blue/80 text-[10px] font-black uppercase tracking-widest">
                                <Truck size={14} /> Envio para todo Japão
                            </div>
                            <div className="flex items-center gap-3 text-brand-pink/80 text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck size={14} /> Tecnologia NFC 2.0
                            </div>
                            <div className="flex items-center gap-3 text-brand-yellow/80 text-[10px] font-black uppercase tracking-widest">
                                <Box size={14} /> Impressão 3D PLA+ Premium
                            </div>
                            <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                <Clock size={14} /> Suporte 24/7
                            </div>
                            <div className="flex items-center gap-3 text-brand-blue/80 text-[10px] font-black uppercase tracking-widest">
                                <Award size={14} /> Qualidade Garantida
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                {/* Linha Neon de separação final */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-brand-blue to-transparent blur-[1px]"></div>
            </div>

            <div id="product-grid-anchor" className="h-0" />

            {/* BARRA DE CATEGORIAS + BUSCA DINÂMICA */}
            <div
                className="sticky top-20 md:top-20 bottom-0 md:bottom-auto z-40 bg-[#020617]/98 backdrop-blur-2xl border-y border-brand-blue/30 shadow-[0_-15px_35px_rgba(0,0,0,0.9)] md:shadow-[0_15px_35px_rgba(0,0,0,0.9)] mt-auto md:mt-0 order-last md:order-none"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 via-transparent to-brand-blue/5 pointer-events-none"></div>
                
                <div className="container mx-auto px-3 py-4 md:py-5 relative z-10">
                    <div className="relative h-11 w-full">
                        {!isSearchExpanded ? (
                            <div className="grid grid-cols-5 gap-2.5 animate-fade-in w-full h-full">
                                <button
                                    onClick={() => handleCategoryChange('Todos')}
                                    className={`h-11 flex items-center justify-center px-1 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                        catParam === 'Todos'
                                            ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                            : 'bg-slate-900/50 border-white/10 text-white hover:border-brand-blue/40'
                                    }`}
                                >
                                    Todos
                                </button>

                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    const isActive = catParam === cat.id;
                                    const colorMap: Record<string, string> = {
                                        'brand-blue': 'bg-brand-blue border-brand-blue text-slate-950 shadow-[0_0_15px_rgba(56,182,255,0.4)]',
                                        'brand-pink': 'bg-brand-pink border-brand-pink text-white shadow-[0_0_15px_rgba(229,21,122,0.4)]',
                                        'brand-yellow': 'bg-brand-yellow border-brand-yellow text-slate-950 shadow-[0_0_15px_rgba(255,242,0,0.4)]',
                                    };
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={`h-11 flex flex-col md:flex-row items-center justify-center gap-1.5 px-1 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                                isActive
                                                    ? colorMap[cat.color]
                                                    : 'bg-slate-900/50 border-white/10 text-white hover:border-brand-blue/40'
                                            }`}
                                        >
                                            <Icon size={16} className="flex-shrink-0" />
                                            <span className="hidden md:inline">{cat.label}</span>
                                            <span className="md:hidden text-[9px] text-center">{cat.label.split(' ')[0]}</span>
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setIsSearchExpanded(true)}
                                    className="h-11 flex items-center justify-center bg-slate-900/60 border-2 border-brand-blue/20 text-white rounded-xl hover:border-brand-blue transition-all"
                                >
                                    <Search size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 animate-fade-in w-full h-full">
                                <button 
                                    onClick={() => {
                                        setIsSearchExpanded(false);
                                        if (!searchTerm) resetFilters();
                                    }}
                                    className="h-11 w-11 flex items-center justify-center bg-slate-900/80 text-white rounded-xl border-2 border-brand-blue/30 hover:border-brand-blue transition-all"
                                >
                                    <ArrowLeft size={22} />
                                </button>
                                <div className="relative flex-1 h-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue" size={18} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="O QUE VOCÊ PROCURA?"
                                        value={searchTerm}
                                        onChange={e => handleSearch(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        className="w-full h-full bg-slate-900/80 text-white text-sm pl-11 pr-11 border-2 border-brand-blue/40 rounded-xl outline-none focus:border-brand-blue shadow-[0_0_20px_rgba(56,182,255,0.2)] font-bold uppercase tracking-widest placeholder-slate-600"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => handleSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subcategorias */}
                    {!isSearchExpanded && activeCategoryData && activeCategoryData.subcategories.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 pt-5 border-t border-brand-blue/20 animate-fade-in relative">
                            <div className="absolute inset-0 bg-brand-blue/5 blur-xl pointer-events-none"></div>
                            {activeCategoryData.subcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(sub)}
                                    className={`px-4 py-2 rounded-xl text-[11px] md:text-sm font-black whitespace-nowrap border-2 transition-all relative z-10 ${
                                        subParam === sub
                                            ? 'bg-brand-blue/30 border-brand-blue text-white shadow-[0_0_15px_rgba(56,182,255,0.3)]'
                                            : 'bg-slate-900/60 border-white/10 text-white hover:border-brand-blue/30'
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* GRID DE PRODUTOS */}
            <div className="container mx-auto px-4 py-8 md:py-12 pb-24 flex-grow">
                {isFiltering && (
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 border-l-4 border-brand-blue pl-5 py-2">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                                {catParam !== 'Todos' ? activeCategoryData?.label || catParam : 'Todos os Produtos'}
                                {subParam && <span className="text-brand-pink ml-3">/ {subParam}</span>}
                            </h2>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-brand-blue/20 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-white/10"
                        >
                            <X size={14} /> Limpar Filtros
                        </button>
                    </div>
                )}

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState onReset={resetFilters} />
                )}
            </div>
        </div>
    );
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-24 w-full animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-slate-800/30 border-2 border-brand-blue/20 flex items-center justify-center mx-auto mb-8">
            <Filter className="opacity-20 text-brand-blue" size={40} />
        </div>
        <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Nenhum resultado</h3>
        <button
            onClick={onReset}
            className="px-8 py-4 rounded-2xl bg-brand-blue text-slate-950 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_25px_rgba(56,182,255,0.4)]"
        >
            Ver tudo
        </button>
    </div>
);
