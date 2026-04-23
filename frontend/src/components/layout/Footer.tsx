import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import {
    Instagram, Facebook, MessageCircle,
    LogIn, ShoppingBag, UserPlus,
    HelpCircle,
    Smartphone, Layers, Cpu,
    ShieldCheck, ChevronRight, ArrowUp, X,
    Info, Phone
} from 'lucide-react';
import { T } from '@/src/contexts/TextContext';

export const Footer: React.FC = () => {
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-900 border-t border-brand-blue/20 pt-20 pb-10 scroll-mt-20 relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">

                    {/* 1. Marca/Sobre */}
                    <div className="flex flex-col items-start gap-6">
                        <div className="flex flex-col gap-3">
                            <Logo className="h-9" />
                            <h3 className="font-black text-2xl text-white tracking-tight">Creative Print</h3>
                        </div>

                        {/* Redes Sociais */}
                        <div className="flex gap-3 mt-2">
                            <a href="https://www.instagram.com/creativeprint.jp" target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-lg group">
                                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.facebook.com/share/1Zo7P5Zhc5/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg group">
                                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://wa.me/819011886491" target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-lg group">
                                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* 2. Minha Conta (Azul) */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                            <div className="w-8 h-1 bg-brand-blue rounded-full"></div>
                            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Minha Conta</h4>
                        </div>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/login" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors"><LogIn size={14} /></span>
                                    Fazer Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors"><UserPlus size={14} /></span>
                                    Entrar / Cadastro
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors"><ShoppingBag size={14} /></span>
                                    Ver Loja
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3. Explorar (Amarelo) */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                            <div className="w-8 h-1 bg-brand-yellow rounded-full"></div>
                            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Explorar</h4>
                        </div>
                        <ul className="space-y-4">
                            <li>
                                <button 
                                    onClick={() => setIsAboutModalOpen(true)}
                                    className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300 w-full text-left"
                                >
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors"><Info size={14} /></span>
                                    Sobre nós
                                </button>
                            </li>
                            <li>
                                <a 
                                    href="https://wa.me/819011886491" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300"
                                >
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors"><Phone size={14} /></span>
                                    Falar no WhatsApp
                                </a>
                            </li>
                            <li>
                                <Link to="/#faq" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors"><HelpCircle size={14} /></span>
                                    FAQ / Dúvidas
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Soluções (Rosa) */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                            <div className="w-8 h-1 bg-brand-pink rounded-full"></div>
                            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Soluções</h4>
                        </div>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/?cat=Impressão 3D" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors"><Layers size={14} /></span>
                                    Impressão 3D
                                </Link>
                            </li>
                            <li>
                                <Link to="/?cat=Tecnologia NFC" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors"><Smartphone size={14} /></span>
                                    Tecnologia NFC
                                </Link>
                            </li>
                            <li>
                                <Link to="/?cat=Soluções Digitais" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors"><Cpu size={14} /></span>
                                    Soluções Digitais
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative">
                    <button
                        onClick={scrollToTop}
                        className="absolute left-1/2 -translate-x-1/2 -top-5 bg-slate-900 border border-slate-700 text-slate-500 hover:text-white hover:border-brand-blue hover:bg-brand-blue p-2 rounded-full transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group z-10"
                        title="Voltar ao topo"
                    >
                        <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                    </button>

                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                        <ShieldCheck size={14} className="text-green-500" />
                        <p>© {new Date().getFullYear()} Creative Print. Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>

            {/* MODAL SOBRE NÓS */}
            {isAboutModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in" 
                        onClick={() => setIsAboutModalOpen(false)}
                    />
                    <div className="relative bg-slate-900 border border-brand-blue/30 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
                        <div className="h-2 w-full bg-gradient-to-r from-brand-blue via-brand-pink to-brand-blue"></div>
                        <button 
                            onClick={() => setIsAboutModalOpen(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-brand-blue/10 border border-brand-blue/20">
                                    <Logo className="h-10" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tighter">Sobre nós</h2>
                                    <p className="text-brand-blue font-bold text-sm uppercase tracking-widest">Transformando Ideias em Realidade</p>
                                </div>
                            </div>

                            <div className="space-y-6 text-slate-300 leading-relaxed text-base">
                                <p>
                                    A <strong className="text-white">Creative Print</strong> nasceu da paixão por inovação e do desejo de oferecer soluções exclusivas para empreendedores e entusiastas no Japão.
                                </p>
                                <p>
                                    Especializados em <strong className="text-brand-blue">Impressão 3D de alta precisão</strong> e <strong className="text-brand-pink">Tecnologia NFC</strong>, criamos produtos que conectam o mundo físico ao digital de forma mágica e eficiente.
                                </p>
                                <p>
                                    Nossa missão é fornecer ferramentas que impulsionem negócios, automatizem processos e encantem clientes, sempre com um padrão de qualidade premium e atendimento personalizado.
                                </p>
                            </div>

                            <div className="mt-12 flex justify-end">
                                <button 
                                    onClick={() => setIsAboutModalOpen(false)}
                                    className="bg-brand-blue text-slate-950 font-black uppercase tracking-widest px-8 py-3 rounded-xl shadow-lg hover:shadow-brand-blue/30 transition-all transform hover:-translate-y-1"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};
