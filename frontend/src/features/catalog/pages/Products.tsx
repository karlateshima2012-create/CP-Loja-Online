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

        // LOGICA PARA ESCONDER O MENU NO RODAPÉ
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.documentElement.scrollHeight - 300; // 300px antes do fim
            setIsVisible(scrollPosition < threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
                MENU FLUTUANTE DINÂMICO (Com Busca Abaixo e Auto-Hide no Footer)
            ============================================================ */}
            <div
                className={`fixed md:relative bottom-6 md:bottom-auto left-4 right-4 md:left-auto md:right-auto md:w-full z-50 md:z-40 bg-[#020617]/95 backdrop-blur-3xl border border-brand-blue/30 md:border-x-0 md:border-y shadow-[0_20px_60px_rgba(0,0,0,0.9)] md:shadow-none rounded-[2rem] md:rounded-none transition-all duration-500 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                }`}
            >
                <div className="container mx-auto px-4 py-4 md:py-6 relative z-10">
                    <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                        
                        {/* Linha 1: Botões de Categoria */}
                        <div className="grid grid-cols-5 gap-2.5 w-full">
                            <button
                                onClick={() => handleCategoryChange('Todos')}
                                className={`h-11 flex items-center justify-center rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                                    catParam === 'Todos'
                                        ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                                        : 'bg-slate-900/50 border-white/20 text-white hover:border-brand-blue/50'
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
                                        className={`h-11 flex flex-col md:flex-row items-center justify-center gap-1.5 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                                            isActive
                                                ? 'bg-brand-blue border-brand-blue text-slate-950 shadow-[0_0_15px_rgba(56,182,255,0.4)]'
                                                : 'bg-slate-900/50 border-white/20 text-white hover:border-brand-blue/50'
                                        }`}
                                    >
                                        <cat.icon size={16} className="flex-shrink-0" />
                                        <span className="hidden md:inline">{cat.label}</span>
                                        <span className="md:hidden text-[8px] text-center">{cat.label.split(' ')[0]}</span>
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                                className={`h-11 flex items-center justify-center rounded-xl transition-all border-2 ${
                                    isSearchExpanded
                                        ? 'bg-brand-blue border-brand-blue text-slate-950 shadow-[0_0_15px_rgba(56,182,255,0.4)]'
                                        : 'bg-slate-900/60 border-brand-blue/40 text-brand-blue hover:bg-brand-blue/10'
                                }`}
                            >
                                <Search size={22} />
                            </button>
                        </div>

                        {/* Linha 2: Campo de Busca (Aparece Abaixo quando expandido) */}
                        {isSearchExpanded && (
                            <div className="animate-fade-in-up w-full">
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-blue" size={18} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="BUSCAR PRODUTOS, CHAVEIROS, SISTEMAS..."
                                        value={searchTerm}
                                        onChange={e => handleSearch(e.target.value)}
                                        className="w-full h-12 bg-slate-900/80 text-white text-xs pl-12 pr-12 border-2 border-brand-blue/60 rounded-xl outline-none focus:border-brand-blue font-black uppercase tracking-widest placeholder-slate-600 shadow-[0_0_20px_rgba(56,182,255,0.2)]"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => handleSearch('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subcategorias Premium (Aparecem entre botões e busca) */}
                    {!isSearchExpanded && activeCategoryData && activeCategoryData.subcategories.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 pt-5 border-t border-brand-blue/20 animate-fade-in relative">
                            {activeCategoryData.subcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(sub)}
                                    className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black whitespace-nowrap border-2 transition-all ${
                                        subParam === sub
                                            ? 'bg-brand-blue/40 border-brand-blue text-white shadow-[0_0_20px_rgba(56,182,255,0.4)]'
                                            : 'bg-slate-900/80 border-white/10 text-white hover:border-brand-blue/40'
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
            <div className="container mx-auto px-4 py-16 pb-40 flex-grow">
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
