
import React from 'react';
import { Link } from 'react-router-dom';
import { Partner } from '@/src/types';
import { ShoppingBag, Clapperboard, BadgeCheck, Star, CheckCircle, ShieldCheck, Smartphone, Monitor, CreditCard, Wifi, Box, Layers } from 'lucide-react';
import { T } from '@/src/contexts/TextContext';

interface ShopHeroProps {
    partner: Partner | null;
    onScrollToGrid: () => void;
}

export const ShopHero: React.FC<ShopHeroProps> = ({ partner, onScrollToGrid }) => {
    
    // --- PARTNER HERO MODE ---
    if (partner) {
        return (
            <div className="container mx-auto px-4 mt-8 mb-8">
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-brand-blue/30 shadow-2xl relative overflow-hidden">
                    {/* Background FX */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 blur-[100px] pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                        
                        {/* LEFT COLUMN: Profile Info */}
                        <div className="flex flex-col md:flex-row items-center gap-6 flex-1 text-center md:text-left w-full">
                            <div className="relative shrink-0">
                                <img 
                                    src={partner.photoUrl} 
                                    alt={partner.name} 
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-brand-blue shadow-[0_0_30px_rgba(36,155,203,0.4)] bg-slate-800"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-brand-blue text-white p-1.5 rounded-full border-4 border-slate-900 shadow-lg" title="Parceiro Oficial">
                                    <BadgeCheck size={16} />
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">{partner.name}</h1>
                                <p className="text-brand-gray text-sm md:text-base leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                                    {partner.bio}
                                </p>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 font-bold flex items-center gap-2 shadow-sm">
                                        <Star size={12} className="text-brand-yellow"/> Produtos Exclusivos
                                    </div>
                                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 font-bold flex items-center gap-2 shadow-sm">
                                        <CheckCircle size={12} className="text-brand-blue"/> Curadoria CP
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Verified Badge Card */}
                        <div className="w-full lg:w-auto lg:max-w-md shrink-0">
                            <div className="bg-slate-950/60 backdrop-blur-sm border border-slate-800 hover:border-green-500/30 rounded-2xl p-5 flex gap-5 items-center shadow-lg transition-colors">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-full shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.1)] flex items-center justify-center">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1">
                                        Parceiro Verificado Creative Print 
                                    </h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Você está comprando na loja oficial de <strong className="text-slate-200">{partner.name}</strong>. 
                                        Todo o processamento do pedido, produção e entrega é garantido pela infraestrutura da Creative Print.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // --- DEFAULT HERO MODE ---
    return (
        <div className="relative rounded-b-[3rem] overflow-hidden bg-slate-950 border-b border-slate-800 shadow-2xl mb-12">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Background: Deep Void */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black"></div>
                {/* Starfield effect (subtle) */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            </div>

            <div className="container mx-auto relative z-10 px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                        </span>
                        Novidade no Japão
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                        <T k="home_hero_title" default="O Futuro do seu" />
                        <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-pink filter drop-shadow-[0_0_20px_rgba(36,155,203,0.3)]">
                            <T k="home_hero_title_highlight" default="Negócio é Digital" />
                        </span>
                    </h1>
                    <p className="text-brand-gray text-lg md:text-xl max-w-xl mx-auto md:mx-0 leading-relaxed">
                        <T k="home_hero_subtitle" default="Eleve sua marca com Cartões de Visita NFC, Displays Inteligentes e Impressão 3D personalizada." />
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 items-center md:items-start">
                        <button 
                            onClick={onScrollToGrid}
                            className="w-[80%] sm:w-auto bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-3 px-6 md:px-8 md:py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(36,155,203,0.4)] flex items-center justify-center gap-2 transform hover:-translate-y-1 text-sm md:text-base"
                        >
                            Ver Produtos na Loja <ShoppingBag size={20} />
                        </button>
                        <Link 
                            to="/connect"
                            className="w-[80%] sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 md:px-8 md:py-4 rounded-xl transition-all border border-slate-700 hover:border-brand-pink/50 flex items-center justify-center gap-2 group shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
                        >
                            Conheça a CreativeFlix <Clapperboard size={20} className="text-brand-pink group-hover:scale-110 transition-transform"/>
                        </Link>
                    </div>
                </div>
                
                {/* VISUAL CONTAINER: HIDDEN ON MOBILE (hidden md:flex) */}
                <div className="hidden md:flex flex-1 relative w-full max-w-md aspect-square items-center justify-center perspective-1000">
                    
                    {/* --- THE DARK GALAXY SPHERE --- */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        
                        {/* Glow Behind Sphere (Increased Light) */}
                        <div className="absolute w-[100%] h-[100%] bg-blue-600/30 rounded-full blur-[100px] animate-pulse-slow"></div>

                        {/* Sphere Container */}
                        <div className="relative w-[92%] h-[92%] rounded-full overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.5)] z-0 border border-white/5 bg-black">
                             
                             {/* Deep Galaxy Gradient */}
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(30,58,138,0.4),_rgba(15,23,42,1))]"></div>
                             
                             {/* Stars/Dust Texture */}
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60 animate-spin-slow" style={{ animationDuration: '150s' }}></div>
                             
                             {/* Nebula Effects */}
                             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-900/10 via-transparent to-purple-900/20 mix-blend-screen"></div>

                             {/* Sphere Volumetrics (Shadow to create 3D effect) */}
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_90%)]"></div>
                             
                             {/* Rim Light Reflection */}
                             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 rounded-full"></div>
                        </div>
                    </div>

                    {/* Floating Cards Container - Z-Index Higher than Sphere */}
                    <div className="relative w-full h-full z-20">
                        
                        {/* Digital Card - Top Right (Biggest: w-60) */}
                        <div className="absolute -top-12 left-[25%] bg-slate-900/80 backdrop-blur-xl border border-brand-pink/30 p-6 rounded-3xl shadow-[0_0_50px_rgba(229,21,122,0.3)] flex flex-col items-center justify-center w-60 h-60 z-20 animate-float overflow-hidden group hover:border-brand-pink/50 transition-colors">
                            <Monitor size={120} className="absolute top-0 left-0 text-brand-pink/10 group-hover:text-brand-pink/20 transition-colors" />
                            <div className="relative z-10 mb-3 group-hover:scale-110 transition-transform">
                                <Smartphone size={64} className="text-brand-pink" />
                            </div>
                            <span className="font-bold text-white text-xl relative z-10">Digital</span>
                            <span className="text-sm text-brand-gray relative z-10">Solutions</span>
                        </div>

                        {/* NFC Smart Card - Middle Left (Smallest: w-52) */}
                        <div className="absolute top-[50%] -left-6 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-5 rounded-3xl shadow-2xl flex flex-col items-center justify-center w-52 h-52 z-10 animate-float delay-100 overflow-hidden group hover:border-brand-blue/50 transition-colors">
                            <Smartphone size={100} className="absolute -right-4 -top-4 text-brand-blue/10 transform rotate-12 group-hover:text-brand-blue/20 transition-colors" />
                            <div className="relative z-10 mb-2 group-hover:scale-110 transition-transform">
                                <CreditCard size={48} className="text-brand-blue" />
                                <Wifi size={20} className="absolute -top-2 -right-2 text-brand-blue animate-pulse" />
                            </div>
                            <span className="font-bold text-slate-200 text-lg relative z-10">NFC Smart</span>
                        </div>

                        {/* Print 3D Card - Bottom Right (Medium: w-56) */}
                        <div className="absolute -bottom-4 -right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-5 rounded-3xl shadow-2xl flex flex-col items-center justify-center w-56 h-56 z-10 animate-float delay-300 overflow-hidden group hover:border-brand-yellow/50 transition-colors">
                            <Layers size={110} className="absolute -left-4 -top-4 text-brand-yellow/10 transform -rotate-12 group-hover:text-brand-yellow/20 transition-colors" />
                            <div className="relative z-10 mb-2 group-hover:scale-110 transition-transform">
                                <Box size={52} className="text-brand-yellow" />
                            </div>
                            <span className="font-bold text-slate-200 text-lg relative z-10">Print 3D</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
