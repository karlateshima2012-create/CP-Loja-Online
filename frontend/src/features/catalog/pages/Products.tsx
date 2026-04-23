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

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(!entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (footerSensorRef.current) observer.observe(footerSensorRef.current);

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
            
            {/* HERO SECTION — MOBILE OPTIMIZED */}
            <section
                id="hero"
                className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col md:flex-row items-center justify-center pt-24 pb-12 px-6 md:px-12 overflow-hidden bg-transparent"
            >
                <div className="absolute inset-0 bg-[#020617] -z-20" />
                <div className="absolute inset-0 -z-10 opacity-70">
                    <Starfield />
                </div>
                
                {/* LUZ PULSANTE MOBILE (Mais centralizada no topo) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[150px] animate-pulse -z-10 pointer-events-none"></div>

                <div className="container mx-auto flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                    
                    {/* ANIMAÇÃO: HORIZONTAL NO MOBILE / VERTICAL NO DESKTOP */}
                    <div className="w-full order-1 md:order-2">
                        {/* Mobile: Marquee Horizontal */}
                        <div className="md:hidden w-screen -mx-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] mb-4">
                            <div className="flex gap-4 animate-[marquee_20s_linear_infinite] w-max">
                                {[...galleryImages, ...galleryImages].map((img, i) => (
                                    <div key={i} className="w-40 aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-xl">
                                        <img src={img} className="w-full h-full object-cover opacity-70" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: Waterfall Vertical */}
                        <div className="hidden md:block relative h-[550px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
                            <div className="grid grid-cols-3 gap-5 h-full">
                                {[1, 2, 3].map((col) => (
                                    <div key={col} className={`flex flex-col gap-5 animate-[marquee-vertical_${12 + col * 4}s_linear_infinite] ${col === 2 ? 'mt-[-50px] [animation-direction:reverse]' : ''}`}>
                                        {[...galleryImages, ...galleryImages].map((img, i) => (
                                            <div key={i} className="aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                                <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* TEXTO: ABAIXO NO MOBILE / ESQUERDA NO DESKTOP */}
                    <div className="text-center md:text-left animate-fade-in-up order-2 md:order-1">
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                            Encontre a solução<br/>
                            <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
                                ideal para o seu negócio.
                            </span>
                        </h1>
                        <p className="text-base md:text-xl text-slate-400 font-medium max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Crie presença digital, conecte clientes com NFC e automatize seu atendimento.
                        </p>
                    </div>
                </div>
            </section>

            <div id="product-grid-anchor" className="h-0" />

            {/* DOCK SECTION (APENAS DESKTOP) */}
            <div className="hidden md:block relative w-full bg-[#020617] pt-1 pb-10">
                <div className="w-full h-[2px] bg-gradient-to-r from-brand-blue via-brand-pink to-brand-blue opacity-80 mb-8 shadow-[0_0_15px_rgba(56,182,255,0.3)]"></div>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={() => handleCategoryChange('Todos')} className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${catParam === 'Todos' ? 'bg-brand-blue text-slate-950 shadow-xl' : 'bg-transparent border border-white/20 text-white/60 hover:border-white/40'}`}>Todos</button>
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${catParam === cat.id ? 'bg-white text-slate-950 shadow-xl' : 'bg-transparent border border-white/20 text-white/60 hover:border-white/40'}`}>{cat.label}</button>
                            ))}
                        </div>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2"><div className="w-5 h-5 rounded-full border-2 border-slate-500 group-focus-within:border-brand-blue"></div></div>
                            <input type="text" placeholder="Buscar produtos, chaveiros, sistemas..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="w-full h-14 bg-slate-900/40 text-white text-sm pl-16 pr-12 border border-white/10 rounded-xl outline-none focus:border-brand-blue/50 transition-all placeholder-slate-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* CATALOGO */}
            <div className="container mx-auto px-6 py-12 md:py-16 pb-48 flex-grow">
                
                {/* Título da Seção */}
                <div className="flex items-center gap-3 mb-10 animate-fade-in">
                    <div className="w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(56,182,255,0.8)]"></div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
                        Nossos Produtos
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* BOTÃO VOLTAR AO TOPO (Desktop Only) */}
                <div className="hidden md:flex justify-center mt-20">
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="group flex flex-col items-center gap-4 text-white/30 hover:text-brand-blue transition-all duration-500"
                    >
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-blue group-hover:shadow-[0_0_20px_rgba(56,182,255,0.3)] transition-all">
                            <ArrowLeft className="rotate-90" size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Voltar ao Topo</span>
                    </button>
                </div>
            </div>

            <div ref={footerSensorRef} className="h-1 w-full -mt-20 pointer-events-none" />

            {/* DOCK MOBILE FLUTUANTE (MANTIDO) */}
            <div
                style={{ 
                    transform: `translateY(${isVisible ? (keyboardOffset > 0 ? -keyboardOffset + 10 : 0) : '100%'}px)`,
                    opacity: isVisible ? 1 : 0
                }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#03081a]/98 backdrop-blur-3xl border-t border-brand-blue/60 rounded-t-[2.5rem] transition-all duration-300 ease-out"
            >
                <div className="container mx-auto px-4 py-6 pb-[env(safe-area-inset-bottom,20px)]">
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-5 gap-2">
                            <button onClick={() => handleCategoryChange('Todos')} className={`h-11 flex items-center justify-center rounded-xl text-[9px] font-black border ${catParam === 'Todos' ? 'bg-brand-blue text-slate-950 border-brand-blue' : 'bg-slate-900 border-white/10 text-white'}`}>Todos</button>
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`h-11 flex items-center justify-center rounded-xl text-[9px] font-black border ${catParam === cat.id ? 'bg-brand-blue text-slate-950 border-brand-blue' : 'bg-slate-900 border-white/10 text-white'}`}>
                                    <cat.icon size={16} />
                                </button>
                            ))}
                            <button onClick={() => setIsSearchExpanded(!isSearchExpanded)} className="h-11 flex items-center justify-center rounded-xl bg-slate-900 border border-brand-blue/40 text-brand-blue"><Search size={20} /></button>
                        </div>
                        {isSearchExpanded && (
                            <input type="text" placeholder="BUSCAR..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="w-full h-12 bg-slate-900 text-white text-xs px-4 border border-brand-blue/50 rounded-xl outline-none" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
