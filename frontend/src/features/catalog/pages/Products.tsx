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
            
            {/* HERO SECTION — MOBILE ENHANCED (SIZE & SPEED) */}
            <section
                id="hero"
                className="relative min-h-[70vh] md:min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-transparent"
            >
                <div className="absolute inset-0 bg-[#020617] -z-20" />
                <div className="absolute inset-0 -z-10 opacity-70">
                    <Starfield />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[200px] animate-pulse -z-10 pointer-events-none"></div>

                {/* TEXTO FLUTUANTE CENTRALIZADO (Mobile Aumentado) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-8">
                    <div className="text-center animate-fade-in-up">
                        <h1 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
                            Encontre a solução<br/>
                            <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
                                ideal para o seu negócio.
                            </span>
                        </h1>
                        <p className="text-sm md:text-2xl font-semibold text-slate-200 mt-6 md:mt-8 max-w-[320px] md:max-w-3xl mx-auto leading-relaxed drop-shadow-[0_4px_15px_rgba(0,0,0,1)] opacity-100">
                            Crie presença digital, conecte clientes com NFC e automatize seu atendimento.
                        </p>
                    </div>
                </div>

                {/* CARROSSEL MULTI-LINHA (Mais Lento e Desalinhado no Mobile) */}
                <div className="w-full flex flex-col gap-4 md:gap-8 opacity-25 md:opacity-20 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                    {/* Linha 1 - Lento */}
                    <div className="flex gap-4 animate-[marquee_50s_linear_infinite] w-max">
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                            <div key={i} className="w-28 md:w-56 aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/5">
                                <img src={img} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    {/* Linha 2 - Lento e Reverso */}
                    <div className="flex gap-4 animate-[marquee_70s_linear_infinite] w-max ml-[-100px] md:ml-0" style={{ animationDirection: 'reverse' }}>
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                            <div key={i} className="w-28 md:w-56 aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/5">
                                <img src={img} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    {/* Linha 3 - Lento */}
                    <div className="flex gap-4 animate-[marquee_60s_linear_infinite] w-max ml-[50px] md:ml-0">
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                            <div key={i} className="w-28 md:w-56 aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/5">
                                <img src={img} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    {/* Linha 4 (Apenas Desktop) */}
                    <div className="hidden md:flex gap-4 animate-[marquee_80s_linear_infinite] w-max" style={{ animationDirection: 'reverse' }}>
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                            <div key={i} className="w-28 md:w-56 aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/5">
                                <img src={img} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div id="product-grid-anchor" className="h-0" />

            {/* DOCK SECTION (DESKTOP ONLY) */}
            <div className="hidden md:block relative w-full bg-[#020617] pt-1 pb-10">
                <div className="w-full h-[2px] bg-gradient-to-r from-brand-blue via-brand-pink to-brand-blue opacity-80 mb-8"></div>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={() => handleCategoryChange('Todos')} className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${catParam === 'Todos' ? 'bg-brand-blue text-slate-950 shadow-xl' : 'bg-transparent border border-white/20 text-white/60 hover:border-white/40'}`}>Todos</button>
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${catParam === cat.id ? 'bg-white text-slate-950 shadow-xl' : 'bg-transparent border border-white/20 text-white/60 hover:border-white/40'}`}>{cat.label}</button>
                            ))}
                        </div>
                        <div className="relative group">
                            <input type="text" placeholder="Buscar produtos, chaveiros, sistemas..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="w-full h-14 bg-slate-900/40 text-white text-sm pl-6 pr-12 border border-white/10 rounded-xl outline-none focus:border-brand-blue/50 transition-all placeholder-slate-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* CATALOGO */}
            <div className="container mx-auto px-6 py-12 md:py-16 pb-48 flex-grow">
                <div className="flex items-center gap-3 mb-10 animate-fade-in">
                    <div className="w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(56,182,255,0.8)]"></div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">Nossos Produtos</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="hidden md:flex justify-center mt-20">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group flex flex-col items-center gap-4 text-white/30 hover:text-brand-blue transition-all duration-500">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-blue transition-all"><ArrowLeft className="rotate-90" size={20} /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Voltar ao Topo</span>
                    </button>
                </div>
            </div>

            <div ref={footerSensorRef} className="h-1 w-full -mt-20 pointer-events-none" />

            {/* DOCK MOBILE REFINADO */}
            <div
                style={{ 
                    transform: `translateY(${isVisible ? (keyboardOffset > 0 ? -keyboardOffset + 10 : 0) : '100%'}px)`,
                    opacity: isVisible ? 1 : 0
                }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#03081a]/98 backdrop-blur-3xl border-t border-brand-blue/60 rounded-t-[2.5rem] transition-all duration-300 ease-out"
            >
                <div className="container mx-auto px-4 py-4 pb-[env(safe-area-inset-bottom,12px)]">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-1">
                            <button onClick={() => handleCategoryChange('Todos')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${catParam === 'Todos' ? 'text-brand-blue' : 'text-white/40'}`}>
                                <Filter size={18} /><span className="text-[8px] font-black uppercase tracking-tighter">Todos</span>
                            </button>
                            {CATEGORIES.map(cat => {
                                const isActive = catParam === cat.id;
                                return (
                                    <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${isActive ? 'text-brand-blue' : 'text-white/40'}`}>
                                        <cat.icon size={18} /><span className="text-[8px] font-black uppercase tracking-tighter leading-none text-center">{cat.label.split(' ')[0]}</span>
                                    </button>
                                );
                            })}
                            <button onClick={() => setIsSearchExpanded(!isSearchExpanded)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${isSearchExpanded ? 'text-brand-blue' : 'text-white/40'}`}>
                                <Search size={18} /><span className="text-[8px] font-black uppercase tracking-tighter">Busca</span>
                            </button>
                        </div>
                        {isSearchExpanded && (
                            <input autoFocus type="text" placeholder="BUSCAR PRODUTOS..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="w-full h-11 bg-slate-900 text-white text-xs px-4 border border-brand-blue/50 rounded-xl outline-none" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
