
import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { Customer, Order } from '@/src/types';
import { Smile, Search, ChevronLeft, User, Phone, Mail, MapPin, ShoppingBag, Clock, FileText, Save, Calendar, Star, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomersManager: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [viewMode, setViewMode] = useState<'LIST' | 'DETAILS'>('LIST');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [search, setSearch] = useState('');
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
    const [customerNotes, setCustomerNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setCustomers(mockService.getCustomers());
        setOrders(mockService.getOrders());
    }, [viewMode]);

    const calculateLTV = (customerId: string) => {
        return orders.filter(o => o.customerId === customerId).reduce((acc, o) => acc + o.totalAmount, 0);
    };

    const handleViewDetails = (c: Customer) => {
        const cOrders = orders.filter(o => o.customerId === c.id);
        const freshCustomer = mockService.getCustomerById(c.id) || c;
        setSelectedCustomer(freshCustomer);
        setCustomerOrders(cOrders);
        setCustomerNotes(freshCustomer.notes || '');
        setViewMode('DETAILS');
    };

    const handleSaveNotes = () => {
        if (!selectedCustomer) return;
        setIsSaving(true);
        setTimeout(() => {
            mockService.updateCustomer(selectedCustomer.id, { notes: customerNotes });
            setIsSaving(false);
            setSelectedCustomer({ ...selectedCustomer, notes: customerNotes });
        }, 500);
    };

    const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
    const sortedCustomers = [...filteredCustomers].sort((a, b) => calculateLTV(b.id) - calculateLTV(a.id));

    if (viewMode === 'DETAILS' && selectedCustomer) {
        const totalSpent = calculateLTV(selectedCustomer.id);

        return (
            <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setViewMode('LIST')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase"><ChevronLeft size={16} /> Voltar para Lista</button>
                    <div className="text-xs text-slate-500 font-mono">ID: {selectedCustomer.id}</div>
                </div>

                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-4 border-slate-700 flex items-center justify-center text-slate-400 shadow-lg shrink-0"><User size={40} /></div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-black text-white mb-2">{selectedCustomer.name}</h1>
                            <div className="flex gap-4 text-sm text-slate-400 mb-4">
                                <div className="flex items-center gap-2"><Mail size={14} /> {selectedCustomer.email}</div>
                                <div className="flex items-center gap-2"><Phone size={14} /> {selectedCustomer.phone || '-'}</div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500"><MapPin size={12} /> {selectedCustomer.address || 'Endereço não informado'}</div>
                        </div>
                        <div className="text-center"><div className="text-xs text-slate-500 uppercase font-bold">Total Gasto (LTV)</div><div className="text-xl font-black text-green-400">¥{totalSpent.toLocaleString()}</div></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-yellow-500 uppercase mb-3 flex items-center gap-2"><FileText size={16} /> Notas Internas (CRM)</h3>
                            <textarea className="w-full bg-slate-900/50 border border-yellow-500/30 rounded-xl p-4 text-white text-sm resize-none h-32 focus:outline-none focus:border-yellow-500" value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} placeholder="Ex: Cliente prefere contato à tarde. Gosta de produtos 3D." />
                            <div className="flex justify-end mt-3"><button onClick={handleSaveNotes} disabled={isSaving} className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2">{isSaving ? 'Salvando...' : <><Save size={14} /> Salvar Nota</>}</button></div>
                        </div>

                        {/* Dados Adicionais */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h3 className="text-sm font-bold text-white uppercase mb-4">Detalhes da Conta</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-500">Origem</span>
                                    <span className="text-white">{selectedCustomer.source || 'Direto'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-500">Cadastrado em</span>
                                    <span className="text-white">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Aniversário</span>
                                    <span className="text-white">{selectedCustomer.birthday || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* PLAN & SUBSCRIPTION CARD */}
                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl border border-indigo-500/30 p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Star size={48} className="text-brand-blue" /></div>
                            <h3 className="text-sm font-bold text-brand-blue uppercase mb-4 flex items-center gap-2">Plano & Assinatura</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase font-black">Status do Plano</div>
                                        <div className={`text-sm font-bold ${selectedCustomer.planStatus === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                                            {selectedCustomer.plan || 'NENHUM'} ({selectedCustomer.planStatus?.toUpperCase() || 'INATIVO'})
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-500 uppercase font-black">Expira em</div>
                                        <div className="text-xs text-white font-mono">{selectedCustomer.planExpirationDate ? new Date(selectedCustomer.planExpirationDate).toLocaleDateString() : '-'}</div>
                                    </div>
                                </div>

                                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors">
                                    <Save size={14} /> Gerenciar Assinatura
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
                            <h3 className="text-sm font-bold text-white uppercase mb-6 flex items-center gap-2"><ShoppingBag size={16} /> Histórico de Pedidos ({customerOrders.length})</h3>
                            <div className="space-y-4">
                                {customerOrders.map(order => (
                                    <div key={order.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1"><Link to={`/admin/dashboard/orders/${order.id}`} className="font-mono font-bold text-brand-blue hover:underline text-sm">{order.id}</Link><span className="text-[10px] px-2 py-0.5 rounded border uppercase font-bold bg-slate-800 text-slate-400 border-slate-700">{order.status}</span></div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="text-right w-full sm:w-auto"><div className="text-white font-bold">¥{order.totalAmount.toLocaleString()}</div></div>
                                    </div>
                                ))}
                                {customerOrders.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">Nenhum pedido encontrado.</div>}
                            </div>
                        </div>
                        {/* DIGITAL ASSETS (Flix Profiles) */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl mt-6">
                            <h3 className="text-sm font-bold text-white uppercase mb-6 flex items-center gap-2"><Eye size={16} className="text-brand-blue" /> Perfis CreativeFlix Vinculados</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mockService.getFlixProfiles().filter(p => p.customerId === selectedCustomer.id).map(profile => (
                                    <div key={profile.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-brand-blue/50 transition-all">
                                        <div className="flex items-center gap-3">
                                            <img src={profile.profileImageUrl} className="w-10 h-10 rounded-full object-cover border border-slate-700" alt="" />
                                            <div>
                                                <div className="text-white font-bold text-sm">/{profile.slug}</div>
                                                <div className="text-[10px] text-slate-500">{profile.displayName}</div>
                                            </div>
                                        </div>
                                        <Link to="/admin/dashboard/flix" className="p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-brand-blue transition-colors">
                                            <Edit size={16} />
                                        </Link>
                                    </div>
                                ))}
                                {mockService.getFlixProfiles().filter(p => p.customerId === selectedCustomer.id).length === 0 && (
                                    <div className="col-span-2 text-center py-6 text-slate-600 text-xs italic border border-slate-800 border-dashed rounded-xl">
                                        Nenhum perfil digital configurado para este cliente.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Smile size={24} className="text-brand-yellow" /> Gestão de Clientes (CRM)</h2>
                <div className="relative w-full md:w-72"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand-blue outline-none" placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-950 text-slate-500 uppercase text-xs font-bold tracking-wider">
                        <tr><th className="px-6 py-4">Cliente</th><th className="px-6 py-4">Contato</th><th className="px-6 py-4 text-center">Pedidos</th><th className="px-6 py-4 text-right text-green-400">LTV (Total Gasto)</th><th className="px-6 py-4 text-right">Ação</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {sortedCustomers.map(customer => (
                            <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => handleViewDetails(customer)}>
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold border border-slate-700">{customer.name.substring(0, 2).toUpperCase()}</div><div className="text-white font-bold">{customer.name}</div></div></td>
                                <td className="px-6 py-4">{customer.email}</td>
                                <td className="px-6 py-4 text-center font-bold text-white">{customer.ordersCount}</td>
                                <td className="px-6 py-4 text-right font-black text-green-400">¥{calculateLTV(customer.id).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right"><button onClick={(e) => { e.stopPropagation(); handleViewDetails(customer); }} className="text-brand-blue font-bold text-xs hover:underline">Ver Perfil</button></td>
                            </tr>
                        ))}
                        {sortedCustomers.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum cliente encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
