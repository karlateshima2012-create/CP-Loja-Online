
import React from 'react';
import { Smartphone, CreditCard, Wifi, ArrowRight, Layers, Box, Monitor, Cpu } from 'lucide-react';
import { T } from '@/src/contexts/TextContext';

interface HomeSegmentsProps {
    scrollToSection: (id: string) => void;
}

export const HomeSegments: React.FC<HomeSegmentsProps> = ({ scrollToSection }) => {
    return (
        <div className="container mx-auto px-4 mb-20 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CARD 1: NFC */}
                <button onClick={() => scrollToSection('info-nfc')} className="group bg-slate-900/80 backdrop-blur hover:bg-slate-800 p-8 rounded-[2rem] border border-slate-800 hover:border-brand-blue/50 transition-all text-left relative overflow-hidden shadow-xl hover:shadow-brand-blue/10 flex flex-col h-full transform hover:-translate-y-2 duration-300">
                    <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Smartphone size={140} /></div>
                    <div className="bg-brand-blue/10 w-16 h-16 rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform border border-brand-blue/20 shadow-lg shadow-brand-blue/10 relative">
                        <CreditCard size={32} />
                        <Wifi size={12} className="absolute top-2 right-2 text-brand-blue/70" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Smart NFC</h3>
                    <p className="text-brand-gray text-sm leading-relaxed mb-8 flex-1">
                        <T k="home_nfc_desc" default="Tecnologia que conecta sua marca ao digital com apenas um toque no celular. Ideal para cartões, chaveiros e tags inteligentes." />
                    </p>
                    <div className="flex items-center gap-2 text-brand-blue text-sm font-bold uppercase tracking-wide group-hover:gap-3 transition-all">
                        Saiba mais <ArrowRight size={16}/>
                    </div>
                </button>
                
                {/* CARD 2: 3D */}
                <button onClick={() => scrollToSection('info-3d')} className="group bg-slate-900/80 backdrop-blur hover:bg-slate-800 p-8 rounded-[2rem] border border-slate-800 hover:border-brand-yellow/50 transition-all text-left relative overflow-hidden shadow-xl hover:shadow-brand-yellow/10 flex flex-col h-full transform hover:-translate-y-2 duration-300">
                    <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Layers size={140} /></div>
                    <div className="bg-brand-yellow/10 w-16 h-16 rounded-2xl flex items-center justify-center text-brand-yellow mb-6 group-hover:scale-110 transition-transform border border-brand-yellow/20 shadow-lg shadow-brand-yellow/10">
                        <Box size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Impressão 3D</h3>
                    <p className="text-brand-gray text-sm leading-relaxed mb-8 flex-1">
                        <T k="home_3d_desc_1" default="Materialize suas ideias com precisão milimétrica. De brindes corporativos personalizados a displays de pagamento exclusivos para seu balcão." />
                    </p>
                    <div className="flex items-center gap-2 text-brand-yellow text-sm font-bold uppercase tracking-wide group-hover:gap-3 transition-all">
                        Saiba mais <ArrowRight size={16}/>
                    </div>
                </button>

                {/* CARD 3: WEB */}
                <button onClick={() => scrollToSection('info-web')} className="group bg-slate-900/80 backdrop-blur hover:bg-slate-800 p-8 rounded-[2rem] border border-slate-800 hover:border-brand-pink/50 transition-all text-left relative overflow-hidden shadow-xl hover:shadow-brand-pink/10 flex flex-col h-full transform hover:-translate-y-2 duration-300">
                    <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Monitor size={140} /></div>
                    <div className="bg-brand-pink/10 w-16 h-16 rounded-2xl flex items-center justify-center text-brand-pink mb-6 group-hover:scale-110 transition-transform border border-brand-pink/20 shadow-lg shadow-brand-pink/10">
                        <Cpu size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Serviços Digitais</h3>
                    <p className="text-brand-gray text-sm leading-relaxed mb-8 flex-1">
                        <T k="home_web_desc" default="Soluções digitais que transformam visitantes em clientes. Landing Pages de alta conversão e sistemas integrados perfeitamente ao ecossistema físico." />
                    </p>
                    <div className="flex items-center gap-2 text-brand-pink text-sm font-bold uppercase tracking-wide group-hover:gap-3 transition-all">
                        Saiba mais <ArrowRight size={16}/>
                    </div>
                </button>
            </div>
        </div>
    );
};
