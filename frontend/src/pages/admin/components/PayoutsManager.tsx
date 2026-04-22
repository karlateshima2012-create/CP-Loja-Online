import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { Payout, Partner, CommissionStatus } from '@/src/types';
import { DollarSign, Users, Calendar, CheckCircle, RefreshCw, AlertCircle, Wallet, ArrowRight, Clock, FileText } from 'lucide-react';

export const PayoutsManager: React.FC = () => {
    const [tick, setTick] = useState(0); 
    
    // State initialization
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [selectedPartnerId, setSelectedPartnerId] = useState('');
    
    // Default to current month
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const d = new Date();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        return `${d.getFullYear()}-${month}`;
    });
    
    // Confirmation States
    const [confirmingGen, setConfirmingGen] = useState(false);
    const [confirmingPayId, setConfirmingPayId] = useState<string | null>(null);
    
    const [previewItems, setPreviewItems] = useState<any[]>([]);

    // 1. Load Initial Data
    useEffect(() => {
        setPayouts([...mockService.getPayouts()]);
        setPartners(mockService.getPartners());
        
        const pts = mockService.getPartners();
        if (pts.length > 0 && !selectedPartnerId) {
            setSelectedPartnerId(pts[0].id);
        }
    }, [tick]);

    // 2. Refresh Preview Items (Items waiting to be GENERATED)
    useEffect(() => {
        setConfirmingGen(false);
        if (!selectedPartnerId) return;

        // Get commissions that are pending commission status
        // Note: In our mock service, 'generatePayout' turns individual commissions to PAID status
        // and creates a Payout record. So 'pending commissions' are ones not yet in a Payout.
        const pendingComms = mockService.getPendingCommissions(selectedPartnerId, selectedMonth);
        
        const enrichedItems = pendingComms.map(c => {
            const order = mockService.getOrders().find(o => o.id === c.orderId);
            return {
                id: c.id,
                date: c.date,
                amount: c.amount,
                orderId: c.orderId,
                customer: order?.customerName || 'N/A',
                orderStatus: order?.status || 'UNKNOWN',
                orderTotal: order?.totalAmount || 0
            };
        }).filter(item => {
             // Filter only eligible orders for generation
             const s = item.orderStatus;
             return s === 'PAID' || s === 'SHIPPED' || s === 'RECEIVED' || s === 'COMPLETED';
        });
        
        setPreviewItems(enrichedItems);
    }, [selectedPartnerId, selectedMonth, tick]); 

    // --- SEGREGATE PAYOUTS LISTS ---
    // List 1: Generated but NOT Paid (The "Middle" Step)
    const generatedPendingPayouts = payouts.filter(p => p.status === CommissionStatus.PENDING);
    
    // List 2: History (Paid)
    const paidHistory = payouts.filter(p => p.status === CommissionStatus.PAID);

    const totalToGenerate = previewItems.reduce((acc, item) => acc + item.amount, 0);

    // --- ACTIONS ---

    // 1. GENERATE (Move from Preview -> Pending List)
    const handleGenerate = () => {
        if (!confirmingGen) {
            setConfirmingGen(true);
            return;
        }

        if (totalToGenerate > 0) {
            const success = mockService.generatePayout(selectedPartnerId, selectedMonth);
            if (success) {
                setConfirmingGen(false);
                setTick(t => t + 1);
                alert("Comissão gerada com sucesso! Ela agora está na lista de 'Aguardando Pagamento'.");
            } else {
                alert("Erro ao gerar comissão.");
            }
        }
    };

    // 2. PAY (Move from Pending List -> History)
    const handleMarkAsPaid = (payoutId: string) => {
        if (confirmingPayId !== payoutId) {
            setConfirmingPayId(payoutId);
            return;
        }

        const success = mockService.markPayoutPaid(payoutId);
        if (success) {
            setConfirmingPayId(null);
            setTick(t => t + 1);
            alert("Pagamento confirmado! Movido para o histórico.");
        } else {
            alert("Erro ao atualizar pagamento.");
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
             
             {/* =================================================================================
                 ETAPA 1: GERADOR DE COMISSÃO
                 Selecione parceiro/mês -> Veja o que está acumulado -> Gere o registro
                 ================================================================================= */}
             <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <FileText size={100} />
                </div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="bg-brand-blue/20 text-brand-blue p-2 rounded-lg"><PlusIcon /></div>
                    1. Gerar Nova Comissão
                </h2>
                
                {/* Control Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Parceiro</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-brand-blue outline-none appearance-none cursor-pointer" 
                                value={selectedPartnerId} 
                                onChange={e => setSelectedPartnerId(e.target.value)}
                            >
                                {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Mês de Referência</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                            <input 
                                type="month" 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-brand-blue outline-none [color-scheme:dark]" 
                                value={selectedMonth} 
                                onChange={e => setSelectedMonth(e.target.value)} 
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-end">
                         <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 w-full flex justify-between items-center px-4">
                            <span className="text-xs font-bold text-slate-500 uppercase">Acumulado Disponível</span>
                            <span className="text-xl font-black text-brand-blue">
                                ¥{totalToGenerate.toLocaleString()}
                            </span>
                         </div>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-end pt-4 border-t border-slate-800">
                    {totalToGenerate > 0 ? (
                        <button 
                            type="button"
                            onClick={handleGenerate} 
                            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                                confirmingGen 
                                ? 'bg-orange-600 hover:bg-orange-700 text-white animate-pulse' 
                                : 'bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/20'
                            }`}
                        >
                            {confirmingGen ? (
                                <><AlertCircle size={18}/> Confirmar Geração?</>
                            ) : (
                                <><FileText size={18}/> Gerar Comissão</>
                            )}
                        </button>
                    ) : (
                        <button disabled className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 bg-slate-800 text-slate-500 cursor-not-allowed">
                            <CheckCircle size={18}/> Nada Pendente para Gerar
                        </button>
                    )}
                </div>
            </div>

            {/* =================================================================================
                 ETAPA 2: LISTA DE PENDENTES (AGUARDANDO PAGAMENTO)
                 Aqui aparecem os repasses gerados. O usuário clica para pagar.
                 ================================================================================= */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 relative">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Clock size={100} />
                </div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                         <div className="bg-orange-900/20 text-orange-400 p-2 rounded-lg"><Clock size={20} /></div>
                         2. Comissões Geradas (Aguardando Pagamento)
                    </h2>
                    <button onClick={() => setTick(t => t + 1)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"><RefreshCw size={16}/></button>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-lg">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">ID Repasse</th>
                                <th className="px-6 py-4">Parceiro</th>
                                <th className="px-6 py-4">Mês Ref.</th>
                                <th className="px-6 py-4 text-right">Valor Total</th>
                                <th className="px-6 py-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                            {generatedPendingPayouts.map(p => {
                                const partnerName = partners.find(pa => pa.id === p.partnerId)?.name || p.partnerId;
                                const isConfirming = confirmingPayId === p.id;

                                return (
                                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-white">{p.id}</td>
                                        <td className="px-6 py-4 font-bold text-white">{partnerName}</td>
                                        <td className="px-6 py-4">{p.period}</td>
                                        <td className="px-6 py-4 text-right font-black text-orange-400 text-base">¥{p.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 flex justify-center">
                                            <button 
                                                onClick={() => handleMarkAsPaid(p.id)}
                                                className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                                                    isConfirming 
                                                    ? 'bg-green-600 hover:bg-green-500 text-white animate-pulse' 
                                                    : 'bg-slate-800 hover:bg-green-600 text-slate-300 hover:text-white border border-slate-700 hover:border-green-500'
                                                }`}
                                            >
                                                {isConfirming ? (
                                                    <><CheckCircle size={14} /> Confirmar?</>
                                                ) : (
                                                    <><Wallet size={14} /> Marcar como Pago</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {generatedPendingPayouts.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-500 italic">Nenhuma comissão pendente de pagamento.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =================================================================================
                 ETAPA 3: HISTÓRICO DE PAGAMENTOS
                 Apenas o que já foi pago.
                 ================================================================================= */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 relative">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <CheckCircle size={100} />
                </div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="bg-green-900/20 text-green-400 p-2 rounded-lg"><CheckCircle size={20} /></div>
                    3. Histórico de Pagamentos Realizados
                </h2>
                 <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">ID Transação</th>
                            <th className="px-6 py-4">Parceiro</th>
                            <th className="px-6 py-4">Referência</th>
                            <th className="px-6 py-4 text-right">Valor Pago</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Data do Pagamento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {paidHistory.map(p => {
                             const partnerName = partners.find(pa => pa.id === p.partnerId)?.name || p.partnerId;
                             
                             return (
                                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">{p.id}</td>
                                    <td className="px-6 py-4 text-white font-medium">{partnerName}</td>
                                    <td className="px-6 py-4">{p.period}</td>
                                    <td className="px-6 py-4 text-right text-white font-bold">¥{p.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase border bg-green-900/30 text-green-400 border-green-500/30">
                                            Pago
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-slate-300">
                                        {new Date(p.date).toLocaleString()}
                                    </td>
                                </tr>
                             )
                        })}
                        {paidHistory.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-8 text-slate-500">Nenhum pagamento registrado no histórico.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Helper Icon
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

