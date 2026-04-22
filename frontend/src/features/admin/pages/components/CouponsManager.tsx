
import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { Coupon, Customer } from '@/src/types';
import { Ticket, Plus, Edit, Trash2, X, Save, Calendar, CheckCircle, Ban, User, Search, Clock } from 'lucide-react';

export const CouponsManager: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Coupon>>({});
    
    // Estados para a busca dinâmica de clientes
    const [customerSearch, setCustomerSearch] = useState('');
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        setCoupons(mockService.getCoupons());
        setCustomers(mockService.getCustomers());
    }, []);

    const handleNew = () => {
        setEditForm({ 
            active: true, 
            discountPercentage: 0.10, // Default 10%
            expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0] // +1 month
        });
        setCustomerSearch('');
        setIsEditing(true);
    };

    const handleEdit = (c: Coupon) => {
        setEditForm({ ...c });
        setCustomerSearch('');
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Excluir este cupom?')) {
            mockService.deleteCoupon(id);
            setCoupons([...mockService.getCoupons()]);
        }
    };

    const handleSave = () => {
        if (!editForm.code || !editForm.expirationDate) {
            alert("Código e Data de Validade são obrigatórios.");
            return;
        }
        
        // Ensure discount is stored as decimal
        if (editForm.discountPercentage && editForm.discountPercentage > 1) {
             editForm.discountPercentage = editForm.discountPercentage / 100;
        }

        mockService.saveCoupon(editForm as Coupon);
        setCoupons([...mockService.getCoupons()]);
        setIsEditing(false);
        setEditForm({});
    };

    // Funções para seleção de cliente
    const filteredCustomers = customerSearch 
        ? customers.filter(c => 
            c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
            c.email.toLowerCase().includes(customerSearch.toLowerCase())
          )
        : [];

    const selectCustomer = (customer: Customer) => {
        setEditForm({ ...editForm, customerId: customer.id });
        setCustomerSearch('');
        setShowResults(false);
    };

    const clearCustomerSelection = () => {
        setEditForm({ ...editForm, customerId: undefined });
        setCustomerSearch('');
    };

    const isExpired = (dateStr: string) => {
        return new Date(dateStr) < new Date();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Ticket size={20}/> Gerenciar Cupons de Desconto</h2>
                <button onClick={handleNew} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue/90 transition-colors">
                    <Plus size={16}/> Novo Cupom
                </button>
            </div>

            {isEditing && (
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl mb-6">
                    <div className="flex justify-between items-start mb-6">
                         <h3 className="font-bold text-white text-lg">{editForm.id ? 'Editar Cupom' : 'Criar Novo Cupom'}</h3>
                         <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Código do Cupom</label>
                            <input 
                                disabled={!!editForm.used}
                                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono uppercase disabled:opacity-50" 
                                value={editForm.code || ''} 
                                onChange={e => setEditForm({...editForm, code: e.target.value.toUpperCase()})}
                                placeholder="EX: PROMO10"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Desconto (%)</label>
                            <div className="relative">
                                <input 
                                    disabled={!!editForm.used}
                                    type="number" min="1" max="100"
                                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white disabled:opacity-50" 
                                    value={editForm.discountPercentage ? (editForm.discountPercentage * 100).toFixed(0) : ''} 
                                    onChange={e => setEditForm({...editForm, discountPercentage: Number(e.target.value) / 100})} 
                                    placeholder="10"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Data de Validade</label>
                            <input 
                                disabled={!!editForm.used}
                                type="date"
                                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white [color-scheme:dark] disabled:opacity-50" 
                                value={editForm.expirationDate || ''} 
                                onChange={e => setEditForm({...editForm, expirationDate: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Status</label>
                            {editForm.used ? (
                                <div className="text-orange-400 font-bold text-sm bg-orange-900/20 border border-orange-500/30 p-2 rounded w-fit">
                                    CUPOM UTILIZADO (Não editável)
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer text-white">
                                        <input type="radio" checked={editForm.active === true} onChange={() => setEditForm({...editForm, active: true})} />
                                        Ativo
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-white">
                                        <input type="radio" checked={editForm.active === false} onChange={() => setEditForm({...editForm, active: false})} />
                                        Inativo
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="col-span-full relative">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                                <User size={14}/> Vincular a Cliente Específico (Opcional)
                            </label>
                            
                            {editForm.customerId ? (
                                // Estado: Cliente Selecionado
                                <div className="flex items-center gap-3 bg-brand-blue/10 border border-brand-blue/30 p-3 rounded-lg">
                                    <div className="bg-brand-blue text-white p-2 rounded-full">
                                        <User size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-bold text-sm">
                                            {customers.find(c => c.id === editForm.customerId)?.name || 'Cliente não encontrado'}
                                        </div>
                                        <div className="text-brand-blue text-xs">
                                            {customers.find(c => c.id === editForm.customerId)?.email}
                                        </div>
                                    </div>
                                    {!editForm.used && (
                                        <button 
                                            onClick={clearCustomerSelection}
                                            className="text-slate-400 hover:text-red-400 p-2 transition-colors"
                                            title="Remover cliente"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                // Estado: Busca de Cliente
                                <div className="relative">
                                    {!editForm.used ? (
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input 
                                                className="w-full bg-slate-950 border border-slate-700 rounded px-3 pl-10 py-2 text-white placeholder-slate-600 focus:border-brand-blue outline-none"
                                                value={customerSearch}
                                                onChange={e => {
                                                    setCustomerSearch(e.target.value);
                                                    setShowResults(true);
                                                }}
                                                onFocus={() => setShowResults(true)}
                                                placeholder="Buscar por nome ou email do cliente..."
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 italic text-sm">Cupom Geral (Utilizado)</div>
                                    )}
                                    
                                    {showResults && customerSearch && (
                                        <div className="absolute top-full left-0 w-full bg-slate-900 border border-slate-700 rounded-b-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                                            {filteredCustomers.length > 0 ? (
                                                filteredCustomers.map(cust => (
                                                    <button 
                                                        key={cust.id}
                                                        onClick={() => selectCustomer(cust)}
                                                        className="w-full text-left p-3 hover:bg-slate-800 border-b border-slate-800 last:border-0 transition-colors flex flex-col"
                                                    >
                                                        <span className="text-white font-bold text-sm">{cust.name}</span>
                                                        <span className="text-slate-500 text-xs">{cust.email}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-3 text-slate-500 text-sm text-center">Nenhum cliente encontrado.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <p className="text-[10px] text-slate-500 mt-2">
                                Se nenhum cliente for selecionado, o cupom será <strong>Geral</strong> (válido para todos).
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                         <button onClick={() => setIsEditing(false)} className="bg-slate-700 text-white px-4 py-2 rounded font-bold">Cancelar</button>
                         {!editForm.used && (
                             <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                                <Save size={18}/> Salvar Cupom
                             </button>
                         )}
                    </div>
                </div>
            )}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                 <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Código</th>
                            <th className="px-6 py-4">Desconto</th>
                            <th className="px-6 py-4">Restrição</th>
                            <th className="px-6 py-4">Validade</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {coupons.map(c => {
                            const expired = isExpired(c.expirationDate);
                            const customerName = c.customerId ? customers.find(cust => cust.id === c.customerId)?.name : null;

                            return (
                                <tr key={c.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 font-mono font-bold text-white">{c.code}</td>
                                    <td className="px-6 py-4 font-bold text-green-400">{(c.discountPercentage * 100).toFixed(0)}%</td>
                                    <td className="px-6 py-4 text-xs">
                                        {customerName ? (
                                            <span className="text-brand-blue flex items-center gap-1"><User size={12}/> {customerName}</span>
                                        ) : (
                                            <span className="text-slate-500">Geral</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <Calendar size={14}/> {new Date(c.expirationDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.used ? (
                                            <span className="flex items-center gap-1 text-orange-400 text-xs font-bold uppercase bg-orange-900/20 px-2 py-1 rounded border border-orange-500/50 w-fit">
                                                <Clock size={12}/> Utilizado
                                            </span>
                                        ) : expired ? (
                                            <span className="flex items-center gap-1 text-red-400 text-xs font-bold uppercase bg-red-900/20 px-2 py-1 rounded border border-red-900/50 w-fit">
                                                <Ban size={12}/> Expirado
                                            </span>
                                        ) : !c.active ? (
                                            <span className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase bg-slate-800 px-2 py-1 rounded border border-slate-700 w-fit">
                                                <Ban size={12}/> Inativo
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-green-400 text-xs font-bold uppercase bg-green-900/20 px-2 py-1 rounded border border-green-900/50 w-fit">
                                                <CheckCircle size={12}/> Ativo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(c)} className="p-2 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(c.id)} className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            );
                        })}
                        {coupons.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-8 text-slate-500">Nenhum cupom cadastrado.</td></tr>
                        )}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};
