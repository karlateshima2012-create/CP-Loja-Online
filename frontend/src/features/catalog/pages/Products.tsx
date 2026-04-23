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
// CATEGORIAS
// ============================================================
const CATEGORIES = [
    { id: 'Impressão 3D', label: 'Impressão 3D', icon: Box, color: 'brand-pink' },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', icon: Cpu, color: 'brand-blue' },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', icon: Monitor, color: 'brand-yellow' },
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
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());

        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - 250;
            setIsVisible(scrollPosition < threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const galleryImages = products.map(p => p.imageUrl);

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col overflow-x-hidden">
            
            {/* HERO SECTION */}
            <section
                id="hero"
                className="relative min-h-[75vh] flex items-center justify-center pt-24 pb-12 px-6 md:px-12 overflow-hidden bg-[#020617]"
            >
                <Starfield />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="text-left animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                            A melhor<br/>
                            <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
                                experiência digital
                            </span><br/>
                            para o seu negócio.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-lg leading-relaxed">
                            NFC, Impressão 3D e Sistemas SaaS integrados em uma solução única e inovadora.
                        </p>
                    </div>

                    {/* GALERIA CACHOEIRA */}
                    <div className="hidden md:block relative h-[500px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
                        <div className="grid grid-cols-3 gap-4 h-full">
                            <div className="flex flex-col gap-4 animate-[marquee-vertical_40s_linear_infinite]">
                                {[...galleryImages, ...galleryImages].map((img, i) => (
                                    <div key={i} className="aspect-[4/5] bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
                                        <img src={img} className="w-full h-full object-cover opacity-40 hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4 animate-[marquee-vertical-reverse_50s_linear_infinite] mt-[-50px]">
                                {[...galleryImages, ...galleryImages].map((img, i) => (
                                    <div key={i} className="aspect-[4/5] bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
                                        <img src={img} className="w-full h-full object-cover opacity-40 hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4 animate-[marquee-vertical_60s_linear_infinite] mt-10">
                                {[...galleryImages, ...galleryImages].map((img, i) => (
                                    <div key={i} className="aspect-[4/5] bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
                                        <img src={img} className="w-full h-full object-cover opacity-40 hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div id="product-grid-anchor" className="h-0" />

            {/* ============================================================
                DOCK MENU FULL WIDTH (Vibrante e Magnificado)
            ============================================================ */}
            <div
                className={`fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:w-full z-50 md:z-40 bg-[#03081a]/98 backdrop-blur-3xl border-t border-brand-blue/60 md:border-x-0 md:border-y shadow-[0_-20px_60px_rgba(0,0,0,0.9)] md:shadow-none rounded-t-[2.5rem] md:rounded-none transition-all duration-500 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                }`}
            >
                {/* Efeito Glow Azul Pulsante no Fundo do Dock */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/10 via-transparent to-brand-blue/5 pointer-events-none rounded-t-[2.5rem] md:rounded-none"></div>
                
                <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
                    <div className="flex flex-col gap-5 max-w-5xl mx-auto">
                        
                        {/* Linha 1: Botões de Categoria (Maiores) */}
                        <div className="grid grid-cols-5 gap-3 w-full">
                            <button
                                onClick={() => handleCategoryChange('Todos')}
                                className={`h-14 flex items-center justify-center rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.15em] transition-all border-2 ${
                                    catParam === 'Todos'
                                        ? 'bg-white text-slate-950 border-white shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-105'
                                        : 'bg-slate-900/60 border-white/10 text-white/80 hover:border-brand-blue/60 hover:text-white'
                                }`}
                            >
                                Todos
                            </button>

                            {CATEGORIES.map(cat => {
                                const isActive = catParam === cat.id;
                                const colorMap: Record<string, string> = {
                                    'brand-blue': 'bg-brand-blue border-brand-blue text-slate-950 shadow-[0_0_20px_rgba(56,182,255,0.5)] scale-105',
                                    'brand-pink': 'bg-brand-pink border-brand-pink text-white shadow-[0_0_20px_rgba(229,21,122,0.5)] scale-105',
                                    'brand-yellow': 'bg-brand-yellow border-brand-yellow text-slate-950 shadow-[0_0_20px_rgba(255,242,0,0.5)] scale-105',
                                };
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`h-14 flex flex-col md:flex-row items-center justify-center gap-1.5 rounded-2xl text-[9px] md:text-xs font-black uppercase tracking-[0.1em] transition-all border-2 ${
                                            isActive
                                                ? colorMap[cat.color]
                                                : 'bg-slate-900/60 border-white/10 text-white/80 hover:border-brand-blue/60 hover:text-white'
                                        }`}
                                    >
                                        <cat.icon size={20} className="flex-shrink-0" />
                                        <span className="hidden md:inline">{cat.label}</span>
                                        <span className="md:hidden text-[8px] leading-tight text-center">{cat.label.split(' ')[0]}</span>
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                                className={`h-14 flex items-center justify-center rounded-2xl transition-all border-2 ${
                                    isSearchExpanded
                                        ? 'bg-brand-blue border-brand-blue text-slate-950 shadow-[0_0_25px_rgba(56,182,255,0.6)] scale-105'
                                        : 'bg-slate-900/80 border-brand-blue/40 text-brand-blue hover:bg-brand-blue/20'
                                }`}
                            >
                                <Search size={24} />
                            </button>
                        </div>

                        {/* Linha 2: Busca (Full Width embaixo) */}
                        {isSearchExpanded && (
                            <div className="animate-fade-in-up w-full">
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-blue group-focus-within:scale-110 transition-transform" size={20} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="BUSCAR PRODUTOS, CHAVEIROS, SISTEMAS..."
                                        value={searchTerm}
                                        onChange={e => handleSearch(e.target.value)}
                                        className="w-full h-16 bg-slate-900 text-white text-sm pl-16 pr-12 border-2 border-brand-blue/50 rounded-2xl outline-none focus:border-brand-blue font-black uppercase tracking-widest placeholder-slate-600 shadow-[0_0_30px_rgba(56,182,255,0.15)] transition-all"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => handleSearch('')}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subcategorias Premium */}
                    {!isSearchExpanded && activeCategoryData && activeCategoryData.subcategories.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-brand-blue/30 animate-fade-in">
                            {activeCategoryData.subcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(sub)}
                                    className={`px-6 py-3 rounded-2xl text-[11px] md:text-sm font-black whitespace-nowrap border-2 transition-all ${
                                        subParam === sub
                                            ? 'bg-brand-blue/50 border-brand-blue text-white shadow-[0_0_20px_rgba(56,182,255,0.4)]'
                                            : 'bg-slate-900/80 border-white/10 text-white/90 hover:border-brand-blue/50'
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CATALOGO */}
            <div className="container mx-auto px-4 py-16 pb-48 flex-grow">
                {isFiltering && (
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 border-l-4 border-brand-blue pl-6 py-2">
                        <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                            {catParam !== 'Todos' ? catParam : 'Resultados'}
                            {subParam && <span className="text-brand-pink ml-4">/ {subParam}</span>}
                        </h2>
                        <button onClick={resetFilters} className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-[10px] font-black uppercase border-2 border-white/10 shadow-xl">
                            <X size={16} /> Limpar Filtros
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-32 w-full animate-fade-in">
        <div className="w-24 h-24 rounded-[2rem] bg-slate-800/40 border-2 border-brand-blue/30 flex items-center justify-center mx-auto mb-10 shadow-inner">
            <Filter className="opacity-30 text-brand-blue" size={48} />
        </div>
        <h3 className="text-2xl font-black text-white mb-5 uppercase tracking-tight">Nenhum produto encontrado</h3>
        <button onClick={onReset} className="px-10 py-5 rounded-2xl bg-brand-blue text-slate-950 font-black uppercase text-xs shadow-lg">
            Ver tudo
        </button>
    </div>
);
