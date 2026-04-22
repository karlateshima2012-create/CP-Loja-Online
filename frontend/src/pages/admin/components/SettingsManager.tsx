
import React, { useState } from 'react';
import { mockService } from '@/src/services/mockData';
import { SystemSettings } from '@/src/types';
import { Settings, MessageCircle, Send, CheckCircle, AlertCircle, CreditCard, Banknote, Check } from 'lucide-react';

export const SettingsManager: React.FC = () => {
    const [settings, setSettings] = useState<SystemSettings>(mockService.getSettings());
    const [testingTelegram, setTestingTelegram] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSave = () => {
        mockService.updateSettings(settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }

    const handleTestTelegram = async () => {
        setTestingTelegram(true);
        // Temporarily save to mock service to test current inputs
        mockService.updateSettings(settings);
        
        // We need to cast because testTelegramNotification is a custom helper added to mockService 
        // that isn't strictly part of the interface but exists in the implementation
        const result = await (mockService as any).testTelegramNotification();
        
        if (result) {
            alert("Mensagem de teste enviada! Verifique seu Telegram.");
        } else {
            alert("Falha ao enviar. Verifique o Token e Chat ID.");
        }
        setTestingTelegram(false);
    };

    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden animate-fade-in p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings size={20} /> Configurações do Sistema</h2>
            <div className="space-y-8 max-w-3xl">
                
                {/* --- LOJA --- */}
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b border-slate-800 pb-2">Dados da Loja</h3>
                    <div className="space-y-3">
                         <div><label className="text-xs text-slate-400 font-bold mb-1 block">Nome da Loja</label><input className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white" value={settings.store.storeName} onChange={e => setSettings({...settings, store: {...settings.store, storeName: e.target.value}})} /></div>
                    </div>
                </div>

                {/* --- DADOS BANCÁRIOS (ATUALIZADO) --- */}
                 <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                        <Banknote size={16} /> Dados Bancários (Para Depósito)
                    </h3>
                    
                    <div className="space-y-6">
                        {/* JP Bank Consolidated */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <h4 className="text-sm font-bold text-brand-blue mb-3 uppercase flex items-center gap-2">
                                <CreditCard size={14}/> Transferência pelo Banco do Correio (ゆうちょ銀行)
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 font-bold mb-1 block">Banco</label>
                                    <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" value={settings.payment.jpBankName} onChange={e => setSettings({...settings, payment: {...settings.payment, jpBankName: e.target.value}})} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-400 font-bold mb-1 block">Código do Banco</label>
                                        <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono" value={settings.payment.otherBankCode} onChange={e => setSettings({...settings, payment: {...settings.payment, otherBankCode: e.target.value}})} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 font-bold mb-1 block">Agência / Filial</label>
                                        <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" value={settings.payment.otherBranchName} onChange={e => setSettings({...settings, payment: {...settings.payment, otherBranchName: e.target.value}})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-400 font-bold mb-1 block">Número da Conta</label>
                                        <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono" value={settings.payment.jpAccountNumber} onChange={e => setSettings({...settings, payment: {...settings.payment, jpAccountNumber: e.target.value}})} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 font-bold mb-1 block">Tipo de Conta</label>
                                        <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" value={settings.payment.otherAccountType} onChange={e => setSettings({...settings, payment: {...settings.payment, otherAccountType: e.target.value}})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 font-bold mb-1 block">Nome do Titular</label>
                                    <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white" value={settings.payment.jpHolderName} onChange={e => setSettings({...settings, payment: {...settings.payment, jpHolderName: e.target.value}})} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TELEGRAM NOTIFICATIONS --- */}
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 border-b border-slate-800 pb-2 flex items-center gap-2">
                        <MessageCircle size={16} className="text-blue-400"/> Notificações Telegram
                    </h3>
                    
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.telegram.enabled ? 'bg-blue-500' : 'bg-slate-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.telegram.enabled ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <input type="checkbox" className="hidden" checked={settings.telegram.enabled} onChange={e => setSettings({...settings, telegram: {...settings.telegram, enabled: e.target.checked}})} />
                            <span className={`text-sm font-bold ${settings.telegram.enabled ? 'text-white' : 'text-slate-500'}`}>
                                {settings.telegram.enabled ? 'Notificações Ativas' : 'Notificações Desativadas'}
                            </span>
                        </label>

                        {settings.telegram.enabled && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="text-xs text-slate-400 font-bold mb-1 block">Bot Token</label>
                                    <input 
                                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-xs focus:border-blue-500 outline-none" 
                                        placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                                        value={settings.telegram.botToken} 
                                        onChange={e => setSettings({...settings, telegram: {...settings.telegram, botToken: e.target.value}})} 
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1">Obtenha com o @BotFather no Telegram.</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 font-bold mb-1 block">Chat ID (Seu ID ou Grupo)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-xs focus:border-blue-500 outline-none" 
                                            placeholder="-100123456789"
                                            value={settings.telegram.chatId} 
                                            onChange={e => setSettings({...settings, telegram: {...settings.telegram, chatId: e.target.value}})} 
                                        />
                                        <button 
                                            onClick={handleTestTelegram}
                                            disabled={testingTelegram || !settings.telegram.botToken || !settings.telegram.chatId}
                                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap"
                                        >
                                            {testingTelegram ? <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span> : <Send size={14}/>}
                                            Testar
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">Use @userinfobot para descobrir seu ID.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <button 
                        onClick={handleSave} 
                        disabled={saveSuccess}
                        className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 ${
                            saveSuccess 
                            ? 'bg-green-600 text-white shadow-green-500/20' 
                            : 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-brand-blue/20'
                        }`}
                    >
                        {saveSuccess ? (
                            <><Check size={18}/> Configurações Salvas!</>
                        ) : (
                            <><CheckCircle size={18}/> Salvar Todas Configurações</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
