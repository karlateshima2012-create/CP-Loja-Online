import React from 'react';
import { FlixProfile, FlixStyleConfig } from '@/src/types';
import { ArrowRight, CheckCircle2, Star, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

interface LandingPageTemplateProps {
    profile: FlixProfile;
    baseContent: any;
    modules: any;
}

export const LandingPageTemplate: React.FC<LandingPageTemplateProps> = ({ profile, baseContent, modules }) => {
    const style: FlixStyleConfig = profile.style || {};
    const primaryColor = style.buttonColor || '#38b6ff';
    const textColor = style.textColor || '#0f172a';
    const backgroundColor = style.backgroundColor || '#ffffff';

    return (
        <div className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden" style={{ backgroundColor, color: textColor }}>
            {/* Header / Nav */}
            <header className="w-full flex justify-between items-center py-6 px-6 lg:px-20 max-w-7xl mx-auto z-20">
                <div className="flex items-center gap-3">
                    <img src={profile.profileImageUrl} className="w-10 h-10 rounded-full shadow-lg" alt={profile.displayName} />
                    <span className="font-black text-xl tracking-tight">{profile.displayName}</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-bold opacity-70">
                    <a href="#about" className="hover:opacity-100 transition-opacity">Sobre</a>
                    <a href="#services" className="hover:opacity-100 transition-opacity">Serviços</a>
                    <a href="#contact" className="hover:opacity-100 transition-opacity">Contato</a>
                </div>
                <a
                    href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                >
                    Falar Agora
                </a>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 lg:px-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative z-10 flex flex-col">
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                        <Zap size={14} className="text-brand-yellow" /> {profile.category} • {profile.slogan || 'Destaque'}
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight">
                        {baseContent.title || profile.displayName}
                    </h1>
                    <p className="text-xl opacity-70 mb-10 leading-relaxed font-medium">
                        {baseContent.bio || profile.fullBio}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`}
                            className="bg-black text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-2xl transition-all hover:-translate-y-1"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Solicitar Orçamento <ArrowRight size={20} />
                        </a>
                        <div className="flex items-center gap-4 px-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} /></div>)}
                            </div>
                            <div className="text-xs font-bold leading-tight">
                                <div className="flex gap-1 text-brand-yellow mb-0.5"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></div>
                                +50 Clientes Atendidos
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-pink/20 blur-[120px] rounded-full"></div>
                    <div className="relative w-full aspect-[4/5] max-w-md rounded-[3rem] overflow-hidden shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-700">
                        <img src={profile.poster_url || profile.coverImageUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <div className="flex items-center gap-2 text-xs font-bold mb-2"><CheckCircle2 size={16} className="text-green-400" /> Qualidade Garantida</div>
                            <div className="text-xl font-black">Excelência em cada detalhe do nosso serviço.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features / Services Section */}
            <section id="services" className="bg-slate-50 py-32 px-6 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 flex flex-col items-center">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">O que entregamos para você</h2>
                        <div className="w-20 h-2 bg-black rounded-full" style={{ backgroundColor: primaryColor }}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {baseContent.links?.slice(0, 6).map((link: any, idx: number) => (
                            <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-slate-100 group">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform" style={{ color: primaryColor }}>
                                    <TrendingUp size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4">{link.label}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed mb-8">Especialidade voltada para entregar os melhores resultados para o seu negócio.</p>
                                <a href={link.url} className="text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all" style={{ color: primaryColor }}>
                                    SAIBA MAIS <ArrowRight size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-32 px-6 lg:px-20 text-center max-w-5xl mx-auto">
                <ShieldCheck size={64} className="mx-auto mb-10 opacity-20" />
                <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">Por que escolher {profile.displayName}?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                    <div>
                        <div className="text-5xl font-black mb-4" style={{ color: primaryColor }}>5+</div>
                        <div className="text-sm font-bold uppercase tracking-widest opacity-50">Anos de Experiência</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-4" style={{ color: primaryColor }}>100%</div>
                        <div className="text-sm font-bold uppercase tracking-widest opacity-50">Suporte Dedicado</div>
                    </div>
                    <div>
                        <div className="text-5xl font-black mb-4" style={{ color: primaryColor }}>24h</div>
                        <div className="text-sm font-bold uppercase tracking-widest opacity-50">Atendimento ágil</div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section id="contact" className="px-6 lg:px-20 pb-32">
                <div className="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-blue/20 via-transparent to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight max-w-3xl">Pronto para elevar o nível da sua presença digital?</h2>
                        <p className="text-brand-gray text-xl mb-12 max-w-2xl font-medium">Não perca tempo e comece agora mesmo seu projeto com a melhor equipe do Japão.</p>
                        <a
                            href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`}
                            className="bg-white text-slate-900 px-12 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-transform flex items-center gap-4 shadow-2xl"
                        >
                            Chamar no WhatsApp <ArrowRight size={24} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 lg:px-20 border-t border-slate-100 flex flex-col items-center">
                <div className="flex items-center gap-3 opacity-30 mb-8">
                    <img src={profile.profileImageUrl} className="w-8 h-8 rounded-full grayscale" />
                    <span className="font-black text-lg">{profile.displayName}</span>
                </div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">
                    Creative Print Official • 2026
                </div>
            </footer>
        </div>
    );
};
