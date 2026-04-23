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

const CATEGORIES = [
    { id: 'Impressão 3D', label: 'Impressão 3D', icon: Box },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', icon: Cpu },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', icon: Monitor },
];

const SUBCATEGORIES: Record<string, string[]> = {
    'Impressão 3D': ['Chaveiros 3D', 'Displays / Suportes', 'Letreiros personalizados'],
    'Tecnologia NFC': ['Chaveiros com NFC', 'Displays com NFC'],
};

export const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const catParam = searchParams.get('cat') || 'Todos';
    const subParam = searchParams.get('sub') || '';
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    
    const footerSensorRef = useRef<HTMLDivElement>(null);

    const [isDockDismissed, setIsDockDismissed] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (isSearchExpanded || isDockDismissed) {
                    if (isDockDismissed) setIsVisible(false);
                    else setIsVisible(true);
                    return;
                }
                
                const isShortPage = document.documentElement.scrollHeight <= window.innerHeight + 200;
                setIsVisible(isShortPage ? true : !entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        
        if (footerSensorRef.current) observer.observe(footerSensorRef.current);
        return () => observer.disconnect();
    }, [isSearchExpanded, isDockDismissed]);

    // Re-habilitar o dock ao mudar de filtros
    useEffect(() => {
        setIsDockDismissed(false);
        const checkShortPage = () => {
            const isShortPage = document.documentElement.scrollHeight <= window.innerHeight + 200;
            if (isShortPage) setIsVisible(true);
        };
        setTimeout(checkShortPage, 150);
    }, [catParam, searchTerm, subParam]);

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

    const filteredProducts = products.filter(p => {
        // Se houver busca, ela tem prioridade total e ignora categoria/subcategoria
        if (searchTerm) {
            return p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   p.category.toLowerCase().includes(searchTerm.toLowerCase());
        }

        const matchesCat = catParam === 'Todos' || p.category === catParam;
        const matchesSub = !subParam || (p as any).subcategory === subParam;
        return matchesCat && matchesSub;
    });

    const galleryImages = products.map(p => p.imageUrl);
    const availableSubcategories = SUBCATEGORIES[catParam] || [];

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col">
            
            {/* HERO SECTION */}
            <section id="hero" className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center pt-6 md:pt-24 pb-12 overflow-hidden bg-transparent">
                <div className="absolute inset-0 bg-[#020617] -z-20" />
                <div className="absolute inset-0 -z-10 opacity-70"><Starfield /></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[200px] animate-pulse -z-10 pointer-events-none"></div>

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-8 text-center animate-fade-in-up">
                    <h1 className="text-4xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,1)] drop-shadow-[0_5px_30px_rgba(0,0,0,1)] md:drop-shadow-[0_10px_50px_rgba(0,0,0,1)]">
                        Encontre a solução<br/>
                        <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">ideal para o seu negócio.</span>
                    </h1>
                    <p className="text-lg md:text-3xl font-semibold text-slate-200 mt-6 md:mt-10 max-w-[320px] md:max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,1)] drop-shadow-[0_5px_20px_rgba(0,0,0,1)] md:drop-shadow-[0_10px_30px_rgba(0,0,0,1)]">
                        Crie presença digital, conecte clientes com NFC e automatize seu atendimento.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-4 md:gap-8 opacity-50 md:opacity-30 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <div className="flex gap-4 animate-[marquee_60s_linear_infinite] w-max">
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                            <div key={i} className="w-28 md:w-44 aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/5"><img src={img} className="w-full h-full object-cover" /></div>
                        ))}
                    </div>
                    <div className="flex gap-4 animate-[marquee_80s_linear_infinite] w-max ml-[-100px] md:ml-[-200px]" style={{ animationDirection: 'reverse' }}>
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                            <div key={i} className="w-28 md:w-44 aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/5"><img src={img} className="w-full h-full object-cover" /></div>
                        ))}
                    </div>
                    <div className="flex gap-4 animate-[marquee_30s_linear_infinite] w-max ml-[50px] md:ml-[100px]">
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                            <div key={i} className="w-28 md:w-44 aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden border border-white/5"><img src={img} className="w-full h-full object-cover" /></div>
                        ))}
                    </div>
                </div>
            </section>

            <div id="product-grid-anchor" className="h-0" />

            {/* CATALOGO */}
            <div className="relative w-full bg-[#020617] pt-1">
                <div className="w-full h-[2px] bg-gradient-to-r from-brand-blue via-brand-pink to-brand-blue opacity-80 mb-8 shadow-[0_0_15px_rgba(56,182,255,0.3)]"></div>
                
                <div className="hidden md:block pb-10 container mx-auto px-6">
                    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={() => handleCategoryChange('Todos')} className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${catParam === 'Todos' ? 'bg-brand-blue text-slate-950 shadow-xl' : 'bg-transparent border border-white/20 text-white/60 hover:border-white/40'}`}>Todos</button>
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${catParam === cat.id ? 'bg-white text-slate-950 shadow-xl' : 'bg-transparent border border-white/20 text-white/60 hover:border-white/40'}`}>{cat.label}</button>
                            ))}
                        </div>
                        {availableSubcategories.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 animate-fade-in">
                                {availableSubcategories.map(sub => (
                                    <button key={sub} onClick={() => handleSubcategoryChange(sub)} className={`px-5 py-1.5 rounded-full text-[10px] font-bold transition-all border ${subParam === sub ? 'bg-brand-pink border-brand-pink text-white' : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'}`}>{sub}</button>
                                ))}
                            </div>
                        )}
                        <input type="text" placeholder="Buscar produtos..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="w-full h-14 bg-slate-900/40 text-white text-sm pl-6 border border-white/10 rounded-xl outline-none focus:border-brand-blue/50 transition-all placeholder-slate-500" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 md:py-16 pb-48 flex-grow">
                <div className="flex items-center justify-between mb-10 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(56,182,255,0.8)]"></div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
                            {searchTerm ? `Resultados para "${searchTerm}"` : 'Nossos Produtos'}
                        </h2>
                    </div>
                    {searchTerm && (
                        <button onClick={() => handleSearch('')} className="text-[10px] font-bold text-brand-pink uppercase tracking-widest flex items-center gap-1 hover:opacity-80">
                            <X size={12} /> Limpar Busca
                        </button>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
                            <Search size={32} className="text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
                        <p className="text-slate-500 text-sm max-w-xs">Não encontramos nada para "{searchTerm}". Tente usar palavras-chave mais simples.</p>
                        <button onClick={() => handleSearch('')} className="mt-8 text-brand-blue font-black uppercase tracking-widest text-xs border-b border-brand-blue/30 pb-1">Ver todos os produtos</button>
                    </div>
                )}
            </div>

            <div ref={footerSensorRef} className="h-40 w-full pointer-events-none" />

            {/* DOCK MOBILE ESTÁVEL (CORREÇÃO DE PULO) */}
            <div
                className={`md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#03081a]/98 backdrop-blur-3xl border-t border-brand-blue/60 rounded-t-[2.5rem] transition-all duration-500 ease-in-out ${
                    isVisible && !isDockDismissed ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                }`}
            >
                {/* Botão X para fechar (Lado de fora, sutil) */}
                <button 
                    onClick={() => setIsDockDismissed(true)}
                    className="absolute -top-12 right-6 w-10 h-10 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all shadow-2xl"
                >
                    <X size={20} />
                </button>

                <div className="container mx-auto px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <div className="flex flex-col gap-4">
                        {availableSubcategories.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar animate-fade-in">
                                {availableSubcategories.map(sub => (
                                    <button key={sub} onClick={() => handleSubcategoryChange(sub)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[9px] font-black border transition-all ${subParam === sub ? 'bg-brand-pink border-brand-pink text-white' : 'bg-slate-900 border-white/20 text-white/70'}`}>{sub}</button>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-1">
                            <button onClick={() => handleCategoryChange('Todos')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${catParam === 'Todos' ? 'text-brand-blue' : 'text-white/70'}`}>
                                <Filter size={18} /><span className="text-[8px] font-black uppercase tracking-tighter">Todos</span>
                            </button>
                            {CATEGORIES.map(cat => (
                                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${catParam === cat.id ? 'text-brand-blue' : 'text-white/70'}`}>
                                    <cat.icon size={18} /><span className="text-[8px] font-black uppercase tracking-tighter leading-none text-center">{cat.label.split(' ')[0]}</span>
                                </button>
                            ))}
                            <button onClick={() => setIsSearchExpanded(!isSearchExpanded)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${isSearchExpanded ? 'text-brand-blue' : 'text-white/70'}`}>
                                <Search size={18} /><span className="text-[8px] font-black uppercase tracking-tighter">Busca</span>
                            </button>
                        </div>
                        {isSearchExpanded && (
                            <div className="animate-fade-in-up pb-2">
                                <input 
                                    type="text" 
                                    placeholder="BUSCAR PRODUTOS..." 
                                    value={searchTerm} 
                                    onChange={e => handleSearch(e.target.value)} 
                                    className="w-full h-12 bg-slate-900 text-white text-base px-4 border border-brand-blue/50 rounded-xl outline-none shadow-[0_0_20px_rgba(56,182,255,0.2)]" 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
