
import React from 'react';
import { Logo } from '@/src/components/ui/Logo';
import { Phone, Mail, MapPin, Globe, Instagram, Send } from 'lucide-react';

interface BusinessCardTemplateProps {
    profile: any;
    baseContent: any;
    modules: any;
}

export const BusinessCardTemplate: React.FC<BusinessCardTemplateProps> = ({ profile, baseContent, modules }) => {
    return (
        <div className="min-h-screen w-full bg-[#f8fafc] text-[#1e293b] font-sans pb-20">
            {/* Premium Header */}
            <div className="w-full h-80 bg-gradient-to-br from-[#0f172a] to-[#334155] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                {profile.poster_url && (
                    <img src={profile.poster_url} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt="Hero" />
                )}
            </div>

            <div className="w-full max-w-2xl mx-auto px-6 -mt-32 relative z-10">
                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 mb-8 border border-white/50 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-40 h-40 rounded-[2rem] overflow-hidden shadow-lg flex-shrink-0">
                            <img src={profile.poster_url} className="w-full h-full object-cover" alt={profile.display_name} />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-black text-[#0f172a] mb-2">{baseContent.title || profile.display_name}</h1>
                            <p className="text-primary font-bold uppercase tracking-wider text-sm mb-4">{profile.category} • {profile.niche}</p>
                            <p className="text-slate-500 leading-relaxed mb-6">{baseContent.bio}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all">
                                    <Phone size={18} /> Contato
                                </button>
                                <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
                                    <Send size={18} /> Mensagem
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Premium Slots: About / Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                            <MapPin size={14} className="text-primary" /> Localização
                        </h3>
                        <p className="font-bold text-slate-700">{profile.city}, {profile.prefecture}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                            <Globe size={14} className="text-primary" /> Online
                        </h3>
                        <div className="flex gap-4">
                            <Instagram size={20} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
                            <Globe size={20} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
                            <Mail size={20} className="text-slate-400 hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Standard Links Slot */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 text-center">Links Rápidos</h3>
                    {baseContent.links?.map((l: any, idx: number) => (
                        <a
                            key={idx}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-white p-5 rounded-3xl text-center font-bold text-slate-700 shadow-sm border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-center gap-3"
                        >
                            {l.label}
                        </a>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-24 mb-10 flex flex-col items-center gap-4 opacity-30">
                    <Logo className="h-6" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Creative Print Premium</span>
                </div>
            </div>
        </div>
    );
};
