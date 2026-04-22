
import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Sparkles, ArrowLeft, Construction } from 'lucide-react';

export const ConnectPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">

      {/* --- Background Effects --- */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-pink/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* --- Main Content --- */}
      <div className="relative z-10 container mx-auto px-4 text-center">

        {/* Animated Icon Container */}
        <div className="inline-flex relative mb-10 group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-pink blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 rounded-[2rem] shadow-2xl animate-float">
            <Rocket size={80} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            <Sparkles size={32} className="text-brand-yellow absolute -top-4 -right-4 animate-bounce" />
            <Construction size={24} className="text-slate-500 absolute bottom-4 right-4 opacity-50" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
          Estamos desenvolvendo <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-white to-brand-pink filter drop-shadow-lg">
            Algo incrível Aqui!
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-lg mx-auto font-light">
          Você verá em breve.
        </p>

        {/* Action Button */}
        <Link
          to="/inicio#destaques"
          className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-brand-blue/50 group hover:shadow-[0_0_20px_rgba(56,182,255,0.2)]"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o Início
        </Link>

        {/* Footer Note */}
        <div className="mt-16 opacity-50 text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">
          CreativeFlix &bull; Em Construção
        </div>

      </div>
    </div>
  );
};
