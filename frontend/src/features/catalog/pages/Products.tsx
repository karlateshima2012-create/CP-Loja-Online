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
            
            {/* HERO SECTION — CORREÇÃO DE ESTRELAS E BORDER RADIUS */}
            <section
                id="hero"
                className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-12 px-6 md:px-12 overflow-hidden bg-transparent"
            >
                {/* O Starfield deve ficar aqui, no fundo de tudo */}
                <div className="absolute inset-0 bg-[#020617] -z-20" />
                <div className="absolute inset-0 -z-10 opacity-70">
                    <Starfield />
                </div>
                
                {/* Luz Pulsante no Canto Esquerdo */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[150px] animate-pulse -z-10 pointer-events-none"></div>

                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="text-left animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                            Encontre a solução<br/>
                            <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
                                ideal para o seu negócio.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-lg leading-relaxed">
                            Crie presença digital, conecte clientes com NFC e automatize seu atendimento.
                        </p>
                    </div>

                    {/* GALERIA CACHOEIRA — BORDER RADIUS REDUZIDO */}
                    <div className="hidden md:block relative h-[550px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
                        <div className="grid grid-cols-3 gap-5 h-full">
                            {[1, 2, 3].map((col) => (
                                <div key={col} className={`flex flex-col gap-5 animate-[marquee-vertical_${12 + col * 4}s_linear_infinite] ${col === 2 ? 'mt-[-50px] [animation-direction:reverse]' : ''}`}>
                                    {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                                        <div key={i} className="aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-transform hover:scale-105 duration-500">
                                            <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <div ref={footerSensorRef} className="h-1 w-full -mt-20 pointer-events-none" />

            {/* DOCK MENU */}
            <div
                style={{ 
                    transform: `translateY(${isVisible ? (keyboardOffset > 0 ? -keyboardOffset + 10 : 0) : '100%'}px)`,
                    opacity: isVisible ? 1 : 0
                }}
                className={`fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:w-full z-50 md:z-40 bg-[#03081a]/98 backdrop-blur-3xl border-t border-brand-blue/60 md:border-t-0 md:border-b md:border-white/5 shadow-[0_-20px_60px_rgba(0,0,0,0.9)] md:shadow-none rounded-t-[2.5rem] md:rounded-none transition-all duration-300 ease-out`}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/10 via-transparent to-brand-blue/5 pointer-events-none rounded-t-[2.5rem] md:rounded-none md:hidden"></div>
                <div className="container mx-auto px-4 py-6 md:py-10 relative z-10 pb-[env(safe-area-inset-bottom,20px)]">
                    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
                            <button onClick={() => handleCategoryChange('Todos')} className={`h-14 flex items-center justify-center rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all border-2 ${catParam === 'Todos' ? 'bg-white text-slate-950 border-white shadow-xl' : 'bg-slate-900/60 border-white/10 text-white/80 hover:border-brand-blue/40'}`}>Todos</button>
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`h-14 flex flex-col md:flex-row items-center justify-center gap-2 rounded-2xl text-[9px] md:text-sm font-black uppercase tracking-widest transition-all border-2 ${catParam === cat.id ? 'bg-brand-blue border-brand-blue text-slate-950 shadow-xl' : 'bg-slate-900/60 border-white/10 text-white/80 hover:border-brand-blue/40'}`}>
                                    <cat.icon size={20} /><span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="w-full">
                            <div className="md:hidden flex justify-center mb-2">
                                <button onClick={() => setIsSearchExpanded(!isSearchExpanded)} className={`h-12 w-full flex items-center justify-center rounded-2xl border-2 ${isSearchExpanded ? 'bg-brand-blue border-brand-blue text-slate-950' : 'bg-slate-900/80 border-brand-blue/40 text-brand-blue'}`}><Search size={22} className="mr-2" /> {isSearchExpanded ? 'Fechar Busca' : 'Buscar Produtos'}</button>
                            </div>
                            {(isSearchExpanded || window.innerWidth > 768) && (
                                <div className="animate-fade-in-up w-full">
                                    <div className="relative group">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-blue" size={20} />
                                        <input autoFocus={isSearchExpanded} type="text" placeholder="BUSCAR PRODUTOS, CHAVEIROS, SISTEMAS..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="w-full h-16 bg-slate-900/40 text-white text-sm pl-16 pr-12 border-2 border-white/10 rounded-2xl outline-none focus:border-brand-blue font-black uppercase tracking-widest placeholder-slate-600 transition-all" />
                                        {searchTerm && <button onClick={() => handleSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"><X size={18} /></button>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
