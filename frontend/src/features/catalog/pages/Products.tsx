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
import { ProductSlider } from './components/ProductSlider';

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
        sliderTitle: 'Mais Vendidos em Impressão 3D',
        sliderSubtitle: 'Produtos Físicos Premium',
        sliderLabel: 'Ver todos os produtos 3D',
        subcategories: ['Chaveiros 3D', 'Displays / Suportes', 'Letreiros personalizados', 'Outros acessórios 3D'],
    },
    {
        id: 'Tecnologia NFC',
        label: 'Tecnologia NFC',
        icon: Cpu,
        color: 'brand-blue',
        emoji: '⚡',
        sliderTitle: 'Inovação com NFC',
        sliderSubtitle: 'Toque e Compartilhe',
        sliderLabel: 'Explorar linha NFC',
        subcategories: ['Chaveiros com NFC', 'Displays com NFC'],
    },
    {
        id: 'Sistemas',
        label: 'Soluções Digitais',
        icon: Monitor,
        color: 'brand-yellow',
        emoji: '🖥️',
        sliderTitle: 'Soluções Digitais (SaaS)',
        sliderSubtitle: 'Software & Plataformas',
        sliderLabel: 'Ver planos',
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
        // Scroll para a grid de produtos
        document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                HERO SECTION — Animação Starfield + Gradiente
            ============================================================ */}
            <section
                id="hero"
                className="relative min-h-[70vh] flex flex-col items-center justify-center pt-28 pb-20 px-4 overflow-hidden text-center"
            >
                {/* Stars */}
                <Starfield />

                {/* Luzes de fundo pulsantes */}
                <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-[#38b6ff] rounded-full blur-[150px] opacity-[0.12] animate-pulse-slow -z-10 pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#E5157A] rounded-full blur-[150px] opacity-[0.08] animate-pulse-slow -z-10 pointer-events-none" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/40 to-[#020617] -z-10" />

                {/* Conteúdo */}
                <div className="relative z-10 max-w-5xl mx-auto w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
                        <Sparkles size={13} />
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-blue" />
                        </span>
                        Tecnologia • NFC • 3D
                    </div>

                    {/* Título */}
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight animate-fade-in-up">
                        <span className="bg-gradient-to-r from-brand-blue via-blue-400 to-brand-pink bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(56,182,255,0.25)]">
                            Catálogo Oficial
                        </span>
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                        Impressão 3D personalizada, Tecnologia NFC e Sistemas digitais
                        para transformar o seu negócio.
                    </p>

                    {/* Botões de categoria rápidos */}
                    <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/60 border border-white/10 text-slate-300 hover:text-white hover:border-brand-blue/50 hover:bg-slate-700/60 transition-all text-sm font-semibold backdrop-blur-sm"
                                >
                                    <Icon size={15} />
                                    {cat.label}
                                    <ArrowRight size={13} className="opacity-60" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============================================================
                VITRINE POR CATEGORIA — Blocos A, B, C
                (visível apenas quando não há filtro ativo)
            ============================================================ */}
            {!isFiltering && (
                <div className="pb-8">
                    {CATEGORIES.map(cat => {
                        const catProducts = products.filter(p => p.category === cat.id);
                        const featured = catProducts.filter(p => p.isFeatured || p.isRecommended);
                        const displayProducts = featured.length > 0 ? featured : catProducts;
                        if (displayProducts.length === 0) return null;

                        return (
                            <div key={cat.id} className="mb-4">
                                <ProductSlider
                                    title={`${cat.emoji} ${cat.sliderTitle}`}
                                    subtitle={cat.sliderSubtitle}
                                    products={displayProducts}
                                    accentColor={
                                        cat.color === 'brand-pink' ? 'pink'
                                        : cat.color === 'brand-yellow' ? 'yellow'
                                        : 'blue'
                                    }
                                    onViewAll={() => handleCategoryChange(cat.id)}
                                    viewAllLabel={cat.sliderLabel}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ============================================================
                BARRA DE CATEGORIAS + BUSCA (Sticky)
            ============================================================ */}
            <div
                id="product-grid"
                className="sticky top-20 z-40 bg-[#020617]/95 backdrop-blur-md border-b border-white/5 shadow-2xl"
            >
                <div className="container mx-auto px-4 py-3">
                    {/* Categorias */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                        <button
                            onClick={() => handleCategoryChange('Todos')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap text-xs font-bold uppercase tracking-wide transition-all border flex-shrink-0 ${
                                catParam === 'Todos'
                                    ? 'bg-white text-slate-950 border-white shadow-lg'
                                    : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                            }`}
                        >
                            Todos
                        </button>

                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = catParam === cat.id;
                            const colorMap: Record<string, string> = {
                                'brand-blue': 'bg-brand-blue border-brand-blue text-white shadow-[0_0_15px_rgba(56,182,255,0.4)]',
                                'brand-pink': 'bg-brand-pink border-brand-pink text-white shadow-[0_0_15px_rgba(229,21,122,0.4)]',
                                'brand-yellow': 'bg-brand-yellow border-brand-yellow text-slate-950 shadow-[0_0_15px_rgba(255,242,0,0.3)]',
                            };
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap text-xs font-bold uppercase tracking-wide transition-all border flex-shrink-0 ${
                                        isActive
                                            ? colorMap[cat.color]
                                            : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                                    }`}
                                >
                                    <Icon size={13} />
                                    {cat.label}
                                </button>
                            );
                        })}

                        {/* Busca */}
                        <div className={`ml-auto flex-shrink-0 relative transition-all duration-300 ${isSearchFocused ? 'w-64' : 'w-48'}`}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                value={searchTerm}
                                onChange={e => handleSearch(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full bg-slate-900/60 text-white text-xs pl-9 pr-4 py-2.5 border border-white/10 rounded-xl focus:ring-1 focus:ring-brand-blue/50 focus:border-brand-blue/50 outline-none transition-all placeholder-slate-600"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => handleSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Subcategorias (visíveis só quando categoria ativa tem subcats) */}
                    {activeCategoryData && activeCategoryData.subcategories.length > 0 && (
                        <div className="flex gap-2 pt-2 overflow-x-auto scrollbar-hide">
                            {activeCategoryData.subcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(sub)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                                        subParam === sub
                                            ? 'bg-white/10 border-white/30 text-white'
                                            : 'border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/15'
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
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white">
                                {catParam !== 'Todos' ? activeCategoryData?.label || catParam : 'Resultados'}
                                {subParam && <span className="text-brand-blue ml-2">— {subParam}</span>}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'} encontrados
                            </p>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <X size={12} /> Limpar filtros
                        </button>
                    </div>
                )}

                {/* Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
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
    <div className="text-center py-32 w-full">
        <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center mx-auto mb-6">
            <Filter className="opacity-30 text-slate-400" size={36} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
        <p className="text-sm text-slate-500 mb-8">Tente ajustar seus filtros de busca ou categoria.</p>
        <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-brand-blue/90 transition-all shadow-[0_0_20px_rgba(56,182,255,0.3)]"
        >
            <X size={14} /> Ver todos os produtos
        </button>
    </div>
);
