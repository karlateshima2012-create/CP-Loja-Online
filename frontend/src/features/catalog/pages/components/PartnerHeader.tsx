
import React from 'react';
import { Partner } from '@/src/types';
import { BadgeCheck, Star, CheckCircle, ShieldCheck } from 'lucide-react';

interface PartnerHeaderProps {
    partner: Partner;
}

export const PartnerHeader: React.FC<PartnerHeaderProps> = ({ partner }) => {
    return (
        <div className="container mx-auto px-4 mt-8 mb-8">
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-brand-blue/30 shadow-2xl relative overflow-hidden">
                {/* Background FX */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                    
                    {/* LEFT COLUMN: Profile Info */}
                    <div className="flex flex-col md:flex-row items-center gap-6 flex-1 text-center md:text-left w-full">
                        <div className="relative shrink-0">
                            <img 
                                src={partner.photoUrl} 
                                alt={partner.name} 
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-brand-blue shadow-[0_0_30px_rgba(36,155,203,0.4)] bg-slate-800"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-brand-blue text-white p-1.5 rounded-full border-4 border-slate-900 shadow-lg" title="Parceiro Oficial">
                                <BadgeCheck size={16} />
                            </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">{partner.name}</h1>
                            <p className="text-brand-gray text-sm md:text-base leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                                {partner.bio}
                            </p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 font-bold flex items-center gap-2 shadow-sm">
                                    <Star size={12} className="text-brand-yellow"/> Produtos Exclusivos
                                </div>
                                <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 font-bold flex items-center gap-2 shadow-sm">
                                    <CheckCircle size={12} className="text-brand-blue"/> Curadoria CP
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Verified Badge Card */}
                    <div className="w-full lg:w-auto lg:max-w-md shrink-0">
                        <div className="bg-slate-950/60 backdrop-blur-sm border border-slate-800 hover:border-green-500/30 rounded-2xl p-5 flex gap-5 items-center shadow-lg transition-colors">
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-full shrink-0 shadow-[0_0_15px_rgba(74,222,128,0.1)] flex items-center justify-center">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">
                                    Parceiro Verificado Creative Print 
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Você está comprando na loja oficial de <strong className="text-slate-200">{partner.name}</strong>. 
                                    Todo o processamento do pedido, produção e entrega é garantido pela infraestrutura da Creative Print.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
