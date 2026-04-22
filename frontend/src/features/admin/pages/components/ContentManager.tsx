
import React, { useState } from 'react';
import { useText } from '@/src/contexts/TextContext';
import { Type, Save, Search, RefreshCw, AlertCircle } from 'lucide-react';

export const ContentManager: React.FC = () => {
    const { texts, updateText, isLoading } = useText();
    const [search, setSearch] = useState('');
    const [localEdits, setLocalEdits] = useState<{[key: string]: string}>({});

    const handleLocalChange = (key: string, value: string) => {
        setLocalEdits(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = (key: string) => {
        if (localEdits[key] !== undefined) {
            updateText(key, localEdits[key]);
            const newEdits = { ...localEdits };
            delete newEdits[key];
            setLocalEdits(newEdits);
        }
    };

    const keys = Object.keys(texts).filter(k => k.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Type size={20}/> Gerenciador de Conteúdo (CMS)
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Edite os textos do site em tempo real sem mexer no código.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-white text-sm focus:border-brand-blue outline-none"
                        placeholder="Buscar chave de texto..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm uppercase flex items-center gap-2"><RefreshCw size={14}/> Textos Globais</h3>
                    <div className="text-xs text-slate-500">
                        {isLoading ? 'Sincronizando...' : 'Sincronizado'}
                    </div>
                </div>
                
                <div className="divide-y divide-slate-800">
                    {keys.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">Nenhum texto encontrado.</div>
                    ) : (
                        keys.map(key => {
                            const originalValue = texts[key];
                            const currentValue = localEdits[key] !== undefined ? localEdits[key] : originalValue;
                            const isDirty = localEdits[key] !== undefined && localEdits[key] !== originalValue;

                            return (
                                <div key={key} className="p-6 hover:bg-slate-800/30 transition-colors">
                                    <div className="flex flex-col md:flex-row gap-4 items-start">
                                        <div className="md:w-1/3">
                                            <div className="font-mono text-xs text-brand-blue bg-brand-blue/10 px-2 py-1 rounded w-fit mb-1">{key}</div>
                                            <p className="text-xs text-slate-500">Chave única de identificação.</p>
                                        </div>
                                        <div className="flex-1 w-full">
                                            <textarea 
                                                className={`w-full bg-slate-950 border rounded-lg p-3 text-white text-sm focus:outline-none transition-all resize-none min-h-[80px] ${isDirty ? 'border-yellow-500/50 focus:border-yellow-500' : 'border-slate-700 focus:border-brand-blue'}`}
                                                value={currentValue}
                                                onChange={e => handleLocalChange(key, e.target.value)}
                                            />
                                            {isDirty && (
                                                <div className="flex justify-end mt-2 animate-fade-in">
                                                    <button 
                                                        onClick={() => handleSave(key)}
                                                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg"
                                                    >
                                                        <Save size={14}/> Salvar Alteração
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-200">
                    <strong className="block text-blue-400 mb-1">Como funciona o Cache Inteligente?</strong>
                    Ao salvar um texto, ele atualiza imediatamente para você. Para os clientes, a atualização pode levar alguns segundos na próxima visita, pois o sistema prioriza a velocidade de carregamento (mostrando a versão antiga do cache) enquanto baixa a nova versão em segundo plano.
                </div>
            </div>
        </div>
    );
};
