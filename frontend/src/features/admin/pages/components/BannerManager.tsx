import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { StoreBanner } from '@/src/types';
import { Save, Image as ImageIcon, Type, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

export const BannerManager: React.FC = () => {
    const [banner, setBanner] = useState<StoreBanner | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setBanner(mockService.getStoreBanner());
    }, []);

    const handleSave = () => {
        if (!banner) return;
        setIsSaving(true);
        mockService.updateStoreBanner(banner);
        
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 800);
    };

    if (!banner) return null;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Banner da Loja</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Gerencie o banner promocional que aparece entre os produtos.</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className={`bg-brand-blue text-slate-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all active:scale-95 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
                </button>
            </div>

            {showSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-3 text-green-400 animate-fade-in-up">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">Configurações salvas com sucesso!</span>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* CONFIGURAÇÃO */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-2">
                            <ImageIcon size={18} className="text-brand-blue" />
                            <h3 className="font-black text-white uppercase tracking-widest text-xs">Visual & Mídia</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">URL da Imagem de Fundo</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-brand-blue transition-all outline-none font-medium" 
                                value={banner.imageUrl} 
                                onChange={(e) => setBanner({...banner, imageUrl: e.target.value})} 
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button 
                                onClick={() => setBanner({...banner, active: !banner.active})}
                                className={`flex-1 p-4 rounded-2xl border transition-all flex items-center justify-center gap-3 ${banner.active ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                            >
                                {banner.active ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <span className="font-black text-[10px] uppercase tracking-widest">{banner.active ? 'Banner Ativado' : 'Banner Desativado'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-2">
                            <Type size={18} className="text-brand-pink" />
                            <h3 className="font-black text-white uppercase tracking-widest text-xs">Textos do Banner</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tagline (Topo)</label>
                                <input 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-brand-blue transition-all outline-none font-medium" 
                                    value={banner.tagline} 
                                    onChange={(e) => setBanner({...banner, tagline: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Destaque (Azul)</label>
                                <input 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-brand-blue transition-all outline-none font-medium" 
                                    value={banner.subtitle} 
                                    onChange={(e) => setBanner({...banner, subtitle: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Título Principal</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-brand-blue transition-all outline-none font-medium" 
                                value={banner.title} 
                                onChange={(e) => setBanner({...banner, title: e.target.value})} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição (Breve)</label>
                            <textarea 
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:border-brand-blue transition-all outline-none h-24 font-medium resize-none" 
                                value={banner.description} 
                                onChange={(e) => setBanner({...banner, description: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>

                {/* PREVIEW */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-8">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                            <Eye size={18} className="text-slate-400" />
                            <h3 className="font-black text-white uppercase tracking-widest text-xs">Preview em Tempo Real</h3>
                        </div>

                        <div className={`relative w-full h-[180px] md:h-[300px] rounded-3xl overflow-hidden group border border-white/5 shadow-2xl transition-all ${!banner.active ? 'opacity-30 grayscale' : ''}`}>
                            <img 
                                src={banner.imageUrl} 
                                className="absolute inset-0 w-full h-full object-cover" 
                                alt="Preview"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center p-6 md:p-12">
                                <div className="max-w-xl">
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue mb-2 block leading-none">{banner.tagline}</span>
                                    <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                                        {banner.title} <br/> <span className="text-brand-blue">{banner.subtitle}</span>
                                    </h3>
                                    <p className="text-white/60 text-[10px] md:text-xs font-medium max-w-sm line-clamp-2">
                                        {banner.description}
                                    </p>
                                </div>
                            </div>
                            {!banner.active && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                                    <span className="bg-slate-900 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-2xl">Banner Desativado</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 p-6 bg-slate-950 rounded-2xl border border-slate-800">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertCircle size={14} /> Dicas de UI/UX
                            </h4>
                            <ul className="space-y-3">
                                <li className="text-[11px] text-slate-400 flex gap-2">
                                    <span className="text-brand-blue">•</span>
                                    Use imagens com fundo escuro para melhor legibilidade dos textos brancos.
                                </li>
                                <li className="text-[11px] text-slate-400 flex gap-2">
                                    <span className="text-brand-blue">•</span>
                                    Mantenha o título principal curto (máximo 4 palavras).
                                </li>
                                <li className="text-[11px] text-slate-400 flex gap-2">
                                    <span className="text-brand-blue">•</span>
                                    O border-radius de 2xl agora está unificado com os cards de produtos.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
