import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import {
    Instagram, Facebook, MessageCircle,
    LogIn, ShoppingBag, UserPlus,
    HelpCircle,
    Smartphone, Layers, Cpu,
    ShieldCheck, ChevronRight, ArrowUp, X,
    Info, Phone, ChevronDown
} from 'lucide-react';

export const Footer: React.FC = () => {
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const faqs = [
        { q: "Quais as formas de pagamento?", a: "Aceitamos cartões de crédito via Square, PayPay e transferências bancárias japonesas (Yucho e bancos convencionais)." },
        { q: "Como funciona o envio?", a: "Enviamos para todo o Japão com rastreio. O prazo de entrega após a produção é geralmente de 1 a 2 dias úteis." },
        { q: "O produto NFC precisa de bateria?", a: "Não! Os chips NFC da Creative Print são passivos e funcionam apenas por indução ao encostar o celular. Durabilidade vitalícia." },
        { q: "Posso alterar o link do meu chaveiro depois?", a: "Sim! Se você tiver o plano CP Connect Pro, pode alterar o link de destino quantas vezes quiser pelo seu painel." }
    ];

    return (
        <footer className="bg-slate-900 border-t border-brand-blue/20 pt-20 pb-10 scroll-mt-20 relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">

                    {/* 1. Marca (Logo e Redes) */}
                    <div className="flex flex-col items-start gap-8">
                        <Logo className="h-16 md:h-14" />

                        {/* Redes Sociais Ampliadas */}
                        <div className="flex gap-4 mt-2">
                            <a href="https://www.instagram.com/creativeprint.jp" target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-lg group">
                                <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://www.facebook.com/share/1Zo7P5Zhc5/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg group">
                                <Facebook size={24} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://wa.me/819011886491" target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all duration-300 shadow-lg group">
                                <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
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
                                <button 
                                    onClick={() => setIsFAQModalOpen(true)}
                                    className="group flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-all hover:translate-x-1 duration-300 w-full text-left"
                                >
                                    <span className="p-1.5 rounded-md bg-slate-800 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors"><HelpCircle size={14} /></span>
                                    FAQ / Dúvidas
                                </button>
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

            {/* MODAIS (MANTIDOS CONFORME SOLICITADO) */}
            {isAboutModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-fade-in" onClick={() => setIsAboutModalOpen(false)} />
                    <div className="relative bg-slate-900 border border-brand-blue/20 w-full max-w-5xl h-fit max-h-[90vh] rounded-[2.5rem] shadow-[0_0_100px_rgba(36,155,203,0.2)] overflow-y-auto animate-zoom-in no-scrollbar">
                        <div className="sticky top-0 h-2 w-full bg-gradient-to-r from-brand-blue via-brand-pink to-brand-blue z-20"></div>
                        <button onClick={() => setIsAboutModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all bg-slate-800/50 p-2 rounded-full z-20"><X size={28} /></button>
                        <div className="p-8 md:p-20">
                            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-brand-blue to-brand-pink p-1">
                                    <div className="w-full h-full bg-slate-900 rounded-[calc(1.5rem-4px)] flex items-center justify-center"><Logo className="h-16 md:h-24" /></div>
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-none">Sobre nós</h2>
                                    <p className="text-brand-blue font-black text-lg md:text-2xl uppercase tracking-[0.2em] opacity-80">Revolução Criativa no Japão</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-300 leading-relaxed text-lg">
                                <div className="space-y-6">
                                    <p className="first-letter:text-5xl first-letter:font-black first-letter:text-brand-blue first-letter:mr-3 first-letter:float-left">A <strong className="text-white">Creative Print</strong> nasceu da paixão por inovação e do desejo de oferecer soluções exclusivas para empreendedores e entusiastas no Japão.</p>
                                    <p>Especializados em <strong className="text-brand-blue">Impressão 3D de alta precisão</strong> e <strong className="text-brand-pink">Tecnologia NFC</strong>, criamos produtos que conectam o mundo físico ao digital.</p>
                                </div>
                                <div className="space-y-6">
                                    <p>Nossa missão é fornecer ferramentas que impulsionem negócios, automatizem processos e encantem clientes com qualidade premium.</p>
                                    <div className="bg-slate-800/50 border border-white/5 p-8 rounded-3xl mt-8">
                                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4">Nossos Valores</h4>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> Inovação Constante</li>
                                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-pink"></div> Alto padrão de qualidade</li>
                                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> Foco no Empreendedor</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex gap-4">
                                    <div className="flex flex-col"><span className="text-white font-black text-3xl">100%</span><span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Digital & Físico</span></div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div className="flex flex-col"><span className="text-white font-black text-3xl">Japão</span><span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Sede em Nagoya</span></div>
                                </div>
                                <button onClick={() => setIsAboutModalOpen(false)} className="w-full md:w-auto bg-white text-slate-950 font-black uppercase tracking-widest px-12 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all">Fechar História</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isFAQModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={() => setIsFAQModalOpen(false)} />
                    <div className="relative bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
                        <div className="h-2 w-full bg-brand-yellow"></div>
                        <button onClick={() => setIsFAQModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow"><HelpCircle size={32} /></div>
                                <div><h2 className="text-3xl font-black text-white tracking-tighter">Dúvidas Frequentes</h2><p className="text-brand-yellow font-bold text-xs uppercase tracking-widest">Central de Ajuda</p></div>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 group">
                                        <h4 className="text-white font-bold text-sm mb-2 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-1.5 shrink-0"></div>{faq.q}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-3.5 italic">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 flex flex-col items-center gap-4 text-center">
                                <a href="https://wa.me/819011886491" target="_blank" rel="noreferrer" className="w-full bg-brand-yellow text-slate-950 font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:shadow-brand-yellow/20 transition-all flex items-center justify-center gap-2"><MessageCircle size={18} /> Chamar no Suporte</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};
