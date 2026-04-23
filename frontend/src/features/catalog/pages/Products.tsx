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

    // Imagens para a galeria animada (pegar dos produtos reais)
    const galleryImages = products.map(p => p.imageUrl);

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col overflow-x-hidden">
            {/* ============================================================
                HERO SECTION — SPLIT LAYOUT (INSPIRAÇÃO WALLPAPER MANIA)
            ============================================================ */}
            <section
                id="hero"
                className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-12 px-6 md:px-12 overflow-hidden bg-[#020617]"
            >
                <Starfield />

                {/* Efeitos de Luz Blue/Pink */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-pink/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                    
                    {/* COLUNA ESQUERDA: TEXTO E BOTÕES */}
                    <div className="text-left animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                            A melhor<br/>
                            <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
                                experiência digital
                            </span><br/>
                            para o seu negócio.
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-lg mb-10 leading-relaxed">
                            NFC, Impressão 3D e Sistemas SaaS integrados em uma solução única e inovadora.
                        </p>

                        {/* BOTÕES DE CATEGORIA COMPACTOS */}
                        <div className="flex flex-col gap-6">
                            {!isSearchExpanded ? (
                                <div className="flex flex-wrap gap-2.5">
                                    <button
                                        onClick={() => handleCategoryChange('Todos')}
                                        className={`h-10 px-6 flex items-center justify-center rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                            catParam === 'Todos'
                                                ? 'bg-brand-blue text-slate-950 border-brand-blue shadow-[0_0_20px_rgba(56,182,255,0.3)]'
                                                : 'bg-slate-900/50 border-white/10 text-white hover:border-brand-blue/40'
                                        }`}
                                    >
                                        Todos
                                    </button>

                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={`h-10 px-6 flex items-center justify-center gap-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                                catParam === cat.id
                                                    ? 'bg-brand-blue text-slate-950 border-brand-blue shadow-[0_0_20px_rgba(56,182,255,0.3)]'
                                                    : 'bg-slate-900/50 border-white/10 text-white hover:border-brand-blue/40'
                                            }`}
                                        >
                                            <cat.icon size={14} />
                                            {cat.label}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setIsSearchExpanded(true)}
                                        className="h-10 w-12 flex items-center justify-center bg-slate-900/60 border-2 border-white/10 text-white rounded-full hover:border-brand-blue transition-all"
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 animate-fade-in max-w-md">
                                    <button 
                                        onClick={() => setIsSearchExpanded(false)}
                                        className="h-10 w-10 flex items-center justify-center bg-slate-900 text-white rounded-full border-2 border-white/10 hover:border-brand-blue"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue" size={16} />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="O QUE VOCÊ PROCURA?"
                                            value={searchTerm}
                                            onChange={e => handleSearch(e.target.value)}
                                            className="w-full h-10 bg-slate-900 text-white text-xs pl-10 pr-10 border-2 border-brand-blue/30 rounded-full outline-none focus:border-brand-blue shadow-xl font-bold uppercase tracking-widest placeholder-slate-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUNA DIREITA: GALERIA ANIMADA (EFEITO CACHOEIRA) */}
                    <div className="hidden md:block relative h-[600px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                        <div className="grid grid-cols-3 gap-4 h-full">
                            {/* Coluna 1: Sobe */}
                            <div className="flex flex-col gap-4 animate-[marquee-vertical_40s_linear_infinite]">
                                {[...galleryImages, ...galleryImages].map((img, i) => (
                                    <div key={i} className="aspect-[4/5] bg-slate-900 rounded-3xl overflow-hidden border border-white/10">
                                        <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                            {/* Coluna 2: Desce */}
                            <div className="flex flex-col gap-4 animate-[marquee-vertical-reverse_50s_linear_infinite] mt-[-100px]">
                                {[...galleryImages, ...galleryImages].map((img, i) => (
                                    <div key={i} className="aspect-[4/5] bg-slate-900 rounded-3xl overflow-hidden border border-white/10">
                                        <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                            {/* Coluna 3: Sobe devagar */}
                            <div className="flex flex-col gap-4 animate-[marquee-vertical_60s_linear_infinite] mt-20">
                                {[...galleryImages, ...galleryImages].map((img, i) => (
                                    <div key={i} className="aspect-[4/5] bg-slate-900 rounded-3xl overflow-hidden border border-white/10">
                                        <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* VALUE BAR COMPACTA */}
            <div className="bg-slate-900 border-y border-white/5 py-3 overflow-hidden relative z-20">
                <div className="animate-marquee whitespace-nowrap flex items-center w-max">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-12 px-6">
                            <div className="flex items-center gap-2 text-brand-blue text-[9px] font-black uppercase tracking-widest opacity-80">
                                <Truck size={12} /> Envio para todo Japão
                            </div>
                            <div className="flex items-center gap-2 text-brand-pink text-[9px] font-black uppercase tracking-widest opacity-80">
                                <ShieldCheck size={12} /> Tecnologia NFC 2.0
                            </div>
                            <div className="flex items-center gap-2 text-brand-yellow text-[9px] font-black uppercase tracking-widest opacity-80">
                                <Box size={12} /> Impressão 3D Premium
                            </div>
                            <div className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-widest">
                                <Clock size={12} /> Suporte Rápido - WhatsApp
                            </div>
                            <div className="flex items-center gap-2 text-brand-blue text-[9px] font-black uppercase tracking-widest opacity-80">
                                <Award size={12} /> Qualidade Garantida
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div id="product-grid-anchor" className="h-0" />

            {/* CATALOGO */}
            <div className="container mx-auto px-4 py-16 pb-32 flex-grow">
                {isFiltering && (
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 border-l-4 border-brand-blue pl-6 py-2">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                                {catParam !== 'Todos' ? catParam : 'Todos os Produtos'}
                            </h2>
                        </div>
                        <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-black uppercase border border-white/10">
                            <X size={14} /> Limpar Filtros
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
