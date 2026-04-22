
import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { Testimonial, TestimonialSource } from '@/src/types';
import { MessageSquare, Plus, Edit, Trash2, X, Save, Star, Chrome, Instagram, MessageCircle, Mail, MessageCircle as ReplyIcon, Store, Eye, EyeOff } from 'lucide-react';

export const TestimonialsManager: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Testimonial>>({});
    
    // Reply State
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        setTestimonials(mockService.getTestimonials());
    }, []);

    const handleNew = () => {
        setEditForm({ rating: 5, source: TestimonialSource.GOOGLE, date: new Date().toISOString(), approved: true });
        setIsEditing(true);
    };

    const handleEdit = (t: Testimonial) => {
        setEditForm({ ...t });
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Excluir depoimento?')) {
            mockService.deleteTestimonial(id);
            setTestimonials([...mockService.getTestimonials()]);
        }
    };

    const toggleVisibility = (t: Testimonial) => {
        const updated = { ...t, approved: !t.approved };
        mockService.saveTestimonial(updated);
        setTestimonials([...mockService.getTestimonials()]);
    };

    const handleSave = () => {
        if (!editForm.name || !editForm.content) {
            alert("Nome e Conteúdo são obrigatórios.");
            return;
        }
        
        mockService.saveTestimonial(editForm as Testimonial);
        setTestimonials([...mockService.getTestimonials()]);
        setIsEditing(false);
        setEditForm({});
    };

    const openReply = (t: Testimonial) => {
        setReplyingId(t.id);
        setReplyText(t.reply || '');
    };

    const saveReply = (t: Testimonial) => {
        const updated = { ...t, reply: replyText };
        mockService.saveTestimonial(updated);
        setTestimonials([...mockService.getTestimonials()]);
        setReplyingId(null);
        setReplyText('');
    };

    const getSourceIcon = (source: string) => {
        switch(source) {
            case TestimonialSource.GOOGLE: return <Chrome size={16} className="text-blue-400"/>;
            case TestimonialSource.INSTAGRAM: return <Instagram size={16} className="text-pink-500"/>;
            case TestimonialSource.WHATSAPP: return <MessageCircle size={16} className="text-green-500"/>;
            case TestimonialSource.EMAIL: return <Mail size={16} className="text-slate-400"/>;
            case TestimonialSource.STORE: return <Store size={16} className="text-brand-yellow"/>;
            default: return <MessageSquare size={16}/>;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><MessageSquare size={20}/> Gerenciar Depoimentos (Prova Social)</h2>
                <button onClick={handleNew} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue/90 transition-colors">
                    <Plus size={16}/> Novo Depoimento
                </button>
            </div>

            {isEditing && (
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl mb-6">
                    <div className="flex justify-between items-start mb-6">
                         <h3 className="font-bold text-white text-lg">{editForm.id ? 'Editar Depoimento' : 'Novo Depoimento'}</h3>
                         <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nome do Cliente</label>
                            <input className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cargo / Empresa (Opcional)</label>
                            <input className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" value={editForm.role || ''} onChange={e => setEditForm({...editForm, role: e.target.value})} placeholder="Ex: CEO Tech Japan" />
                        </div>
                        
                        <div className="col-span-full">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Conteúdo do Depoimento</label>
                            <textarea className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white h-24 resize-none" value={editForm.content || ''} onChange={e => setEditForm({...editForm, content: e.target.value})} />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Origem (Fonte)</label>
                            <div className="flex gap-4 flex-wrap">
                                {Object.values(TestimonialSource).map(src => (
                                    <button 
                                        key={src}
                                        onClick={() => setEditForm({...editForm, source: src})}
                                        className={`p-2 rounded border flex items-center justify-center gap-2 ${editForm.source === src ? 'bg-slate-800 border-brand-blue text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                                    >
                                        {getSourceIcon(src)}
                                        <span className="text-xs font-bold">{src.replace('_', ' ')}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Avaliação (1-5)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="range" min="1" max="5" step="1" 
                                    className="w-full accent-brand-yellow" 
                                    value={editForm.rating || 5} 
                                    onChange={e => setEditForm({...editForm, rating: Number(e.target.value)})} 
                                />
                                <div className="text-brand-yellow font-bold text-lg w-8 text-center">{editForm.rating}</div>
                                <Star size={16} className="text-brand-yellow" fill="currentColor"/>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Visibilidade</label>
                            <label className="flex items-center gap-3 cursor-pointer text-white">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-brand-blue focus:ring-brand-blue"
                                    checked={editForm.approved}
                                    onChange={e => setEditForm({...editForm, approved: e.target.checked})}
                                />
                                <span>Aprovado (Visível na Home)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                         <button onClick={() => setIsEditing(false)} className="bg-slate-700 text-white px-4 py-2 rounded font-bold">Cancelar</button>
                         <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                            <Save size={18}/> Salvar
                         </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map(t => (
                    <div key={t.id} className={`bg-slate-900 border rounded-2xl p-6 relative group transition-colors flex flex-col ${!t.approved ? 'border-red-900/30 opacity-75 hover:opacity-100' : 'border-slate-800 hover:border-slate-600'}`}>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(t)} className="p-1.5 bg-blue-600 rounded hover:bg-blue-500 text-white"><Edit size={14}/></button>
                            <button onClick={() => handleDelete(t.id)} className="p-1.5 bg-red-600 rounded hover:bg-red-500 text-white"><Trash2 size={14}/></button>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                {getSourceIcon(t.source)}
                                <span className={`text-[10px] font-bold uppercase ${t.source === TestimonialSource.STORE ? 'text-brand-yellow' : 'text-slate-500'}`}>
                                    {t.source === TestimonialSource.STORE ? 'Via Loja Virtual' : t.source.replace('_', ' ')}
                                </span>
                            </div>
                            
                            {/* Toggle Approval Button */}
                            <button 
                                onClick={() => toggleVisibility(t)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border transition-all ${
                                    t.approved 
                                    ? 'bg-green-900/20 text-green-400 border-green-500/30 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/30' 
                                    : 'bg-red-900/20 text-red-400 border-red-500/30 hover:bg-green-900/20 hover:text-green-400 hover:border-green-500/30 animate-pulse'
                                }`}
                                title={t.approved ? "Ocultar da Home" : "Aprovar para Home"}
                            >
                                {t.approved ? <><Eye size={12}/> Visível</> : <><EyeOff size={12}/> Oculto</>}
                            </button>
                        </div>

                        <div className="flex-1">
                            <p className="text-slate-300 text-sm italic mb-4">"{t.content}"</p>
                            
                            {/* Admin Reply Section */}
                            {t.reply && replyingId !== t.id && (
                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4 text-xs">
                                    <span className="text-brand-blue font-bold block mb-1">Resposta da Loja:</span>
                                    <span className="text-slate-400">{t.reply}</span>
                                </div>
                            )}

                            {replyingId === t.id && (
                                <div className="mb-4 animate-fade-in">
                                    <textarea 
                                        className="w-full bg-slate-950 border border-brand-blue rounded-lg p-2 text-white text-xs resize-none h-20 outline-none mb-2"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Escreva sua resposta..."
                                        autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setReplyingId(null)} className="text-xs text-slate-500 hover:text-white">Cancelar</button>
                                        <button onClick={() => saveReply(t)} className="bg-brand-blue text-white px-3 py-1 rounded text-xs font-bold">Enviar</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
                            <div>
                                <div className="font-bold text-white text-sm">{t.name}</div>
                                <div className="text-xs text-slate-500">{t.role || 'Cliente'}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex gap-0.5">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} size={12} className="text-brand-yellow" fill="currentColor" />
                                    ))}
                                </div>
                                {!replyingId && (
                                    <button 
                                        onClick={() => openReply(t)} 
                                        className="text-[10px] text-brand-blue hover:underline flex items-center gap-1 font-bold"
                                    >
                                        <ReplyIcon size={10} /> {t.reply ? 'Editar Resposta' : 'Responder'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
