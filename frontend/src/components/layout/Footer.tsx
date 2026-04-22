
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import {
    Instagram, Facebook, MessageCircle,
    LogIn, ShoppingBag, UserPlus,
    Star, ThumbsUp, HelpCircle,
    Smartphone, Layers, Cpu,
    ShieldCheck, ChevronRight, ArrowUp
} from 'lucide-react';
import { T } from '@/src/contexts/TextContext';

export const Footer: React.FC = () => {
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
                        <p className="text-brand-gray text-sm leading-relaxed">
                            Revolucionando o mercado de empreendedores no Japão com tecnologia NFC, Impressão 3D e soluções digitais inteligentes.
                        </p>

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
                            <h4 className="font-bold text-white uppercase tracking-wider text-sm"><T k="footer_account" default="Minha Conta" /></h4>
                        </div>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/login" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors"><LogIn size={14} /></span>
                                    <T k="footer_login" default="Fazer Login" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/produtos" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors"><ShoppingBag size={14} /></span>
                                    <T k="footer_shop" default="Ver Loja" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors"><UserPlus size={14} /></span>
                                    <T k="footer_register" default="Criar Conta" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3. Explorar (Amarelo) */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                            <div className="w-8 h-1 bg-brand-yellow rounded-full"></div>
                            <h4 className="font-bold text-white uppercase tracking-wider text-sm"><T k="footer_explore" default="Explorar" /></h4>
                        </div>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/inicio#destaques" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors"><Star size={14} /></span>
                                    <T k="footer_highlights" default="Destaques CP" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/inicio#recomendados" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors"><ThumbsUp size={14} /></span>
                                    <T k="footer_recommended" default="Produtos Recomendados" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/inicio#faq" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors"><HelpCircle size={14} /></span>
                                    <T k="footer_faq" default="FAQ / Dúvidas" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Soluções (Rosa) */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                            <div className="w-8 h-1 bg-brand-pink rounded-full"></div>
                            <h4 className="font-bold text-white uppercase tracking-wider text-sm"><T k="footer_solutions" default="Soluções" /></h4>
                        </div>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/produtos?cat=Tecnologia NFC" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors"><Smartphone size={14} /></span>
                                    <T k="footer_nfc" default="Smart NFC" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/produtos?cat=Impressão 3D" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors"><Layers size={14} /></span>
                                    <T k="footer_3d" default="Impressão 3D" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/produtos?cat=Serviços Digitais" className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300">
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors"><Cpu size={14} /></span>
                                    <T k="footer_web" default="Sistemas Web" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 relative">

                    {/* Back to Top Button Centered on Border */}
                    <button
                        onClick={scrollToTop}
                        className="absolute left-1/2 -translate-x-1/2 -top-5 bg-slate-900 border border-slate-700 text-slate-500 hover:text-white hover:border-brand-blue hover:bg-brand-blue p-2 rounded-full transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group z-10"
                        title="Voltar ao topo"
                    >
                        <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                    </button>

                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                        <ShieldCheck size={14} className="text-green-500" />
                        <p>© {new Date().getFullYear()} Creative Print. <T k="footer_rights" default="Todos os direitos reservados." /></p>
                    </div>
                    <div className="flex gap-6 text-xs text-slate-600 font-medium">
                        <Link to="/legal" className="hover:text-brand-blue flex items-center gap-1 hover:underline"><ChevronRight size={12} /> Termos de uso & Política de privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
