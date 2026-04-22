import React from 'react';
import { FlixProfile, FlixStyleConfig } from '@/src/types';
import { Phone, MessageCircle, MapPin, Globe, Instagram, Facebook, LayoutGrid, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicesTemplateProps {
    profile: FlixProfile;
    baseContent: any;
    modules: any;
}

export const ServicesTemplate: React.FC<ServicesTemplateProps> = ({ profile, baseContent, modules }) => {
    const style: FlixStyleConfig = profile.style || {};
    const primaryColor = style.buttonColor || '#3b82f6'; // Professional blue
    const backgroundColor = style.backgroundColor || '#ffffff';

    // Mock services if modules are empty
    const services = modules.services?.items || [
        { id: 1, name: 'Consultoria Especializada', price: 'A partir de ¥5,000', description: 'Atendimento personalizado para entender sua necessidade e propor a melhor solução estratégica.', icon: 'CheckCircle2' },
        { id: 2, name: 'Assessoria Mensal', price: '¥15,000 / mês', description: 'Acompanhamento contínuo dos seus processos com relatórios detalhados e suporte prioritário.', icon: 'CheckCircle2' },
        { id: 3, name: 'Treinamento de Equipe', price: 'Sob orçamento', description: 'Capacitação completa para seu time com foco em produtividade e novas tecnologias.', icon: 'CheckCircle2' },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col font-sans" style={{ backgroundColor }}>
            {/* Minimal Sticky Header */}
            <header className="sticky top-0 bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <img src={profile.profileImageUrl} className="w-8 h-8 rounded-full border shadow-sm" />
                    <span className="font-black text-sm uppercase tracking-tighter">{profile.displayName}</span>
                </div>
                <a
                    href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`}
                    className="bg-black text-white px-5 py-2 rounded-full text-[10px] font-black tracking-widest hover:scale-105 transition-transform"
                    style={{ backgroundColor: primaryColor }}
                >
                    AGENDAR
                </a>
            </header>

            {/* Profile Section */}
            <div className="px-6 pt-12 pb-20 flex flex-col items-center max-w-2xl mx-auto text-center">
                <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl mb-8 relative">
                    <img src={profile.profileImageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-white/20 rounded-3xl"></div>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{profile.displayName}</h1>
                <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-8" style={{ color: primaryColor }}>{profile.category} • Serviços Profissionais</p>
                <p className="text-slate-500 font-medium leading-relaxed text-lg mb-10">{baseContent.bio || profile.fullBio}</p>

                <div className="flex gap-4 w-full justify-center">
                    <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-colors"><Instagram size={24} /></button>
                    <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-colors"><Facebook size={24} /></button>
                    <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-colors"><Globe size={24} /></button>
                </div>
            </div>

            {/* Services List */}
            <section className="px-6 py-20 bg-slate-50 rounded-t-[4rem]">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-slate-800">Serviços Disponíveis</h2>
                        <LayoutGrid size={20} className="text-slate-300" />
                    </div>

                    {services.map((item: any) => (
                        <div key={item.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform" style={{ color: primaryColor }}>
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.price}</div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 mb-2">{item.name}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.description}</p>
                                </div>
                                <a
                                    href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}?text=Olá! Gostaria de saber mais sobre: ${item.name}`}
                                    className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-4 transition-all"
                                    style={{ color: primaryColor }}
                                >
                                    Falar sobre este serviço <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact / CTA */}
            <section className="p-6 md:p-20 bg-white">
                <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/50">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-6">Precisa de um atendimento urgente?</h2>
                        <p className="text-brand-gray mb-10 text-lg opacity-70">Estamos prontos para te ajudar imediatamente através do nosso canal de WhatsApp.</p>
                        <a
                            href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`}
                            className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 w-fit mx-auto hover:scale-105 transition-transform"
                        >
                            <MessageCircle size={24} /> CHAMAR NO WHATSAPP
                        </a>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-blue/10 to-transparent"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 flex flex-col items-center opacity-20 gap-4">
                <div className="font-black text-lg tracking-[0.2em]">{profile.displayName}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em]">Serviços Profissionais • Creative Print</div>
            </footer>
        </div>
    );
};
