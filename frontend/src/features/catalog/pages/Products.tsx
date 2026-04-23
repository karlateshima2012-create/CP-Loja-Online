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

            {/* TOP HEADER: Logo, Entrar, Carrinho */}
            <header className="container mx-auto px-6 py-8 flex items-center justify-between border-b border-white/5 relative z-10">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="flex items-center gap-3">
                        <div className="grid grid-cols-2 gap-0.5 w-9 h-9">
                            <div className="bg-[#E5157A] rounded-sm"></div>
                            <div className="bg-[#38B6FF] rounded-sm"></div>
                            <div className="bg-[#FFDE59] rounded-sm"></div>
                            <div className="bg-[#FFFFFF] rounded-sm"></div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-black tracking-tighter uppercase text-white">Creative<span className="text-brand-blue">Print</span></span>
                            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">Tecnologia e Impressão 3D</span>
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-8">
                    {user ? (
                        <Link to={getDashboardLink()} className="flex items-center gap-3 hover:text-brand-blue transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden group-hover:border-brand-blue/50 transition-all shadow-lg">
                                <img src={user.avatar || "https://i.pravatar.cc/150?u=admin"} className="w-full h-full object-cover" alt="Profile" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest hidden md:block">{user.name.split(' ')[0]}</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-brand-blue/20">Entrar</Link>
                    )}
                    
                    <Link to="/cart" className="relative group">
                        <div className="w-12 h-12 bg-slate-900 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:border-brand-blue group-hover:text-brand-blue transition-all shadow-xl">
                            <ShoppingBag size={22} />
                        </div>
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(229,21,122,0.6)] animate-pulse">
                                {cart.reduce((acc, i) => acc + (Number(i.quantity) || 0), 0)}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            {/* CATEGORY DOCK + SEARCH */}
            <nav className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/5 shadow-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-10 overflow-x-auto no-scrollbar py-2">
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.id} 
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`text-xs font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap pb-1 border-b-2 ${catParam === cat.id ? 'text-brand-blue border-brand-blue' : 'text-white/30 border-transparent hover:text-white'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 border-l border-white/10 pl-8 ml-4">
                        <div className="hidden lg:flex items-center bg-slate-900 border border-white/10 rounded-2xl px-5 py-2.5 focus-within:border-brand-blue/50 focus-within:ring-4 focus-within:ring-brand-blue/10 transition-all w-80">
                            <Search size={18} className="text-slate-500" />
                            <input 
                                className="bg-transparent border-none text-xs text-white outline-none pl-3 w-full font-bold placeholder:text-slate-600" 
                                placeholder="BUSCAR PRODUTOS..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="text-white/40 hover:text-brand-blue lg:hidden p-2"><Search size={24} /></button>
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
                        <div className="mt-8 flex gap-4">
                            <button className="bg-brand-blue text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:shadow-[0_0_30px_rgba(36,155,203,0.5)] transition-all">Explorar</button>
                            <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest border border-white/10 transition-all">Saiba mais</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORY CARDS (3 Columns) */}
            <section className="container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                    { id: 'Impressão 3D', label: 'Impressão 3D', icon: Box, img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop', color: 'from-blue-500/20' },
                    { id: 'Tecnologia NFC', label: 'Tecnologia NFC', icon: Cpu, img: 'https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?q=80&w=1000&auto=format&fit=crop', color: 'from-pink-500/20' },
                    { id: 'Soluções Digitais', label: 'Soluções Digitais', icon: Monitor, img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', color: 'from-cyan-500/20' }
                ].map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className="h-48 bg-slate-900 rounded-2xl border border-white/5 relative overflow-hidden group shadow-xl hover:border-brand-blue/30 transition-all"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-black/80 z-10`}></div>
                        <img src={cat.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt={cat.label} />
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
                            <cat.icon className="text-brand-blue group-hover:scale-110 transition-transform" size={32} />
                            <span className="text-sm font-black uppercase tracking-widest">{cat.label}</span>
                        </div>
                        <div className="absolute bottom-4 right-4 z-20 w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-slate-950 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                            <ChevronRight size={18} />
                        </div>
                    </button>
                ))}
            </section>

            {/* PRODUCT GRID */}
            <section className="container mx-auto px-6 py-12 pb-32 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/40">Destaques</h3>
                    <div className="flex-grow h-[1px] bg-white/5 mx-8"></div>
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
