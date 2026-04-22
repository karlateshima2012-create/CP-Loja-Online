import React from 'react';
import { FlixProfile, FlixStyleConfig } from '@/src/types';
import { Camera, Image as ImageIcon, Maximize2, Instagram, Share2, ArrowRight } from 'lucide-react';

interface PortfolioTemplateProps {
    profile: FlixProfile;
    baseContent: any;
    modules: any;
}

export const PortfolioTemplate: React.FC<PortfolioTemplateProps> = ({ profile, baseContent, modules }) => {
    const style: FlixStyleConfig = profile.style || {};
    const primaryColor = style.buttonColor || '#000000';
    const backgroundColor = style.backgroundColor || '#ffffff';

    // Mock images if portfolio module is empty
    const galleryItems = modules.portfolio?.items || [
        { id: 1, title: 'Lifestyle Shoot', type: 'Fashion', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
        { id: 2, title: 'Nature Photography', type: 'Landscape', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05' },
        { id: 3, title: 'Commercial Project', type: 'Studio', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e' },
        { id: 4, title: 'Wedding Day', type: 'Event', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622' },
        { id: 5, title: 'Urban Explore', type: 'Street', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000' },
        { id: 6, title: 'Corporate Portrait', type: 'Portrait', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden" style={{ backgroundColor }}>
            {/* Minimal Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 flex justify-between items-center px-6 py-4">
                <div className="font-black text-lg tracking-tight flex items-center gap-2">
                    <Camera size={20} />
                    {profile.displayName.toUpperCase()}
                </div>
                <div className="flex gap-4">
                    <a href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`} className="bg-black text-white px-5 py-2 rounded-full text-xs font-black tracking-widest hover:scale-105 transition-transform" style={{ backgroundColor: primaryColor }}>CONTATO</a>
                </div>
            </header>

            {/* Profile Intro */}
            <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-8 border-4 border-slate-100 shadow-xl">
                    <img src={profile.profileImageUrl} className="w-full h-full object-cover" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-4">{profile.displayName}</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">{profile.category} • Portfolio Oficial</p>
                <div className="w-12 h-1 bg-black mx-auto rounded-full mb-8" style={{ backgroundColor: primaryColor }}></div>
                <p className="text-slate-500 font-medium leading-[1.8] text-lg max-w-2xl mx-auto">
                    {baseContent.bio || profile.fullBio || 'Capturando momentos e transformando em memórias eternas através das lentes.'}
                </p>
            </section>

            {/* Masonry Grid (Simplified) */}
            <div className="px-4 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryItems.map((item: any, idx: number) => (
                    <div key={item.id} className="relative group overflow-hidden rounded-2xl bg-slate-100 aspect-[4/5]">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                            <div className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{item.type}</div>
                            <h3 className="text-xl font-black text-white mb-4">{item.title}</h3>
                            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform"><Maximize2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Services Summary */}
            <section className="bg-slate-900 py-32 px-6 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black mb-16">Especialidades</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {['Retratos', 'Eventos', 'Fashion', 'Comercial'].map(s => (
                            <div key={s} className="flex flex-col items-center gap-4 group">
                                <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center transition-all group-hover:bg-white group-hover:text-slate-900 group-hover:-rotate-12">
                                    <ImageIcon size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-24">
                        <h3 className="text-4xl font-black mb-8">Vamos criar algo juntos?</h3>
                        <a
                            href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`}
                            className="inline-flex items-center gap-4 bg-white text-slate-900 px-12 py-5 rounded-full font-black text-lg hover:scale-110 transition-transform shadow-2xl"
                        >
                            Solicitar Orçamento <ArrowRight size={24} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Social Links */}
            <footer className="py-20 flex flex-col items-center gap-10">
                <div className="flex gap-8">
                    <button className="text-slate-400 hover:text-slate-900 transition-colors"><Instagram size={24} /></button>
                    <button className="text-slate-400 hover:text-slate-900 transition-colors"><Share2 size={24} /></button>
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">CreativeFlix Portfolio</div>
            </footer>
        </div>
    );
};
