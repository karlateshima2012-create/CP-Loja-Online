
import React, { useState, useEffect } from 'react';
import { mockService } from '@/src/services/mockData';
import { Partner, Order, Product, CommissionRecord } from '@/src/types';
import { Users, Plus, Edit, Eye, ChevronLeft, DollarSign, ShoppingBag, Trophy, Clock, Store, Globe, Save, ExternalLink, Calendar, Wallet, MapPin, Mail, Phone, CreditCard, FileText, Filter, Copy, CheckCircle } from 'lucide-react';

export const PartnersManager: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [viewMode, setViewMode] = useState<'LIST' | 'FORM' | 'DETAILS'>('LIST');
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    
    // Context Data
    const [partnerHistory, setPartnerHistory] = useState<Order[]>([]);
    const [partnerCommissions, setPartnerCommissions] = useState<CommissionRecord[]>([]);
    const [exclusiveProducts, setExclusiveProducts] = useState<Product[]>([]);
    
    // Filters & Form
    const [formData, setFormData] = useState<Partial<Partner>>({});
    const [performanceMonth, setPerformanceMonth] = useState('');
    
    // UI State
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Recarrega a lista sempre que muda o modo de visualização para garantir dados atualizados
        setPartners(mockService.getPartners());
    }, [viewMode]); 

    const loadPartnerContextData = (partnerId: string) => {
        setPartnerHistory(mockService.getPartnerOrders(partnerId));
        setPartnerCommissions(mockService.getPartnerCommissions(partnerId));
        const allProducts = mockService.getProducts();
        setExclusiveProducts(allProducts.filter(p => p.partnerId === partnerId && p.isExclusive));
    };

    // Helper to Capitalize Words
    const capitalize = (str: string) => str.replace(/\b\w/g, l => l.toUpperCase());

    const handleCreate = () => {
        setFormData({
            commissionRate: 0.10,
            balance: 0,
            totalEarnings: 0,
            photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200'
        });
        setSelectedPartner(null);
        setPartnerHistory([]);
        setPartnerCommissions([]);
        setExclusiveProducts([]);
        setViewMode('FORM');
    };

    const handleEdit = (partnerFromList: Partner) => {
        // CRÍTICO: Busca a versão mais recente do parceiro no serviço para garantir sincronia com alterações feitas no Portal do Parceiro
        const freshPartnerData = mockService.getPartnerById(partnerFromList.id) || partnerFromList;
        
        setFormData({ ...freshPartnerData });
        setSelectedPartner(freshPartnerData);
        loadPartnerContextData(freshPartnerData.id);
        setViewMode('FORM');
    };

    const handleViewDetails = (partnerFromList: Partner) => {
        // CRÍTICO: Busca a versão mais recente do parceiro no serviço para garantir sincronia com alterações feitas no Portal do Parceiro
        const freshPartnerData = mockService.getPartnerById(partnerFromList.id) || partnerFromList;

        setSelectedPartner(freshPartnerData);
        setPerformanceMonth(''); // Reset filter
        loadPartnerContextData(freshPartnerData.id);
        setViewMode('DETAILS');
    };

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.slug) {
            alert("Nome, Email e ID (Slug) são obrigatórios.");
            return;
        }
        const newPartner = formData as Partner;
        mockService.savePartner(newPartner);
        alert(selectedPartner ? "Parceiro atualizado!" : "Parceiro criado!");
        setViewMode('LIST');
    };

    // --- ABSOLUTE URL GENERATION ---
    const getShopUrl = (slug: string) => {
        const baseLocation = window.location.href.split('#')[0];
        return `${baseLocation}#/parceiro/${slug}`;
    };

    const copyLink = (slug: string) => {
        const url = getShopUrl(slug);
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- VIEW MODE: DETAILS (READ ONLY) ---
    if (viewMode === 'DETAILS' && selectedPartner) {
        // Filter Logic for Details View
        const filteredOrders = performanceMonth 
            ? partnerHistory.filter(o => o.createdAt.startsWith(performanceMonth))
            : partnerHistory;

        const filteredCommissions = performanceMonth
            ? partnerCommissions.filter(c => c.date.startsWith(performanceMonth))
            : partnerCommissions;

        const displayRevenue = filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        const displayOrdersCount = filteredOrders.length;
        const displayEarnings = filteredCommissions.reduce((acc, c) => acc + c.amount, 0);

        const shopUrl = getShopUrl(selectedPartner.slug);

        return (
            <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('LIST')} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <img src={selectedPartner.photoUrl} className="w-10 h-10 rounded-full object-cover border-2 border-slate-700" alt=""/>
                                {selectedPartner.name}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">Ficha Cadastral e Analítica</p>
                        </div>
                    </div>
                    <button onClick={() => handleEdit(selectedPartner)} className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-colors">
                        <Edit size={16}/> Editar Dados
                    </button>
                </div>

                {/* FICHA CADASTRAL COMPLETA (READ ONLY) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800 bg-slate-950/30">
                         <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-brand-blue"/> Dados Cadastrais Completos</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Coluna 1: Identificação e Contato */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2 mb-3">Identificação & Contato</h4>
                            
                            {/* URL DA LOJA (FEATURE ADICIONADA) */}
                            <div className="bg-brand-blue/10 border border-brand-blue/30 p-3 rounded-lg mb-4">
                                <label className="text-[10px] font-bold text-brand-blue uppercase block mb-1 flex items-center gap-1">
                                    <Globe size={10}/> Link da Loja do Parceiro
                                </label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={shopUrl} 
                                        className="bg-transparent text-white text-xs flex-1 outline-none truncate"
                                        onClick={(e) => e.currentTarget.select()}
                                    />
                                    <button onClick={() => copyLink(selectedPartner.slug)} className="text-brand-blue hover:text-white transition-colors" title="Copiar Link">
                                        {copied ? <CheckCircle size={14}/> : <Copy size={14}/>}
                                    </button>
                                    <a href={shopUrl} target="_blank" rel="noreferrer" className="text-brand-blue hover:text-white transition-colors" title="Abrir Loja">
                                        <ExternalLink size={14}/>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-1">Nome</label>
                                <div className="text-white font-medium">{selectedPartner.name}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-1">ID (Slug)</label>
                                <div className="text-white font-mono bg-slate-950 px-2 py-1 rounded inline-block text-xs">{selectedPartner.slug}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-1 flex items-center gap-1"><Mail size={10}/> Email</label>
                                <div className="text-white text-sm">{selectedPartner.email}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-1 flex items-center gap-1"><Phone size={10}/> Telefone</label>
                                <div className="text-white text-sm">{selectedPartner.phone || '-'}</div>
                            </div>
                        </div>

                        {/* Coluna 2: Endereço e Bio */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2 mb-3">Localização & Perfil</h4>
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-1 flex items-center gap-1"><MapPin size={10}/> Endereço</label>
                                <div className="text-white text-sm whitespace-pre-line">{selectedPartner.address || '-'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-1">Biografia</label>
                                <div className="text-slate-400 text-sm italic border-l-2 border-slate-700 pl-3">"{selectedPartner.bio}"</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-1">URL Foto</label>
                                <a href={selectedPartner.photoUrl} target="_blank" rel="noreferrer" className="text-brand-blue text-xs hover:underline truncate block max-w-[200px]">{selectedPartner.photoUrl}</a>
                            </div>
                        </div>

                        {/* Coluna 3: Financeiro */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2 mb-3">Financeiro</h4>
                            <div className="flex gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase block mb-1">Comissão</label>
                                    <div className="text-brand-yellow font-bold text-lg">{(selectedPartner.commissionRate * 100).toFixed(0)}%</div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase block mb-1">Saldo Atual</label>
                                    <div className="text-white font-bold text-lg">¥{selectedPartner.balance.toLocaleString()}</div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase block mb-1 flex items-center gap-1"><CreditCard size={10}/> Dados Bancários</label>
                                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                                    {selectedPartner.bankDetails || 'Não informado'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI CARDS (ANALYTICS) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 mb-4 gap-4">
                    <h3 className="text-lg font-bold text-white">Performance e Histórico</h3>
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                            <Filter size={14}/> Filtrar Mês:
                        </label>
                        <input 
                            type="month" 
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-brand-blue [color-scheme:dark]"
                            value={performanceMonth}
                            onChange={(e) => setPerformanceMonth(e.target.value)}
                        />
                         {performanceMonth && (
                            <button onClick={() => setPerformanceMonth('')} className="text-xs text-brand-blue hover:underline">
                                Limpar
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-900/30 rounded-lg text-green-400"><ShoppingBag size={20}/></div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase">Receita Gerada {performanceMonth ? '(Mês)' : '(Total)'}</h3>
                        </div>
                        <div className="text-3xl font-black text-white">¥{displayRevenue.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400"><Clock size={20}/></div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase">Pedidos {performanceMonth ? '(Mês)' : '(Total)'}</h3>
                        </div>
                        <div className="text-3xl font-black text-white">{displayOrdersCount}</div>
                    </div>
                     <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                         <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-blue/20 rounded-lg text-brand-blue"><Wallet size={20}/></div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase">Comissão {performanceMonth ? '(Mês)' : '(Total)'}</h3>
                        </div>
                        <div className="text-3xl font-black text-white">¥{displayEarnings.toLocaleString()}</div>
                    </div>
                </div>

                {/* TABLES GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-800">
                             <h3 className="font-bold text-white flex items-center gap-2"><Clock size={18}/> Histórico de Pedidos {performanceMonth ? `(${performanceMonth})` : ''}</h3>
                        </div>
                        <div className="overflow-x-auto flex-1 max-h-[400px]">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Pedido</th>
                                        <th className="px-6 py-4 text-right">Valor Venda</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-slate-800/30">
                                            <td className="px-6 py-4 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-mono">{order.id}</div>
                                                <span className={`text-[10px] uppercase font-bold ${order.status === 'PAID' ? 'text-green-400' : 'text-slate-500'}`}>{order.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-white">¥{order.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {filteredOrders.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-slate-500">Nenhuma venda encontrada para o período.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                     <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-800">
                             <h3 className="font-bold text-white flex items-center gap-2"><Store size={18}/> Produtos Exclusivos (Dono)</h3>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
                            {exclusiveProducts.map(prod => (
                                <div key={prod.id} className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <img src={prod.imageUrl} className="w-12 h-12 rounded bg-slate-900 object-cover" alt=""/>
                                    <div className="flex-1">
                                        <div className="font-bold text-white text-sm">{prod.name}</div>
                                        <div className="text-xs text-brand-blue font-bold">{prod.category}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold">¥{prod.price.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                            {exclusiveProducts.length === 0 && (
                                <div className="text-center p-8 text-slate-500 text-sm">
                                    Este parceiro não possui produtos exclusivos cadastrados.<br/>
                                    <span className="text-xs opacity-70">Ele ainda pode revender produtos do programa de afiliados global.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW MODE: FORM (EDIT/CREATE) ---
    if (viewMode === 'FORM') {
        const previewUrl = formData.slug ? getShopUrl(formData.slug) : '...';

        return (
             <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('LIST')} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-2xl font-bold text-white">{selectedPartner ? `Editando: ${selectedPartner.name}` : 'Novo Parceiro'}</h2>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={() => setViewMode('LIST')} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors">Cancelar</button>
                         <button onClick={handleSave} className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-blue/90 transition-colors shadow-lg flex items-center gap-2">
                            <Save size={18}/> Salvar Parceiro
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-8">
                    {/* Basic Info */}
                    <section>
                        <h3 className="text-sm font-bold text-brand-blue uppercase mb-4 flex items-center gap-2"><Users size={16}/> Dados Cadastrais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nome do Parceiro</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none capitalize" 
                                    value={formData.name || ''} onChange={e => setFormData({...formData, name: capitalize(e.target.value)})} placeholder="Ex: Tech Solutions" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Slug (ID da URL)</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none font-mono" 
                                    value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="ex: tech-solutions" />
                                <p className="text-[10px] text-slate-500 mt-1 truncate">Link: {previewUrl}</p>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email de Contato</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none" 
                                    value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Telefone / WhatsApp</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none" 
                                    value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Ex: 090-1234-5678" />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">URL da Foto</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none" 
                                    value={formData.photoUrl || ''} onChange={e => setFormData({...formData, photoUrl: e.target.value})} />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Endereço Completo</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none capitalize" 
                                    value={formData.address || ''} onChange={e => setFormData({...formData, address: capitalize(e.target.value)})} placeholder="Rua, Número, Cidade, Estado, Código Postal" />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Biografia</label>
                                <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none h-24 resize-none" 
                                    value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} />
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-slate-800"></div>

                    {/* Financial Settings */}
                    <section>
                         <h3 className="text-sm font-bold text-green-500 uppercase mb-4 flex items-center gap-2"><DollarSign size={16}/> Configuração Financeira</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Taxa de Comissão (%)</label>
                                <div className="relative">
                                    <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none" 
                                        value={((formData.commissionRate || 0) * 100).toFixed(0)} 
                                        onChange={e => setFormData({...formData, commissionRate: Number(e.target.value) / 100})} 
                                        min="0" max="100"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">Defina a porcentagem que este parceiro recebe por venda.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dados Bancários</label>
                                <textarea className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none h-24 resize-none font-mono text-sm" 
                                    value={formData.bankDetails || ''} onChange={e => setFormData({...formData, bankDetails: e.target.value})} 
                                    placeholder="Banco, Agência, Conta..."
                                />
                            </div>
                         </div>
                    </section>
                </div>
             </div>
        )
    }

    // LIST VIEW
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Users size={20}/> Gerenciar Parceiros</h2>
                <button onClick={handleCreate} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue/90 transition-colors">
                    <Plus size={16}/> Criar Parceiro
                </button>
            </div>
             <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                 <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Parceiro</th>
                            <th className="px-6 py-4">ID (Slug)</th>
                            <th className="px-6 py-4">Comissão (%)</th>
                            <th className="px-6 py-4">Saldo Pendente</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {partners.map(p => (
                             <tr key={p.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={p.photoUrl} className="w-10 h-10 rounded-full bg-slate-950 object-cover" alt="" />
                                    <div>
                                        <div className="text-white font-medium">{p.name}</div>
                                        <div className="text-xs">{p.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{p.slug}</td>
                                <td className="px-6 py-4 text-white font-bold">{(p.commissionRate * 100).toFixed(0)}%</td>
                                <td className="px-6 py-4 text-orange-400 font-bold">¥{p.balance.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                     <button onClick={() => handleViewDetails(p)} className="p-2 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 hover:text-white transition-colors" title="Ver Detalhes">
                                        <Eye size={16}/>
                                    </button>
                                    <button onClick={() => handleEdit(p)} className="p-2 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50 transition-colors" title="Editar">
                                        <Edit size={16}/>
                                    </button>
                                </td>
                             </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    )
}
