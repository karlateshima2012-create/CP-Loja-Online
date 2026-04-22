
import React from 'react';
import { Logo } from '@/src/components/ui/Logo';
import { ShoppingBag, Camera, Users, ArrowRight } from 'lucide-react';

interface StorefrontTemplateProps {
    profile: any;
    baseContent: any;
    modules: any;
}

export const StorefrontTemplate: React.FC<StorefrontTemplateProps> = ({ profile, baseContent, modules }) => {
    return (
        <div className="min-h-screen w-full bg-white text-slate-900 font-sans">
            {/* Minimalist Premium Header */}
            <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="font-black text-xl tracking-tighter">{profile.display_name}</div>
                <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                    {modules.catalog && <span className="text-slate-900 cursor-pointer">Loja</span>}
                    {modules.photo_portfolio && <span className="hover:text-slate-900 cursor-pointer">Portfolio</span>}
                    <span className="hover:text-slate-900 cursor-pointer">Contato</span>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="w-full h-[70vh] relative flex items-center justify-center overflow-hidden bg-slate-100">
                {profile.poster_url && (
                    <img src={profile.poster_url} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
                )}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white px-6">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">{baseContent.title || profile.display_name}</h1>
                    <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto mb-10">{baseContent.bio}</p>
                    <button className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                        Explorar <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-8 py-24">
                {/* Module Slot: Photo Portfolio */}
                {modules.photo_portfolio && (
                    <section className="mb-32">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-4xl font-black mb-2 flex items-center gap-4">
                                    <Camera size={32} className="text-primary" /> Portfólio
                                </h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Trabalhos Recentes</p>
                            </div>
                            <button className="text-primary font-black uppercase text-xs tracking-widest flex items-center gap-2">Ver Todos <ArrowRight size={14} /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="group relative aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden cursor-pointer shadow-xl">
                                    <img src={`https://picsum.photos/seed/cp${i}/800/1000`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Portfolio item" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                                        <h4 className="text-white font-black text-xl">Projeto {i}</h4>
                                        <p className="text-white/60 text-sm font-medium">Categoria do Álbum</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Module Slot: Catalog / Shop */}
                {modules.catalog && (
                    <section className="mb-32">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-4xl font-black mb-2 flex items-center gap-4">
                                    <ShoppingBag size={32} className="text-primary" /> Catálogo
                                </h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nossos Produtos</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex flex-col gap-4 group cursor-pointer">
                                    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                        <img src={`https://picsum.photos/seed/shop${i}/400/400`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Product" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Produto Especial {i}</h4>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-primary font-black">¥5,000</span>
                                            <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><ShoppingBag size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Module Slot: Jobs Board */}
                {modules.jobs_board && (
                    <section className="mb-32">
                        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black mb-4 flex items-center gap-4">
                                    <Users size={32} className="text-primary" /> Trabalhe Conosco
                                </h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-12">Oportunidades Abertas</p>

                                <div className="space-y-4 max-w-3xl">
                                    {[1, 2].map(i => (
                                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center hover:bg-white/10 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">Vaga de Exemplo {i}</h4>
                                                <p className="text-sm text-white/50">Tempo Integral • {profile.city}</p>
                                            </div>
                                            <button className="bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">Candidatar-se</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer Section */}
                <footer className="border-t border-slate-100 pt-24 pb-12 flex flex-col items-center gap-8">
                    <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
                        <span>Legal</span>
                        <span>Privacidade</span>
                        <span>Termos</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 opacity-20">
                        <Logo className="h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Creative Print Storefront</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};
