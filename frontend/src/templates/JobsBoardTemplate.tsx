import React from 'react';
import { FlixProfile, FlixStyleConfig } from '@/src/types';
import { Briefcase, MapPin, Clock, DollarSign, Send, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface JobsBoardTemplateProps {
    profile: FlixProfile;
    baseContent: any;
    modules: any;
}

export const JobsBoardTemplate: React.FC<JobsBoardTemplateProps> = ({ profile, baseContent, modules }) => {
    const style: FlixStyleConfig = profile.style || {};
    const primaryColor = style.buttonColor || '#06b6d4'; // Standard corporate cyan
    const backgroundColor = style.backgroundColor || '#f4f7f6';

    // Mock jobs if jobs module is empty
    const jobs = modules.jobs?.positions || [
        { id: 1, title: 'Operador de Máquina G1', company: 'Indústria Automotiva', city: 'Aichi - Anjo', salary: '¥1,500/hr', type: 'Full-time', highlight: true },
        { id: 2, title: 'Inspetor de Qualidade', company: 'Componentes Eletrônicos', city: 'Shiga - Koka', salary: '¥1,350/hr', type: 'Contract' },
        { id: 3, title: 'Auxiliar de Logística', company: 'E-commerce Center', city: 'Saitama', salary: '¥1,200/hr', type: 'Part-time' },
        { id: 4, title: 'Soldador Especializado', company: 'Construção Pesada', city: 'Mie - Tsu', salary: '¥1,800/hr', type: 'Full-time' },
    ];

    const handleApply = (job: any) => {
        const text = encodeURIComponent(`Olá ${profile.displayName}! Vi a vaga de ${job.title} e tenho interesse em me candidatar.`);
        window.open(`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen w-full flex flex-col font-sans" style={{ backgroundColor }}>
            {/* Professional Header */}
            <div className="bg-slate-900 text-white px-6 py-12 lg:px-20 lg:py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-24 h-24 rounded-3xl border-2 border-white/20 p-1 bg-white/10 shrink-0">
                        <img src={profile.profileImageUrl} className="w-full h-full object-cover rounded-2xl" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-black mb-3">{profile.displayName}</h1>
                        <p className="text-brand-blue font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
                            <Briefcase size={14} /> {profile.category} • Japan Recruitment
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
                        <div className="text-3xl font-black text-white">{jobs.length}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vagas Ativas</div>
                    </div>
                </div>
            </div>

            {/* Content / Job List */}
            <section className="px-6 py-12 lg:px-20 lg:py-20 -mt-10">
                <div className="max-w-4xl mx-auto space-y-6">
                    {jobs.map((job: any) => (
                        <div key={job.id} className={`bg-white rounded-[2rem] p-8 shadow-sm border-2 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:shadow-xl hover:-translate-y-1 ${job.highlight ? 'border-brand-blue/30' : 'border-transparent'}`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-black text-slate-800">{job.title}</h3>
                                    {job.highlight && <span className="bg-brand-blue/10 text-brand-blue text-[8px] font-black uppercase px-2 py-1 rounded-full">Destaque</span>}
                                </div>
                                <div className="text-slate-500 font-bold text-sm mb-4">{job.company}</div>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full"><MapPin size={14} /> {job.city}</span>
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full text-green-600 font-bold"><DollarSign size={14} /> {job.salary}</span>
                                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full"><Clock size={14} /> {job.type}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleApply(job)}
                                className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-slate-900/10"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <Send size={18} /> CANDIDATAR-SE
                            </button>
                        </div>
                    ))}

                    <div className="bg-slate-200/50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-300">
                        <CheckCircle2 size={48} className="mx-auto mb-6 text-slate-300" />
                        <h4 className="text-2xl font-black text-slate-600 mb-4">Não encontrou a vaga ideal?</h4>
                        <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Envie seu currículo mesmo assim e entraremos em contato quando surgir algo no seu perfil.</p>
                        <a
                            href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`}
                            className="inline-flex items-center gap-3 font-black text-slate-800 hover:gap-5 transition-all"
                        >
                            ENVIAR CURRÍCULO GERAL <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <div className="bg-white py-12 border-t border-slate-100 mt-auto">
                <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 px-6">
                    <div className="flex items-center gap-2 text-slate-300 grayscale opacity-50"><ShieldCheck size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Agência Licenciada</span></div>
                    <div className="flex items-center gap-2 text-slate-300 grayscale opacity-50"><ShieldCheck size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Suporte 24h</span></div>
                    <div className="flex items-center gap-2 text-slate-300 grayscale opacity-50"><ShieldCheck size={24} /><span className="text-[10px] font-black uppercase tracking-widest">Vagas Verificadas</span></div>
                </div>
            </div>

            <footer className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
                <div className="font-black text-sm tracking-[0.4em]">{profile.displayName}</div>
                <div className="text-[8px] font-bold">RECRUITMENT PLATFORM BY CREATIVE PRINT</div>
            </footer>
        </div>
    );
};
