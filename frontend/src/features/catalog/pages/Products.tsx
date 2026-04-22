import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product } from '@/src/types';
import { Search, Grid, Star, BadgeCheck, X, Sparkles, Filter } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { T } from '@/src/contexts/TextContext';
import { Starfield } from '../../../components/ui/Starfield';
import { ProductSlider } from './components/ProductSlider';

export const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    // State from URL
    const catParam = searchParams.get('cat') || 'Todos';

    // Local Filter State
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        const data = mockService.getProducts();
        setProducts(data);
    }, []);

    const handleCategoryChange = (category: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (category === 'Todos') {
            newParams.delete('cat');
        } else {
            newParams.set('cat', category);
        }
        setSearchParams(newParams);
    };

    // CATEGORY TABS CONFIG
    const categoryTabs = [
        { label: 'Todos', value: 'Todos' },
        { label: 'Smart NFC', value: 'Tecnologia NFC' },
        { label: 'Impressão 3D', value: 'Impressão 3D' },
        { label: 'Serviços Digitais', value: 'Serviços Digitais' },
    ];

    // Filtering Logic
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = catParam === 'Todos' || p.category === catParam || (catParam === 'NFC' && p.category.includes('NFC')) || (catParam === '3D' && p.category.includes('3D'));
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="animate-fade-in">
            {/* --- CP GESTÃO STYLE HERO --- */}
            <section id="hero" className="relative min-h-[80vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-8 lg:px-12 overflow-hidden bg-slate-950 animate-fade-in text-center">
                <Starfield />
                
                <div className="w-[90%] md:w-full max-w-5xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up mx-auto">
                        <Sparkles size={14} />
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                        </span>
                        <T k="products_hero_tag" default="Tecnologia •NFC• 3D" />
                    </div>

                    <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter max-w-5xl mx-auto animate-fade-in-up">
                        Sua marca está <span className="bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">conectada ao futuro</span> ou perdendo espaço?
                    </h1>
                    
                    <p className="text-lg md:text-2xl text-brand-gray/90 font-light leading-relaxed max-w-4xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <T k="products_hero_desc" default="Encontre a solução digital perfeita para o seu negócio com tecnologia NFC e Impressão 3D de alta performance." />
                    </p>
                </div>

                {/* Efeito de Luz Pulsante - Top Left */}
                <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#38b6ff] rounded-full blur-[120px] opacity-25 animate-pulse-slow -z-10 pointer-events-none"></div>
                
                {/* Atmosfera Global e Degradê de Fundo */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 -z-10"></div>
                <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[120px] -z-10"></div>
            </section>

            {/* --- SEÇÕES DE DESTAQUE E RECOMENDADOS (ADICIONADAS) --- */}
            <div className="bg-slate-950 pt-12">
                {products.filter(p => p.isFeatured).length > 0 && (
                    <ProductSlider
                        title="Destaques CP"
                        subtitle="Seleção Especial"
                        products={products.filter(p => p.isFeatured)}
                        accentColor="blue"
                    />
                )}

                {products.filter(p => p.isRecommended).length > 0 && (
                    <ProductSlider
                        title="Produtos Recomendados"
                        subtitle="Os favoritos da galera"
                        products={products.filter(p => p.isRecommended)}
                        accentColor="yellow"
                    />
                )}
            </div>

            {/* --- MAIN CONTENT CONTAINER --- */}
            <div className="container mx-auto px-4 py-12 pb-20">
                {/* --- FILTER BAR --- */}
                <div className="flex flex-col gap-6 mb-12 sticky top-24 z-30 bg-slate-950/90 backdrop-blur py-4 border-b border-slate-800 shadow-xl rounded-xl px-4 -mx-4 md:mx-0">
                    <div className="flex w-full items-center">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-blue transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                className="w-full bg-slate-900 text-white pl-10 pr-4 py-3 border border-slate-800 rounded-xl focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue outline-none transition-all placeholder-slate-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-hide items-center">
                        {categoryTabs.map(tab => (
                            <button
                                key={tab.label}
                                onClick={() => handleCategoryChange(tab.value)}
                                className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all border ${catParam === tab.value
                                    ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_15px_rgba(36,155,203,0.4)]'
                                    : 'bg-slate-900 border-slate-800 text-brand-gray hover:border-slate-600 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- PRODUCTS GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full">
                            <EmptyState onReset={() => { setSearchTerm(''); handleCategoryChange('Todos'); }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
    <div className="text-center py-32 text-slate-600 bg-slate-900/50 rounded-3xl border border-slate-800/50 border-dashed w-full">
        <Filter className="mx-auto mb-6 opacity-30" size={64} />
        <h3 className="text-xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
        <p className="text-sm">Tente ajustar seus filtros de busca ou categoria.</p>
        <button
            onClick={onReset}
            className="mt-6 text-brand-blue hover:text-white font-bold flex items-center justify-center gap-2 mx-auto"
        >
            <X size={16} /> Limpar filtros
        </button>
    </div>
);
