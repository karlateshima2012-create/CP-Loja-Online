import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { T } from '@/src/contexts/TextContext';
import { Starfield } from '../../../components/ui/Starfield';

interface HomeHeroProps {
    onScrollToGrid: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onScrollToGrid }) => {
    return (
        <section className="relative min-h-[85vh] overflow-hidden bg-[#020617] animate-fade-in flex flex-col items-center justify-center rounded-b-[3rem] border-b border-white/5 mb-12">
            {/* 1. Efeito de Estrelas */}
            <Starfield />

            {/* 2. Efeito de Luz Pulsante Azul (Canto Superior Esquerdo) */}
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#38b6ff] rounded-full blur-[120px] opacity-20 animate-pulse-slow -z-10 pointer-events-none"></div>

            {/* 3. Atmosfera Global (Gradiente Suave) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617] -z-10"></div>
            
            {/* 4. Luz Sutil no Centro/Esquerda */}
            <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] bg-[#38b6ff]/5 rounded-full blur-[120px] -z-10"></div>

            <div className="container mx-auto relative z-10 px-6 text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold uppercase tracking-wider mx-auto">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                    </span>
                    Tecnologia • NFC • 3D
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tight">
                    Sua marca está <br/>
                    <span className="bg-gradient-to-r from-[#38b6ff] to-[#E5157A] bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(36,155,203,0.3)]">
                        conectada ao futuro?
                    </span>
                </h1>

                <p className="text-brand-gray text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                    <T k="home_hero_subtitle" default="Eleve sua presença com Cartões NFC, Displays 3D e Soluções Digitais de alta conversão." />
                </p>

                <div className="flex justify-center pt-6">
                    <button 
                        onClick={onScrollToGrid}
                        className="w-[80%] sm:w-auto bg-[#38b6ff] hover:bg-[#38b6ff]/90 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-[0_0_30px_rgba(36,155,203,0.4)] flex items-center justify-center gap-3 transform hover:-translate-y-1 text-lg"
                    >
                        Ver Loja <ShoppingBag size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};
