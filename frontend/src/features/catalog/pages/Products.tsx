import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product } from '@/src/types';
import {
    Search, X, Box, Cpu, Monitor, ArrowLeft,
    Truck, ShieldCheck, Clock, Award, Filter
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
    const [keyboardOffset, setKeyboardOffset] = useState(0);
    
    const footerSensorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());

        // 1. SENSOR DE RODAPÉ (Intersection Observer)
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (footerSensorRef.current) {
            observer.observe(footerSensorRef.current);
        }

        // 2. DETECÇÃO DE TECLADO (Visual Viewport API — Especial para iPhone)
        const handleViewportChange = () => {
            if (window.visualViewport) {
                const offset = window.innerHeight - window.visualViewport.height;
                setKeyboardOffset(offset > 0 ? offset : 0);
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportChange);
            window.visualViewport.addEventListener('scroll', handleViewportChange);
        }

        return () => {
            observer.disconnect();
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleViewportChange);
                window.visualViewport.removeEventListener('scroll', handleViewportChange);
            }
        };
    }, []);

    // Efeito de scroll ao mudar filtros
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
        if (sub === subParam) p.delete('sub');
        else p.set('sub', sub);
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

                    <div className="hidden md:block relative h-[500px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
                        <div className="grid grid-cols-3 gap-4 h-full">
                            {[1, 2, 3].map((col) => (
                                <div key={col} className={`flex flex-col gap-4 animate-[marquee-vertical_${30 + col * 10}s_linear_infinite] ${col === 2 ? 'mt-[-50px] [animation-direction:reverse]' : ''}`}>
                                    {[...galleryImages, ...galleryImages].map((img, i) => (
                                        <div key={i} className="aspect-[4/5] bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
                                            <img src={img} className="w-full h-full object-cover opacity-40 hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div id="product-grid-anchor" className="h-0" />

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

            {/* SENSOR DE RODAPÉ (Invisível) */}
            <div ref={footerSensorRef} className="h-1 w-full -mt-20 pointer-events-none" />

            {/* ============================================================
                DOCK MENU (Sincronizado com Teclado e Auto-Hide)
            ============================================================ */}
            <div
                style={{ 
                    transform: `translateY(${isVisible ? (keyboardOffset > 0 ? -keyboardOffset + 10 : 0) : '100%'}px)`,
                    opacity: isVisible ? 1 : 0
                }}
                className={`fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:w-full z-50 md:z-40 bg-[#03081a]/98 backdrop-blur-3xl border-t border-brand-blue/60 md:border-x-0 md:border-y shadow-[0_-20px_60px_rgba(0,0,0,0.9)] md:shadow-none rounded-t-[2.5rem] md:rounded-none transition-all duration-300 ease-out`}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/10 via-transparent to-brand-blue/5 pointer-events-none rounded-t-[2.5rem] md:rounded-none"></div>
                
                <div className="container mx-auto px-4 py-6 md:py-8 relative z-10 pb-[env(safe-area-inset-bottom,20px)]">
                    <div className="flex flex-col gap-5 max-w-5xl mx-auto">
                        
                        {/* Linha 1: Categorias */}
                        <div className="grid grid-cols-5 gap-3 w-full">
                            <button
                                onClick={() => handleCategoryChange('Todos')}
                                className={`h-14 flex items-center justify-center rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                    catParam === 'Todos' ? 'bg-white text-slate-950 border-white shadow-xl' : 'bg-slate-900/60 border-white/10 text-white/80'
                                }`}
                            >
                                Todos
                            </button>

                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`h-14 flex flex-col md:flex-row items-center justify-center gap-1.5 rounded-2xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                        catParam === cat.id ? 'bg-brand-blue border-brand-blue text-slate-950 shadow-xl' : 'bg-slate-900/60 border-white/10 text-white/80'
                                    }`}
                                >
                                    <cat.icon size={20} />
                                    <span className="hidden md:inline">{cat.label}</span>
                                    <span className="md:hidden text-[8px] leading-tight text-center">{cat.label.split(' ')[0]}</span>
                                </button>
                            ))}

                            <button
                                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                                className={`h-14 flex items-center justify-center rounded-2xl transition-all border-2 ${
                                    isSearchExpanded ? 'bg-brand-blue border-brand-blue text-slate-950' : 'bg-slate-900/80 border-brand-blue/40 text-brand-blue'
                                }`}
                            >
                                <Search size={24} />
                            </button>
                        </div>

                        {/* Linha 2: Busca */}
                        {isSearchExpanded && (
                            <div className="animate-fade-in-up w-full">
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-blue" size={20} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="BUSCAR PRODUTOS, CHAVEIROS, SISTEMAS..."
                                        value={searchTerm}
                                        onChange={e => handleSearch(e.target.value)}
                                        className="w-full h-16 bg-slate-900 text-white text-sm pl-16 pr-12 border-2 border-brand-blue/50 rounded-2xl outline-none focus:border-brand-blue font-black uppercase tracking-widest placeholder-slate-600 shadow-xl"
                                    />
                                    {searchTerm && (
                                        <button onClick={() => handleSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subcategorias */}
                    {!isSearchExpanded && activeCategoryData && activeCategoryData.subcategories.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-brand-blue/30 animate-fade-in">
                            {activeCategoryData.subcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(sub)}
                                    className={`px-6 py-3 rounded-2xl text-[11px] md:text-sm font-black whitespace-nowrap border-2 transition-all ${
                                        subParam === sub ? 'bg-brand-blue/50 border-brand-blue text-white' : 'bg-slate-900/80 border-white/10 text-white/90'
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
