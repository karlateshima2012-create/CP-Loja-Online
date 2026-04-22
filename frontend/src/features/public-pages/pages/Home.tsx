
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product, Partner, Testimonial, TestimonialSource } from '@/src/types';

// ISOLATED COMPONENTS IMPORT
import { HomeHero } from '../../catalog/pages/components/HomeHero';
import { PartnerHeader } from '../../catalog/pages/components/PartnerHeader';
import { HomeSegments } from '../../catalog/pages/components/HomeSegments';
import { HomeFAQ } from '../../catalog/pages/components/HomeFAQ';

import { ProductSlider } from '../../catalog/pages/components/ProductSlider';
import { ProductCard } from '../../catalog/pages/components/ProductCard';
import { Smartphone, Layers, Cpu, ArrowRight, Grid, ChevronDown, Zap, Wifi, Box, Monitor, Star, Chrome, Instagram, MessageCircle, Mail, Quote, ChevronLeft, ChevronRight, CheckCircle, Package, Globe, HelpCircle, Plus, Minus, MapPin, Heart, Rocket, BadgeCheck, Bot, User, CreditCard, ShoppingBag, Store } from 'lucide-react';
import { T, useText } from '@/src/contexts/TextContext';

export const Home: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState<Product[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    // Ref para o carrossel de depoimentos
    const testimonialsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPartners(mockService.getPartners());

        // Filter only approved testimonials for public display
        const allTestimonials = mockService.getTestimonials();
        setTestimonials(allTestimonials.filter(t => t.approved));

        let data = mockService.getProducts();

        // Partner Mode Logic
        if (slug) {
            const partner = mockService.getPartnerBySlug(slug);
            if (partner) {
                setCurrentPartner(partner);
                // Load only partner relevant products (Exclusives + Affiliates)
                data = mockService.getPartnerProducts(partner.id);
            }
        } else {
            setCurrentPartner(null);
        }

        setProducts(data);
    }, [slug]);

    // Handle Hash Scroll (Navigation from Footer)
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    const offset = 100; // Header offset
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location, products]);

    const handleNavigateToCatalog = (category?: string) => {
        const baseUrl = slug ? `/parceiro/${slug}/produtos` : '/produtos';
        const query = category ? `?cat=${category}` : '';
        navigate(`${baseUrl}${query}`);
        window.scrollTo(0, 0);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Header height offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Scroll Handler para Depoimentos
    const scrollTestimonials = (direction: 'left' | 'right') => {
        if (testimonialsRef.current) {
            const { current } = testimonialsRef;
            const scrollAmount = 400;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    // Helper para ícones de depoimentos estilizados
    const getSourceIcon = (source: TestimonialSource) => {
        switch (source) {
            case TestimonialSource.GOOGLE:
                return <div className="p-2 bg-white rounded-full shadow-lg shadow-white/10"><Chrome size={18} className="text-slate-900" /></div>;
            case TestimonialSource.INSTAGRAM:
                return <div className="p-2 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full shadow-lg shadow-pink-500/20 text-white"><Instagram size={18} /></div>;
            case TestimonialSource.WHATSAPP:
                return <div className="p-2 bg-[#25D366] rounded-full shadow-lg shadow-green-500/20 text-white"><MessageCircle size={18} /></div>;
            case TestimonialSource.EMAIL:
                return <div className="p-2 bg-slate-200 rounded-full shadow-lg text-slate-700"><Mail size={18} /></div>;
            case TestimonialSource.STORE:
                return <div className="p-2 bg-brand-yellow rounded-full shadow-lg text-slate-900"><Store size={18} /></div>;
            default:
                return <Star size={18} />;
        }
    };

    // --- LOGICA DE FILTROS ---
    const partnerExclusiveProducts = currentPartner ? products.filter(p => p.isExclusive && p.partnerId === currentPartner.id) : [];
    const partnerResellProducts = currentPartner ? products.filter(p => !p.isExclusive) : [];

    // New Logic: Filter by admin flags
    const featuredCPProducts = products.filter(p => p.isFeatured);
    const recommendedProducts = products.filter(p => p.isRecommended);

    return (
        <div className="space-y-12 pb-0 animate-fade-in bg-slate-950 overflow-x-hidden">

            {/* --- HERO SECTION ISOLADA --- */}
            {currentPartner ? (
                <PartnerHeader partner={currentPartner} />
            ) : (
                <HomeHero onScrollToGrid={() => handleNavigateToCatalog()} />
            )}

            {/* =====================================================================================
          MODO PARCEIRO: VITRINE EXCLUSIVA
         ===================================================================================== */}
            {currentPartner ? (
                <div className="container mx-auto px-4 mb-16 animate-fade-in-up">

                    {/* 1. SEÇÃO DE EXCLUSIVOS (Highlight) */}
                    {partnerExclusiveProducts.length > 0 && (
                        <div className="mb-20">
                            <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
                                <div className="bg-brand-yellow p-2 rounded-lg text-slate-900 shadow-lg shadow-brand-yellow/20">
                                    <Star size={24} fill="black" />
                                </div>
                                <div>
                                    <div className="text-brand-yellow font-bold uppercase tracking-wider text-xs mb-1">Coleção Exclusiva</div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white">
                                        Produtos {currentPartner.name}
                                    </h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {partnerExclusiveProducts.map(product => (
                                    <div key={product.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                                        <ProductCard product={product} partnerSlug={slug || null} partnersList={partners} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. SEÇÃO DE INDICAÇÕES (Revenda) */}
                    {partnerResellProducts.length > 0 && (
                        <ProductSlider
                            title={`Indicações de ${currentPartner.name}`}
                            subtitle="Tecnologia & Inovação"
                            products={partnerResellProducts}
                            partnerSlug={slug || null}
                            partnersList={partners}
                            accentColor="blue"
                            onViewAll={() => handleNavigateToCatalog()}
                        />
                    )}
                </div>
            ) : (
                /* =====================================================================================
                   MODO HOME PADRÃO (Sem Parceiro)
                   ===================================================================================== */
                <>
                    {/* --- INFORMATIVE ANCHOR CARDS ISOLADOS --- */}
                    <HomeSegments scrollToSection={scrollToSection} />

                    {/* --- FEATURED SLIDER (DESTAQUES CP) --- */}
                    {featuredCPProducts.length > 0 && (
                        <div id="destaques">
                            <ProductSlider
                                title="Destaques CP"
                                subtitle="Qualidade Garantida"
                                products={featuredCPProducts}
                                partnerSlug={null}
                                partnersList={partners}
                                accentColor="blue"
                                onViewAll={() => handleNavigateToCatalog()}
                            />
                        </div>
                    )}

                    {/* --- RECOMMENDED SLIDER (PRODUTOS RECOMENDADOS) --- */}
                    {recommendedProducts.length > 0 && (
                        <div id="recomendados">
                            <ProductSlider
                                title="Produtos Recomendados"
                                subtitle="Seleção Especial"
                                products={recommendedProducts}
                                partnerSlug={null}
                                partnersList={partners}
                                accentColor="yellow"
                            />
                        </div>
                    )}
                </>
            )}

            {/* --- SEÇÕES DE CONTEÚDO (Home Landing Only) --- */}
            {!currentPartner && (
                <>
                    <div id="info-nfc" className="bg-slate-900 border-y border-slate-800 py-32 scroll-mt-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col lg:flex-row items-center gap-16">
                                <div className="flex-1 order-2 lg:order-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold uppercase tracking-wider mb-6">
                                        <Wifi size={14} /> Conexão por Aproximação
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                                        <T k="home_nfc_title" default="Cartão inteligente com tecnologia NFC" />
                                    </h2>
                                    <p className="text-lg text-slate-400 mb-6 leading-relaxed max-w-xl">
                                        <T k="home_nfc_desc" default="A tecnologia Smart NFC permite compartilhar seus dados apenas aproximando o smartphone." />
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 bg-brand-blue p-1 rounded-full"><ChevronDown size={12} className="text-slate-900 rotate-[-90deg]" /></div>
                                            <span className="text-slate-300"><T k="home_nfc_feat_1" default="Sem necessidade de aplicativos para ler (nativo no iPhone e Android)." /></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 bg-brand-blue p-1 rounded-full"><ChevronDown size={12} className="text-slate-900 rotate-[-90deg]" /></div>
                                            <span className="text-slate-300"><T k="home_nfc_feat_2" default="Atualize seus dados online sem precisar reimprimir o cartão físico." /></span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 bg-brand-blue p-1 rounded-full"><ChevronDown size={12} className="text-slate-900 rotate-[-90deg]" /></div>
                                            <span className="text-slate-300"><T k="home_nfc_feat_3" default="Ecologicamente correto: 1 cartão substitui milhares de papéis." /></span>
                                        </li>
                                    </ul>
                                    <button onClick={() => handleNavigateToCatalog('Tecnologia NFC')} className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-brand-blue/20 transform hover:-translate-y-1">
                                        <T k="home_nfc_btn" default="Ver Produtos NFC" /> <ArrowRight size={20} />
                                    </button>
                                </div>

                                <div className="hidden lg:flex flex-1 order-1 lg:order-2 justify-center">
                                    <div className="relative w-full max-w-md aspect-square flex items-center justify-center group">
                                        <div className="absolute -inset-4 bg-gradient-to-tr from-brand-blue/20 via-brand-blue/5 to-transparent rounded-[2.5rem] rotate-3 group-hover:rotate-6 transition-transform duration-500 border border-brand-blue/20 overflow-hidden opacity-60">
                                            <div className="absolute inset-0"
                                                style={{
                                                    backgroundImage: 'linear-gradient(rgba(56, 182, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 182, 255, 0.1) 1px, transparent 1px)',
                                                    backgroundSize: '30px 30px'
                                                }}>
                                            </div>
                                        </div>

                                        <div className="relative z-10 w-full h-full bg-slate-900 rounded-[2.5rem] border border-brand-blue/20 shadow-[0_0_50px_rgba(56,182,255,0.05)] flex items-center justify-center overflow-hidden">
                                            <Smartphone size={180} className="absolute top-8 left-8 text-brand-blue opacity-20 transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500" />
                                            <div className="absolute bottom-12 right-10 group-hover:scale-110 transition-transform duration-500">
                                                <div className="relative transform rotate-6 group-hover:rotate-12 transition-transform duration-500">
                                                    <CreditCard size={140} className="text-brand-blue drop-shadow-[0_0_30px_rgba(56,182,255,0.4)]" />
                                                    <Wifi size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-blue/80 animate-pulse" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-10 left-10 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-xs text-brand-blue font-mono z-10 shadow-lg">
                                                TECNOLOGIA NFC
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="info-3d" className="py-32 scroll-mt-20 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col lg:flex-row items-center gap-16">
                                <div className="hidden lg:flex flex-1 justify-center">
                                    <div className="relative w-full max-w-md aspect-square flex items-center justify-center group">
                                        <div className="absolute -inset-4 bg-gradient-to-tr from-brand-yellow/20 via-brand-yellow/5 to-transparent rounded-[2.5rem] -rotate-3 group-hover:-rotate-6 transition-transform duration-500 border border-brand-yellow/20 overflow-hidden opacity-60">
                                            <div className="absolute inset-0"
                                                style={{
                                                    backgroundImage: 'linear-gradient(rgba(255, 242, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 242, 0, 0.1) 1px, transparent 1px)',
                                                    backgroundSize: '30px 30px'
                                                }}>
                                            </div>
                                        </div>

                                        <div className="relative z-10 w-full h-full bg-slate-900 rounded-[2.5rem] border border-brand-yellow/20 shadow-[0_0_50px_rgba(255,242,0,0.05)] flex items-center justify-center overflow-hidden">
                                            <Layers size={180} className="absolute top-8 left-8 text-brand-yellow opacity-20 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                                            <div className="absolute bottom-12 right-12 group-hover:scale-110 transition-transform duration-500">
                                                <Box size={140} className="text-brand-yellow drop-shadow-[0_0_30px_rgba(255,242,0,0.4)] transform rotate-12 group-hover:rotate-6 transition-transform duration-500" />
                                            </div>
                                            <div className="absolute bottom-10 left-10 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-xs text-brand-yellow font-mono z-10 shadow-lg">
                                                IMPRESSÃO 3D
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase tracking-wider mb-6">
                                        <Box size={14} /> Personalização Física
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                                        <T k="home_3d_title" default="Do Digital para o Mundo Real" />
                                    </h2>
                                    <p className="text-lg text-slate-400 mb-6 leading-relaxed max-w-xl">
                                        <T k="home_3d_desc_1" default="Nossa farm de impressão 3D utiliza materiais biodegradáveis de alta qualidade para criar objetos únicos. Displays QR Code com sua logo em relevo, brindes corporativos e peças de reposição." />
                                    </p>
                                    <p className="text-slate-400 mb-8 leading-relaxed max-w-xl">
                                        <T k="home_3d_desc_2" default="Diferente da produção em massa, a impressão 3D permite que cada peça seja única, com cores e formatos adaptados exatamente à identidade visual da sua marca." />
                                    </p>
                                    <button onClick={() => handleNavigateToCatalog('Impressão 3D')} className="bg-brand-yellow hover:bg-brand-yellow/90 text-slate-900 px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-brand-yellow/20 transform hover:-translate-y-1">
                                        <T k="home_3d_btn" default="Ver Itens 3D" /> <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="info-web" className="bg-slate-900 border-t border-slate-800 py-32 scroll-mt-20 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col lg:flex-row items-center gap-16">
                                <div className="flex-1 order-2 lg:order-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/30 text-brand-pink text-xs font-bold uppercase tracking-wider mb-6">
                                        <Cpu size={14} /> Serviços Digitais
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                                        <T k="home_web_title" default="Sua Empresa Aberta 24 Horas" />
                                    </h2>
                                    <p className="text-lg text-slate-400 mb-6 leading-relaxed max-w-xl">
                                        <T k="home_web_desc" default="Soluções digitais que transformam visitantes em clientes. Landing Pages de alta conversão e sistemas integrados perfeitamente ao ecossistema físico." />
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-lg">
                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-brand-pink/30 transition-colors">
                                            <h4 className="text-white font-bold mb-1">Landing Pages</h4>
                                            <p className="text-xs text-slate-500">Páginas focadas em vendas e captura de leads.</p>
                                        </div>
                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-brand-pink/30 transition-colors">
                                            <h4 className="text-white font-bold mb-1">Lojas Virtuais</h4>
                                            <p className="text-xs text-slate-500">Venda seus produtos online com gestão fácil.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleNavigateToCatalog('Serviços Digitais')} className="bg-brand-pink hover:bg-brand-pink/90 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-brand-pink/20 transform hover:-translate-y-1">
                                        <T k="home_web_btn" default="Ver Serviços Digitais" /> <ArrowRight size={20} />
                                    </button>
                                </div>
                                <div className="hidden lg:flex flex-1 order-1 lg:order-2 justify-center">
                                    <div className="relative w-full max-w-md aspect-square flex items-center justify-center group">
                                        <div className="absolute -inset-4 bg-gradient-to-tr from-brand-pink/20 via-brand-pink/5 to-transparent rounded-[2.5rem] rotate-3 group-hover:rotate-6 transition-transform duration-500 border border-brand-pink/20 overflow-hidden opacity-60">
                                            <div className="absolute inset-0"
                                                style={{
                                                    backgroundImage: 'linear-gradient(rgba(229, 21, 122, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 21, 122, 0.1) 1px, transparent 1px)',
                                                    backgroundSize: '30px 30px'
                                                }}>
                                            </div>
                                        </div>

                                        <div className="relative z-10 w-full h-full bg-slate-900 rounded-[2.5rem] border border-brand-pink/20 shadow-[0_0_50px_rgba(229,21,122,0.05)] flex items-center justify-center overflow-hidden">
                                            <Monitor size={180} className="absolute top-10 left-8 text-brand-pink opacity-20 transform group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute bottom-10 right-12 group-hover:translate-x-2 transition-transform duration-500">
                                                <Smartphone size={100} className="text-brand-pink drop-shadow-[0_0_30px_rgba(229,21,122,0.4)] transform -rotate-6 border-4 border-slate-800 rounded-2xl bg-slate-900" />
                                            </div>
                                            <div className="absolute bottom-10 left-10 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-xs text-brand-pink font-mono flex items-center gap-2 z-10 shadow-lg">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SERVIÇOS DIGITAIS
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* --- SOCIAL PROOF --- */}
            <div className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative border-t border-slate-800/50 group/carousel">
                {/* ... (Existing Testimonials Code remains here as it's complex to extract without prop drilling the ref, but it's isolated enough visually) ... */}
                <div className="container mx-auto px-4 mb-8 flex justify-between items-end relative z-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><T k="home_social_title" default="Quem usa, recomenda" /></h2>
                        <p className="text-slate-400"><T k="home_social_desc" default="Junte-se a centenas de empreendedores..." /></p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scrollTestimonials('left')} className="p-3 rounded-full bg-slate-800 text-white hover:bg-brand-blue hover:text-white transition-all shadow-lg border border-slate-700 hover:border-brand-blue"><ChevronLeft size={20} /></button>
                        <button onClick={() => scrollTestimonials('right')} className="p-3 rounded-full bg-slate-800 text-white hover:bg-brand-blue hover:text-white transition-all shadow-lg border border-slate-700 hover:border-brand-blue"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

                <div
                    ref={testimonialsRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-8 pb-12 pt-4 snap-x"
                >
                    {testimonials.map((test) => (
                        <div key={test.id} className="min-w-[320px] md:min-w-[400px] bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl relative group hover:bg-slate-900 hover:border-slate-700 hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 snap-center flex flex-col">
                            <div className="absolute top-4 right-6 text-slate-800 opacity-50 group-hover:text-brand-blue/20 transition-colors pointer-events-none">
                                <Quote size={80} fill="currentColor" />
                            </div>
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 p-0.5 border border-slate-700 group-hover:border-brand-blue/50 transition-colors shadow-lg">
                                    {test.avatarUrl ? (
                                        <img src={test.avatarUrl} className="w-full h-full rounded-full object-cover" alt={test.name} />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg uppercase bg-gradient-to-br from-slate-800 to-slate-900">
                                            {test.name.substring(0, 2)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg leading-tight group-hover:text-brand-blue transition-colors">{test.name}</div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{test.role || 'Cliente'}</div>
                                </div>
                                <div className="ml-auto transform group-hover:scale-110 transition-transform duration-300">
                                    {getSourceIcon(test.source)}
                                </div>
                            </div>
                            <div className="flex-1 relative z-10">
                                <p className="text-slate-300 text-base italic leading-relaxed mb-6">"{test.content}"</p>
                            </div>
                            <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center relative z-10">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < test.rating ? "#FFF200" : "none"} className={i < test.rating ? "text-brand-yellow drop-shadow-md" : "text-slate-700"} />
                                    ))}
                                </div>
                                <div className="text-xs text-slate-600 font-mono">
                                    {new Date(test.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="min-w-[300px] bg-gradient-to-br from-brand-blue/10 to-transparent border border-brand-blue/30 border-dashed p-8 rounded-2xl flex flex-col items-center justify-center text-center snap-center hover:bg-brand-blue/20 transition-colors cursor-pointer group" onClick={() => handleNavigateToCatalog()}>
                        <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-blue/30 mb-6 group-hover:scale-110 transition-transform">
                            <Star size={32} fill="white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Sua vez de brilhar</h3>
                        <p className="text-sm text-brand-blue font-bold uppercase tracking-wider mb-6">Transforme seu negócio</p>
                        <span className="text-white text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Ver Soluções <ArrowRight size={16} /></span>
                    </div>
                </div>
            </div>

            {/* --- FAQ ISOLADO --- */}
            <HomeFAQ />

            {/* --- SOBRE NÓS --- */}
            <div className="relative py-24 overflow-hidden border-t border-slate-900">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="bg-slate-900/80 backdrop-blur rounded-[3rem] p-8 md:p-12 border border-slate-800 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-tr from-brand-blue/20 via-brand-blue/10 to-brand-pink/10 rounded-[2rem] rotate-3 group-hover:rotate-6 transition-transform duration-500 border border-brand-blue/20 overflow-hidden">
                                <div className="absolute inset-0"
                                    style={{
                                        backgroundImage: 'linear-gradient(rgba(56, 182, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 182, 255, 0.1) 1px, transparent 1px)',
                                        backgroundSize: '40px 40px'
                                    }}>
                                </div>
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-blue/30 blur-[80px] rounded-full mix-blend-screen"></div>
                            </div>

                            <img
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                                alt="Equipe Creative Print"
                                className="relative rounded-3xl shadow-2xl border-4 border-slate-800 object-cover w-full h-[400px] z-10"
                            />
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold uppercase tracking-wider mb-6">
                                <Rocket size={14} /> <T k="home_about_tag" default="Inovação Sem Fronteiras" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                <T k="home_about_title" default="🔹 TECNOLOGIA APLICADA AO MUNDO REAL" /> <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-pink text-2xl md:text-3xl block mt-2">
                                    <T k="home_about_subtitle" default="Produtos Inteligentes em 3D..." />
                                </span>
                            </h2>
                            <p className="text-brand-gray text-lg leading-relaxed mb-8">
                                <T k="home_about_text_1" default="A Creative Print é uma empresa..." />
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg text-brand-blue"><MapPin size={20} /></div>
                                    <div>
                                        <div className="font-bold text-white text-sm">Shiga - Japão</div>
                                        <div className="text-xs text-slate-500"><T k="home_about_location" default="Sede e Operação" /></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg text-brand-pink"><Heart size={20} /></div>
                                    <div>
                                        <div className="font-bold text-white text-sm">Suporte Eficiente</div>
                                        <div className="text-xs text-slate-500"><T k="home_about_support" default="Apoio Contínuo" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FINAL CTA --- */}
            <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-slate-900 to-brand-pink/20"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-pink mb-6 tracking-tight">
                        <T k="home_cta_final_title" default="Não deixe para depois." />
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12">
                        <T k="home_cta_final_desc" default="Transforme a maneira como você faz negócios..." />
                    </p>

                    <div className="flex flex-col items-center sm:flex-row justify-center gap-6">
                        <button
                            onClick={() => handleNavigateToCatalog()}
                            className="w-[80%] sm:w-[250px] bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={24} /> <T k="home_cta_final_btn_shop" default="Ir para a Loja" />
                        </button>
                        <a
                            href="https://wa.me/819011886491"
                            target="_blank"
                            rel="noreferrer"
                            className="w-[80%] sm:w-[250px] bg-transparent border-2 border-white/20 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-3 backdrop-blur-sm transform hover:-translate-y-1"
                        >
                            <MessageCircle size={24} /> <T k="home_cta_final_btn_chat" default="Entrar em contato" />
                        </a>
                    </div>
                    <p className="mt-8 text-sm text-slate-400 opacity-70">
                        <T k="home_cta_final_footer" default="Entrega rápida em todo o Japão" />
                    </p>
                </div>
            </div>
        </div>
    );
};
