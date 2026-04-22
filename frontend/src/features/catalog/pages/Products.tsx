import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product } from '@/src/types';
import {
    Search, X, Sparkles, Filter, ChevronDown,
    Box, Cpu, Monitor, ArrowRight, Zap, Flame, Layers
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
        icon: Box, // Ícone trocado para representar 3D (objeto/caixa)
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

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());
    }, []);

    const handleCategoryChange = (cat: string) => {
        const p = new URLSearchParams();
        if (cat !== 'Todos') p.set('cat', cat);
        setSearchTerm('');
        setSearchParams(p);
        document.getElementById('product-grid-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        setSearchParams(new URLSearchParams());
    };

    // ---- Filtragem ----
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
            {/* ============================================================
                HERO SECTION
            ============================================================ */}
            <section
                id="hero"
                className="relative min-h-[50vh] flex flex-col items-center justify-center pt-28 pb-10 px-4 overflow-hidden text-center animate-fade-in bg-[#020617]"
            >
                <Starfield />
                <div className="absolute -top-40 -left-40 w-[300px] h-[300px] bg-[#38b6ff] rounded-full blur-[100px] opacity-20 animate-pulse-slow -z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617] -z-10"></div>

                <div className="relative z-10 max-w-5xl mx-auto w-full">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight animate-fade-in-up">
                        <span className="bg-gradient-to-r from-[#38b6ff] to-[#E5157A] bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(56,182,255,0.3)]">
                            Conheça nossos produtos
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-6 animate-fade-in-up">
                        Soluções digitais, NFC e Impressão 3D com tecnologia de ponta.
                    </p>
                </div>
            </section>

            <div id="product-grid-anchor" className="h-0" />

            {/* ============================================================
                BARRA DE CATEGORIAS + BUSCA
                (Sticky Top no Desktop, Sticky Bottom no Mobile)
            ============================================================ */}
            <div
                className="sticky top-20 md:top-20 bottom-0 md:bottom-auto z-40 bg-[#020617]/95 backdrop-blur-xl border-y border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] md:shadow-[0_10px_40px_rgba(0,0,0,0.8)] mt-auto md:mt-0 order-last md:order-none"
            >
                <div className="container mx-auto px-2 py-3 md:py-4">
                    <div className="grid grid-cols-5 gap-2">
                        {/* 1. TODOS OS PRODUTOS */}
                        <button
                            onClick={() => handleCategoryChange('Todos')}
                            className={`h-11 flex items-center justify-center px-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest transition-all border ${
                                catParam === 'Todos'
                                    ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-transparent border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            <span className="text-center">Todos os produtos</span>
                        </button>

                        {/* 2-4. CATEGORIAS */}
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
                                    className={`h-11 flex flex-col md:flex-row items-center justify-center gap-1 px-1 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest transition-all border ${
                                        isActive
                                            ? colorMap[cat.color]
                                            : 'bg-transparent border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                                    }`}
                                >
                                    <Icon size={14} className="flex-shrink-0" />
                                    <span className="hidden md:inline">{cat.label}</span>
                                    <span className="md:hidden text-[8px] text-center">{cat.label.split(' ')[0]}</span>
                                </button>
                            );
                        })}

                        {/* 5. BUSCA */}
                        <div className="relative h-11 group">
                            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-brand-blue' : 'text-slate-500'}`} size={14} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={e => handleSearch(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className={`w-full h-full bg-slate-900/40 text-white text-[10px] pl-8 pr-2 border rounded-xl outline-none transition-all placeholder-slate-600 font-bold uppercase tracking-widest ${
                                    isSearchFocused || searchTerm
                                    ? 'border-brand-blue/50 bg-slate-900/60'
                                    : 'border-white/5'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Subcategorias */}
                    {activeCategoryData && activeCategoryData.subcategories.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-white/5 animate-fade-in">
                            {activeCategoryData.subcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(sub)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold whitespace-nowrap border transition-all ${
                                        subParam === sub
                                            ? 'bg-brand-blue/20 border-brand-blue text-brand-blue'
                                            : 'bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ============================================================
                GRID DE PRODUTOS
            ============================================================ */}
            <div className="container mx-auto px-4 py-8 md:py-12 pb-24 flex-grow">
                {isFiltering && (
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-l-4 border-brand-blue pl-4 py-1">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                                {catParam !== 'Todos' ? activeCategoryData?.label || catParam : 'Todos os Produtos'}
                                {subParam && <span className="text-brand-pink ml-2">/ {subParam}</span>}
                            </h2>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                        >
                            <X size={12} /> Limpar
                        </button>
                    </div>
                )}

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
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
    <div className="text-center py-20 w-full animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/30 border border-white/5 flex items-center justify-center mx-auto mb-6">
            <Filter className="opacity-20 text-brand-blue" size={32} />
        </div>
        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Nenhum resultado</h3>
        <button
            onClick={onReset}
            className="px-6 py-3 rounded-xl bg-brand-blue text-slate-950 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
        >
            Ver tudo
        </button>
    </div>
);
