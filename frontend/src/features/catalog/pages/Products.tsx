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
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());
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

    const galleryImages = products.map(p => p.imageUrl);

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col overflow-x-hidden">
            
            {/* ============================================================
                TOP VALUE BAR (MARQUEE ESTREITO NO TOPO ABSOLUTO)
            ============================================================ */}
            <div className="bg-slate-950 border-b border-white/5 py-1.5 overflow-hidden relative z-[60]">
                <div className="animate-marquee whitespace-nowrap flex items-center w-max">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-10 px-4">
                            <div className="flex items-center gap-2 text-brand-blue text-[8px] font-black uppercase tracking-widest opacity-70">
                                <Truck size={10} /> Envio para todo Japão
                            </div>
                            <div className="flex items-center gap-2 text-brand-pink text-[8px] font-black uppercase tracking-widest opacity-70">
                                <ShieldCheck size={10} /> Tecnologia NFC 2.0
                            </div>
                            <div className="flex items-center gap-2 text-brand-yellow text-[8px] font-black uppercase tracking-widest opacity-70">
                                <Box size={10} /> Impressão 3D Premium
                            </div>
                            <div className="flex items-center gap-2 text-white/30 text-[8px] font-black uppercase tracking-widest">
                                <Clock size={10} /> Suporte Rápido - WhatsApp
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* HERO SECTION */}
            <section
                id="hero"
                className="relative min-h-[70vh] flex items-center justify-center pt-20 pb-12 px-6 md:px-12 overflow-hidden bg-[#020617]"
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
                DIVISOR DE CATEGORIAS (Sticky Bottom no Mobile, Divider no Desktop)
            ============================================================ */}
            <div
                className="sticky md:relative top-20 md:top-auto bottom-0 md:bottom-auto z-40 bg-[#020617]/95 backdrop-blur-2xl border-y border-brand-blue/20 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] md:shadow-none mt-auto md:mt-0 order-last md:order-none"
            >
                <div className="container mx-auto px-3 py-4 md:py-6">
                    <div className="relative h-11 w-full max-w-5xl mx-auto">
                        {!isSearchExpanded ? (
                            <div className="grid grid-cols-5 gap-2.5 animate-fade-in w-full h-full">
                                <button
                                    onClick={() => handleCategoryChange('Todos')}
                                    className={`h-11 flex items-center justify-center px-1 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                                        catParam === 'Todos'
                                            ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                            : 'bg-slate-900/50 border-white/5 text-white hover:border-brand-blue/40'
                                    }`}
                                >
                                    Todos
                                </button>

                                {CATEGORIES.map(cat => {
                                    const isActive = catParam === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={`h-11 flex flex-col md:flex-row items-center justify-center gap-1.5 px-1 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                                                isActive
                                                    ? 'bg-brand-blue border-brand-blue text-slate-950 shadow-[0_0_15px_rgba(56,182,255,0.4)]'
                                                    : 'bg-slate-900/50 border-white/5 text-white hover:border-brand-blue/40'
                                            }`}
                                        >
                                            <cat.icon size={16} className="flex-shrink-0" />
                                            <span className="hidden md:inline">{cat.label}</span>
                                            <span className="md:hidden text-[8px] text-center">{cat.label.split(' ')[0]}</span>
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
                                    onClick={() => setIsSearchExpanded(false)}
                                    className="h-11 w-11 flex items-center justify-center bg-slate-900 text-white rounded-xl border-2 border-brand-blue/30"
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
                                        className="w-full h-full bg-slate-900 text-white text-xs pl-11 pr-11 border-2 border-brand-blue/40 rounded-xl outline-none focus:border-brand-blue shadow-xl font-bold uppercase tracking-widest"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subcategorias */}
                    {!isSearchExpanded && activeCategoryData && activeCategoryData.subcategories.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 pt-5 border-t border-brand-blue/20 animate-fade-in">
                            {activeCategoryData.subcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(sub)}
                                    className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black whitespace-nowrap border-2 transition-all ${
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

            {/* CATALOGO */}
            <div className="container mx-auto px-4 py-12 md:py-20 pb-32 flex-grow">
                {isFiltering && (
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 border-l-4 border-brand-blue pl-5 py-2">
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                            {catParam !== 'Todos' ? catParam : 'Resultados'}
                            {subParam && <span className="text-brand-pink ml-3">/ {subParam}</span>}
                        </h2>
                        <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-black uppercase border border-white/10">
                            <X size={14} /> Limpar
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
    <div className="text-center py-24 w-full animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-slate-800/30 border-2 border-brand-blue/20 flex items-center justify-center mx-auto mb-8">
            <Filter className="opacity-20 text-brand-blue" size={40} />
        </div>
        <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Nenhum resultado</h3>
        <button onClick={onReset} className="px-8 py-4 rounded-2xl bg-brand-blue text-slate-950 font-black uppercase text-xs shadow-lg">
            Ver tudo
        </button>
    </div>
);
