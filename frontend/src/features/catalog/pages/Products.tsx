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
    {
        id: 'Impressão 3D',
        label: 'Impressão 3D',
        icon: Box,
        color: 'brand-pink',
    },
    {
        id: 'Tecnologia NFC',
        label: 'Tecnologia NFC',
        icon: Cpu,
        color: 'brand-blue',
    },
    {
        id: 'Soluções Digitais',
        label: 'Soluções Digitais',
        icon: Monitor,
        color: 'brand-yellow',
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
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());
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

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col overflow-x-hidden">
            {/* HERO SECTION — MAIS ALTA E COM BOTÕES INTERNOS */}
            <section
                id="hero"
                className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden text-center animate-fade-in"
            >
                {/* Fundo Claro Tecnológico (Ice Blue / White) */}
                <div className="absolute inset-0 bg-[#f8fafc] -z-30"></div>
                <div className="absolute inset-0 opacity-[0.03] -z-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Starfield (Estrelas Escuras para fundo claro) */}
                <Starfield />

                {/* Efeitos de Luz Suaves */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-white via-transparent to-[#f8fafc] -z-10"></div>
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] -z-10"></div>

                <div className="relative z-10 max-w-6xl mx-auto w-full">
                    <h1 className="text-6xl md:text-[100px] font-black text-slate-900 mb-8 leading-[0.95] tracking-tighter animate-fade-in-up">
                        Conheça nossos<br/>
                        <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
                            produtos
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Soluções digitais, NFC e Impressão 3D com tecnologia de ponta.
                    </p>

                    {/* BOTÕES DE CATEGORIA COMPACTOS (DENTRO DA HERO) */}
                    <div className="max-w-4xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {/* Grade de 5 Itens */}
                        {!isSearchExpanded ? (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                <button
                                    onClick={() => handleCategoryChange('Todos')}
                                    className={`h-14 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                        catParam === 'Todos'
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105'
                                            : 'bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue shadow-sm'
                                    }`}
                                >
                                    Todos os produtos
                                </button>

                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`h-14 flex items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                            catParam === cat.id
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105'
                                                : 'bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue shadow-sm'
                                        }`}
                                    >
                                        <cat.icon size={16} />
                                        <span className="hidden sm:inline">{cat.label}</span>
                                        <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                                    </button>
                                ))}

                                <button
                                    onClick={() => setIsSearchExpanded(true)}
                                    className="h-14 flex items-center justify-center bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-400 rounded-2xl hover:border-brand-blue hover:text-brand-blue shadow-sm transition-all"
                                >
                                    <Search size={20} />
                                </button>
                            </div>
                        ) : (
                            /* Modo Busca na Hero */
                            <div className="flex items-center gap-3 animate-fade-in">
                                <button 
                                    onClick={() => setIsSearchExpanded(false)}
                                    className="h-14 w-14 flex items-center justify-center bg-white border-2 border-slate-200 text-slate-400 rounded-2xl hover:border-brand-blue hover:text-brand-blue"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <div className="relative flex-1">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-blue" size={20} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="O QUE VOCÊ ESTÁ PROCURANDO HOJE?"
                                        value={searchTerm}
                                        onChange={e => handleSearch(e.target.value)}
                                        className="w-full h-14 bg-white text-slate-900 text-sm pl-14 pr-12 border-2 border-brand-blue/30 rounded-2xl outline-none focus:border-brand-blue shadow-xl font-bold uppercase tracking-widest placeholder-slate-400"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => handleSearch('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ============================================================
                VALUE BAR (Marquee Compacto e Estreito)
            ============================================================ */}
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

            {/* ============================================================
                GRID DE PRODUTOS (INÍCIO DO CATÁLOGO)
            ============================================================ */}
            <div className="container mx-auto px-4 py-16 pb-32 flex-grow">
                {/* Header de Resultados (SÓ APARECE AO FILTRAR) */}
                {isFiltering && (
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 border-l-4 border-brand-blue pl-6 py-2">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                                {catParam !== 'Todos' ? catParam : 'Todos os Produtos'}
                                {subParam && <span className="text-brand-pink ml-3">/ {subParam}</span>}
                            </h2>
                            <p className="text-slate-500 font-medium">{filteredProducts.length} itens encontrados</p>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-brand-blue/20 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-white/10"
                        >
                            <X size={14} /> Limpar Filtros
                        </button>
                    </div>
                )}

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
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

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-24 w-full animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-slate-800/30 border-2 border-brand-blue/20 flex items-center justify-center mx-auto mb-8">
            <Filter className="opacity-20 text-brand-blue" size={40} />
        </div>
        <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Nenhum resultado</h3>
        <button
            onClick={onReset}
            className="px-8 py-4 rounded-2xl bg-brand-blue text-slate-950 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_25px_rgba(56,182,255,0.4)]"
        >
            Ver tudo
        </button>
    </div>
);
