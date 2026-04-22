import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product } from '@/src/types';
import {
    Search, X, Sparkles, Filter, ChevronDown,
    Printer, Cpu, Monitor, ArrowRight, Zap, Flame
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
        icon: Printer,
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
        // Scroll suave para a grade de produtos se não for 'Todos'
        if (cat !== 'Todos') {
            document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
        <div className="min-h-screen bg-[#020617]">
            {/* ============================================================
                HERO SECTION — Limpa (Título e Subtítulo)
            ============================================================ */}
            <section
                id="hero"
                className="relative min-h-[55vh] flex flex-col items-center justify-center pt-28 pb-10 px-4 overflow-hidden text-center animate-fade-in bg-[#020617]"
            >
                <Starfield />

                {/* Efeitos de Luz */}
                <div className="absolute -top-40 -left-40 w-[300px] h-[300px] bg-[#38b6ff] rounded-full blur-[100px] opacity-20 animate-pulse-slow -z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617] -z-10"></div>
                <div className="absolute top-[10%] left-[2%] w-[200px] h-[200px] bg-[#38b6ff]/5 rounded-full blur-[80px] -z-10"></div>

                <div className="relative z-10 max-w-5xl mx-auto w-full">
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight animate-fade-in-up">
                        <span className="bg-gradient-to-r from-[#38b6ff] to-[#E5157A] bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(56,182,255,0.3)]">
                            Conheça nossos produtos
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Encontre a solução digital perfeita para o seu negócio com tecnologia NFC e Impressão 3D.
                    </p>
                </div>
            </section>

            {/* ============================================================
                MENU DE CATEGORIAS + BUSCA (5 Colunas em Linha Única)
            ============================================================ */}
            <div
                id="product-grid"
                className="sticky top-20 z-40 bg-[#020617]/95 backdrop-blur-xl border-y border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
            >
                <div className="container mx-auto px-4 py-4">
                    {/* Grade de 5 Colunas (no Desktop) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <button
                            onClick={() => handleCategoryChange('Todos')}
                            className={`h-14 flex items-center justify-center px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                catParam === 'Todos'
                                    ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                    : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Todos os produtos
                        </button>

                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = catParam === cat.id;
                            const colorMap: Record<string, string> = {
                                'brand-blue': 'bg-brand-blue border-brand-blue text-slate-950 shadow-[0_0_20px_rgba(56,182,255,0.4)]',
                                'brand-pink': 'bg-brand-pink border-brand-pink text-white shadow-[0_0_20px_rgba(229,21,122,0.4)]',
                                'brand-yellow': 'bg-brand-yellow border-brand-yellow text-slate-950 shadow-[0_0_20px_rgba(255,242,0,0.4)]',
                            };
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`h-14 flex items-center justify-center gap-2 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                        isActive
                                            ? colorMap[cat.color]
                                            : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Icon size={14} />
                                    {cat.id === 'Sistemas' ? 'Soluções Digitais' : cat.label}
                                </button>
                            );
                        })}

                        {/* QUINTO "BOTÃO" — CAMPO DE PESQUISA ESTILIZADO */}
                        <div className={`relative h-14 transition-all duration-300 group`}>
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-brand-blue' : 'text-slate-500'}`} size={18} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={e => handleSearch(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className={`w-full h-full bg-slate-900/40 text-white text-[11px] pl-11 pr-10 border-2 rounded-2xl outline-none transition-all placeholder-slate-600 font-bold uppercase tracking-widest ${
                                    isSearchFocused || searchTerm
                                    ? 'border-brand-blue/50 bg-slate-900/60'
                                    : 'border-white/5 hover:border-white/20'
                                }`}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => handleSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white bg-slate-800 p-1 rounded-full transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Subcategorias */}
                    {activeCategoryData && activeCategoryData.subcategories.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-white/5 animate-fade-in">
                            {activeCategoryData.subcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(sub)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                                        subParam === sub
                                            ? 'bg-brand-blue/20 border-brand-blue text-brand-blue shadow-[0_0_15px_rgba(56,182,255,0.2)]'
                                            : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
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
            <div className="container mx-auto px-4 py-12 pb-24">
                {/* Header do resultado */}
                {isFiltering && (
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 border-l-4 border-brand-blue pl-6 py-2">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                                {catParam !== 'Todos' ? (catParam === 'Sistemas' ? 'Soluções Digitais' : activeCategoryData?.label || catParam) : 'Catálogo Completo'}
                                {subParam && <span className="text-brand-pink ml-3">/ {subParam}</span>}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'item disponível' : 'itens disponíveis'}
                            </p>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                        >
                            <X size={14} /> Limpar Filtros
                        </button>
                    </div>
                )}

                {/* Grid */}
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

// ============================================================
// EMPTY STATE
// ============================================================
const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-32 w-full animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-slate-800/30 border-2 border-white/5 flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Filter className="opacity-20 text-brand-blue" size={48} />
        </div>
        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Nenhum resultado</h3>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto">Não encontramos nada com esses filtros. Tente buscar por termos mais genéricos.</p>
        <button
            onClick={onReset}
            className="px-8 py-4 rounded-2xl bg-brand-blue text-slate-950 font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(56,182,255,0.4)]"
        >
            Ver catálogo completo
        </button>
    </div>
);
