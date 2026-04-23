import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product, UserRole } from '@/src/types';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import {
    Search, LayoutGrid, ShoppingBag, User as UserIcon, 
    ChevronRight, Box, Cpu, Monitor, ExternalLink
} from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import { ProductCard } from './components/ProductCard';
import { Starfield } from '../../../components/ui/Starfield';

const CATEGORIES = [
    { id: 'Todos', label: 'Todos', icon: LayoutGrid },
    { id: 'Impressão 3D', label: 'Impressão 3D', icon: Box },
    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', icon: Cpu },
    { id: 'Soluções Digitais', label: 'Soluções Digitais', icon: Monitor },
];

export const Products: React.FC = () => {
    const { user, role } = useAuth();
    const { cart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const catParam = searchParams.get('cat') || 'Todos';
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        window.scrollTo(0, 0);
        setProducts(mockService.getProducts());
    }, []);

    const handleCategoryChange = (cat: string) => {
        const p = new URLSearchParams();
        if (cat !== 'Todos') p.set('cat', cat);
        setSearchParams(p);
    };

    const filteredProducts = products.filter(p => {
        if (searchTerm) return p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return catParam === 'Todos' || p.category === catParam;
    });

    const getDashboardLink = () => {
        if (role === UserRole.ADMIN) return '/admin/dashboard';
        return '/customer/dashboard';
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-brand-blue/30">
            <Starfield />

            {/* CATEGORY DOCK + SEARCH */}
            <nav className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/5 shadow-2xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6 overflow-hidden py-2">
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.id} 
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap pb-1 border-b-2 ${catParam === cat.id ? 'text-brand-blue border-brand-blue' : 'text-white/30 border-transparent hover:text-white'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                        <div className="hidden lg:flex items-center bg-slate-900 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-brand-blue/50 focus-within:ring-4 focus-within:ring-brand-blue/10 transition-all w-64">
                            <Search size={16} className="text-slate-500" />
                            <input 
                                className="bg-transparent border-none text-[10px] text-white outline-none pl-2 w-full font-bold placeholder:text-slate-600" 
                                placeholder="BUSCAR PRODUTOS..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="text-white/40 hover:text-brand-blue lg:hidden p-2"><Search size={20} /></button>
                    </div>
                </div>
            </nav>

            {/* MAIN BANNER */}
            <section className="container mx-auto px-6 py-8 relative z-10">
                <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-slate-900 rounded-3xl border border-white/5 overflow-hidden relative group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1635332309325-189f7f45b546?q=80&w=2500&auto=format&fit=crop" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                        alt="Banner"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
                        <span className="text-brand-blue font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 animate-fade-in">Novidades 2026</span>
                        <h2 className="text-3xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                            Tecnologia de Ponta<br/>
                            <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">para sua Empresa.</span>
                        </h2>
                    </div>
                </div>
            </section>

            {/* CATEGORY CARDS (3 Columns) */}
            <section className="container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                    { id: 'Impressão 3D', label: 'Impressão 3D', img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop' },
                    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', img: 'https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?q=80&w=1000&auto=format&fit=crop' },
                    { id: 'Soluções Digitais', label: 'Soluções Digitais', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop' }
                ].map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className="h-48 bg-slate-900 rounded-2xl border border-white/5 relative overflow-hidden group transition-all"
                    >
                        <img src={cat.img} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt={cat.label} />
                    </button>
                ))}
            </section>

            {/* PRODUCT GRID - SWISS MINIMALIST HEADER */}
            <section className="container mx-auto px-6 pt-24 pb-32 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 animate-fade-in">
                    <div className="space-y-2">
                        <span className="text-brand-blue font-black uppercase tracking-[0.5em] text-[10px] block opacity-80">Premium Collection</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-[-0.05em] leading-none text-white">
                            Catálogo
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                        <div className="h-px w-12 bg-white/10 hidden md:block"></div>
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                            [ {filteredProducts.length} itens disponíveis ]
                        </span>
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-slate-900/50 rounded-3xl border border-white/5">
                        <p className="text-slate-500 font-bold">Nenhum produto encontrado para "{searchTerm}"</p>
                        <button onClick={() => {setSearchTerm(''); handleCategoryChange('Todos');}} className="mt-4 text-brand-blue text-xs font-black uppercase tracking-widest border-b border-brand-blue/30 pb-1">Ver Tudo</button>
                    </div>
                )}
            </section>

            {/* FOOTER AREA (Simple for now) */}
            <footer className="bg-black py-12 border-t border-white/5 relative z-10">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Box className="text-brand-blue" size={24} />
                        <span className="text-lg font-black uppercase tracking-tighter">Creative<span className="text-brand-blue">Print</span></span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Sobre Nós</a>
                        <a href="#" className="hover:text-white transition-colors">Termos</a>
                        <a href="#" className="hover:text-white transition-colors">Contato</a>
                    </div>
                    <span className="text-[10px] text-slate-700 font-mono">© 2026 CREATIVE PRINT JP</span>
                </div>
            </footer>
        </div>
    );
};
// Trigger deploy #145
