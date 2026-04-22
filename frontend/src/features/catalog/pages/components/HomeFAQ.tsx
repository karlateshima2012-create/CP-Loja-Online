
import React from 'react';
import { HelpCircle, Bot, User } from 'lucide-react';
import { T } from '@/src/contexts/TextContext';

export const HomeFAQ: React.FC = () => {
    // FAQ Data Structure mapped to CMS Keys
    const faqs = [
        { q: 'home_faq_q1', a: 'home_faq_a1' },
        { q: 'home_faq_q2', a: 'home_faq_a2' },
        { q: 'home_faq_q3', a: 'home_faq_a3' },
        { q: 'home_faq_q4', a: 'home_faq_a4' },
    ];

    return (
        <div id="faq" className="bg-slate-950 py-24 border-t border-slate-900 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">
                        <HelpCircle size={14} /> TIRA DÚVIDAS
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white">
                        <T k="home_faq_title" default="Perguntas Frequentes" />
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-brand-blue/30 transition-colors flex flex-col shadow-lg">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                                        <Bot size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white uppercase">Dúvida #{100 + index}</div>
                                        <div className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Resolvido</div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-500">Enviado agora</div>
                            </div>
                            <div className="space-y-6 flex-1">
                                <div className="flex justify-end items-end gap-3">
                                    <div className="bg-slate-800 text-brand-blue p-5 rounded-2xl rounded-tr-sm text-base leading-relaxed max-w-[90%] shadow-sm">
                                        <T k={faq.q} />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                                        <User size={20} />
                                    </div>
                                </div>
                                <div className="flex justify-start items-end gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-brand-yellow flex items-center justify-center shrink-0">
                                        <Bot size={20} />
                                    </div>
                                    <div className="bg-slate-800 text-slate-100 p-5 rounded-2xl rounded-tl-sm text-base leading-relaxed max-w-[90%] shadow-sm">
                                        <T k={faq.a} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
