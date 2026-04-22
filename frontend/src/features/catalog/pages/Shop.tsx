
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product, Partner } from '@/src/types';
import { Search, Filter, ArrowRight, BadgeCheck, Star, X, Grid } from 'lucide-react';
import { ProductSlider } from './components/ProductSlider';
import { ProductCard } from './components/ProductCard';

// IMPORTING ISOLATED HEADERS
import { HomeHero } from './components/HomeHero';
import { PartnerHeader } from './components/PartnerHeader';

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  
  // URL Params management
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams<{ slug: string }>();
  
  // Logic: Prefer route param, fallback to query param
  const partnerSlug = slug || searchParams.get('partner');
  const catParam = searchParams.get('cat') || 'Todos';
  const viewParam = searchParams.get('view'); // Controla se estamos vendo o catálogo explicitamente
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [showPartnerExclusives, setShowPartnerExclusives] = useState(false);
  
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);

  // DETERMINA SE É A HOME (LANDING) OU A PÁGINA DE PRODUTOS
  // É Landing se: Sem parceiro, sem busca, categoria Todos, sem filtro de exclusivos E não forçado para view='catalog'
  const isLandingContext = !partnerSlug && !searchTerm && catParam === 'Todos' && !showPartnerExclusives && viewParam !== 'catalog';
  
  // Estado local para forçar a renderização correta
  const [showCatalog, setShowCatalog] = useState(!isLandingContext);

  useEffect(() => {
    setPartners(mockService.getPartners());
    let data = mockService.getProducts();
    
    // Partner Mode Logic (Loja do Parceiro)
    if (partnerSlug) {
      const partner = mockService.getPartnerBySlug(partnerSlug);
      if (partner) {
        setCurrentPartner(partner);
        data = mockService.getPartnerProducts(partner.id);
      }
    } else {
        setCurrentPartner(null);
    }

    setProducts(data);
    
    // Sincroniza estado visual com a lógica de URL
    setShowCatalog(!isLandingContext);

  }, [partnerSlug, isLandingContext]);

  // Ação para abrir o Catálogo (Simula navegação para "Página de Produtos")
  const revealCatalog = () => {
      // Atualiza URL para manter estado se der refresh
      const newParams = new URLSearchParams(searchParams);
      newParams.set('view', 'catalog');
      setSearchParams(newParams);
      
      // Scroll suave para o topo do grid
      setTimeout(() => {
          document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  };

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'Todos') {
      newParams.delete('cat');
    } else {
      newParams.set('cat', category);
      newParams.set('view', 'catalog'); // Força a visão de catálogo ao clicar em categoria
    }
    setSearchParams(newParams);
  };

  // DEFINIÇÃO DAS ABAS DE FILTRO
  const categoryTabs = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Smart NFC', value: 'Tecnologia NFC' },
    { label: 'Impressão 3D', value: 'Impressão 3D' },
    { label: 'Sistemas Web', value: 'Serviços Digitais' },
  ];

  // Filtering Logic for GRID
  const filteredProducts = products.filter(p => {
    // 1. Search
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category
    const matchesCategory = catParam === 'Todos' || p.category === catParam || (catParam === 'NFC' && p.category.includes('NFC')) || (catParam === '3D' && p.category.includes('3D'));
    
    // 3. Partner Exclusives Filter
    const matchesPartnerExclusive = showPartnerExclusives ? (p.isExclusive && !!p.partnerId) : true;

    // Stock Filter Removed
    return matchesSearch && matchesCategory && matchesPartnerExclusive;
  });

  // Split filtered products for Partner View
  const partnerExclusives = currentPartner ? filteredProducts.filter(p => p.isExclusive && p.partnerId === currentPartner.id) : [];
  const partnerResell = currentPartner ? filteredProducts.filter(p => !p.isExclusive || p.partnerId !== currentPartner.id) : [];


  // Featured Groups (Apenas para Home View)
  // Stock filter removed here as well
  const featuredCPProducts = products.filter(p => !p.isExclusive).slice(0, 6);
  const recommendedProducts = products.filter(p => !p.isExclusive).slice(2, 10).reverse(); 

  return (
    <div className="space-y-12 pb-12 animate-fade-in">
      
      {/* --- HERO SECTION ISOLADA --- */}
      {currentPartner ? (
          <PartnerHeader partner={currentPartner} />
      ) : (
          <HomeHero onScrollToGrid={revealCatalog} />
      )}

      {/* --- MODO LANDING (HOME) --- */}
      {/* Exibe Destaques e Atalhos. Esconde Filtros e Grid. */}
      {!showCatalog && (
        <div className="animate-fade-in">
           {/* Featured Products Slider */}
           {featuredCPProducts.length > 0 && (
             <ProductSlider 
                title="Destaques CP" 
                subtitle="Qualidade Creative Print" 
                products={featuredCPProducts} 
                partnerSlug={partnerSlug} 
                partnersList={partners}
                accentColor="blue"
                onViewAll={revealCatalog}
             />
           )}

          {/* Recommended Products Slider */}
          {recommendedProducts.length > 0 && (
             <ProductSlider 
                title="Produtos Recomendados" 
                subtitle="Seleção Especial" 
                products={recommendedProducts} 
                partnerSlug={partnerSlug} 
                partnersList={partners}
                accentColor="yellow"
             />
          )}
        </div>
      )}

      {/* --- MODO CATÁLOGO (PRODUTOS) --- */}
      {/* Exibe Filtros e Grid. Ativado se houver busca, categoria ou clique em "Ver Produtos" */}
      {showCatalog && (
        <div id="products-grid" className="container mx-auto px-4 pt-8 border-t border-slate-800 animate-fade-in-up">
            
            {/* Header Catalogo */}
            <div className="mb-8 flex items-center gap-3">
                <div className="bg-gradient-to-br from-brand-blue to-brand-pink p-2 rounded-lg text-white">
                    <Grid size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">Catálogo de Produtos</h2>
                    <p className="text-sm text-slate-400">Explore nossa coleção completa</p>
                </div>
            </div>

            {/* --- FILTER BAR --- */}
            <div className="flex flex-col gap-6 mb-8 sticky top-20 z-30 bg-slate-950/90 backdrop-blur py-4 border-b border-slate-800 shadow-xl rounded-xl px-4 -mx-4 md:mx-0">
            
            <div className="flex w-full items-center">
                
                {/* Search Input */}
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

            {/* Category Tabs (Scrollable) */}
            <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-hide items-center">
                {categoryTabs.map(tab => (
                <button
                    key={tab.label}
                    onClick={() => handleCategoryChange(tab.value)}
                    className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all border ${
                    catParam === tab.value 
                        ? 'bg-brand-blue border-brand-blue text-white shadow-[0_0_15px_rgba(36,155,203,0.4)]' 
                        : 'bg-slate-900 border-slate-800 text-brand-gray hover:border-slate-600 hover:text-white'
                    }`}
                >
                    {tab.label}
                </button>
                ))}

                {/* FILTRO EXCLUSIVOS DE PARCEIROS (Ao lado de Sistemas Web) */}
                {!partnerSlug && (
                    <>
                        <div className="w-px h-8 bg-slate-800 mx-2 shrink-0"></div>
                        <button 
                            onClick={() => setShowPartnerExclusives(!showPartnerExclusives)}
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-bold whitespace-nowrap ${
                                showPartnerExclusives 
                                ? 'bg-brand-yellow/20 border-brand-yellow text-brand-yellow shadow-[0_0_15px_rgba(255,242,0,0.2)]' 
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                            }`}
                        >
                            <Star size={16} fill={showPartnerExclusives ? "currentColor" : "none"} />
                            Exclusivos de Parceiros
                        </button>
                    </>
                )}
            </div>

            </div>

            {/* --- PRODUCTS GRID --- */}
            {currentPartner ? (
            /* PARTNER VIEW: SPLIT SECTIONS */
            <div className="space-y-16">
                
                {/* Section 1: Exclusives */}
                {partnerExclusives.length > 0 && (
                    <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-brand-yellow/10 p-2 rounded-lg border border-brand-yellow/30 text-brand-yellow">
                        <Star size={24} fill="currentColor" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Produtos Exclusivos {currentPartner.name}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {partnerExclusives.map(product => (
                            <ProductCard key={product.id} product={product} partnerSlug={partnerSlug} partnersList={partners} />
                        ))}
                    </div>
                    </div>
                )}

                {/* Section 2: Resell / Curated */}
                {partnerResell.length > 0 && (
                    <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-brand-blue/10 p-2 rounded-lg border border-brand-blue/30 text-brand-blue">
                        <BadgeCheck size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Curadoria Creative Print</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {partnerResell.map(product => (
                            <ProductCard key={product.id} product={product} partnerSlug={partnerSlug} partnersList={partners} />
                        ))}
                    </div>
                    </div>
                )}

                {filteredProducts.length === 0 && (
                    <EmptyState onReset={() => { setSearchTerm(''); handleCategoryChange('Todos'); setShowPartnerExclusives(false); }} />
                )}
            </div>
            ) : (
            /* GENERAL SHOP VIEW: STANDARD GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} partnerSlug={partnerSlug} partnersList={partners} />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full">
                        <EmptyState onReset={() => { setSearchTerm(''); handleCategoryChange('Todos'); setShowPartnerExclusives(false); }} />
                    </div>
                )}
            </div>
            )}

        </div>
      )}
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
      <X size={16}/> Limpar filtros
    </button>
  </div>
);
