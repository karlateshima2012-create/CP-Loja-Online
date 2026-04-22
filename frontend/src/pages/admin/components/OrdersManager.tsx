
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Order, OrderStatus, CommissionStatus, AbandonedCart } from '@/src/types';
import { ShoppingBag, Eye, Edit, Heart, TrendingUp, MessageCircle, Clock, Users, ShoppingCart, AlertCircle } from 'lucide-react';

export const OrdersManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
    const [view, setView] = useState<'ORDERS' | 'ABANDONED'>('ORDERS');
    
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Sort orders: Newest first (Descending Date)
        const sortedOrders = [...mockService.getOrders()].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
        
        // Load Abandoned Carts
        setAbandonedCarts(mockService.getAbandonedCarts());
    }, [view]); // Reload when view changes

    // --- LOYALTY & POST-SALES METRICS ---
    const metrics = useMemo(() => {
        const totalOrders = orders.length;
        if (totalOrders === 0) return null;

        const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
        const avgTicket = totalRevenue / totalOrders;

        const customerCounts: Record<string, number> = {};
        orders.forEach(o => {
            const email = o.customerEmail;
            customerCounts[email] = (customerCounts[email] || 0) + 1;
        });
        const totalUniqueCustomers = Object.keys(customerCounts).length;
        const repeatCustomers = Object.values(customerCounts).filter(count => count > 1).length;
        const loyaltyRate = totalUniqueCustomers > 0 ? (repeatCustomers / totalUniqueCustomers) * 100 : 0;

        const postSalesOpp = orders.filter(o => 
            o.status === OrderStatus.SHIPPED || o.status === OrderStatus.RECEIVED
        ).length;

        const backlog = orders.filter(o => 
            [OrderStatus.PAID, OrderStatus.WAITING_FORM, OrderStatus.CUSTOMIZATION_RECEIVED, OrderStatus.PRODUCTION].includes(o.status)
        ).length;

        return { avgTicket, loyaltyRate, postSalesOpp, backlog, repeatCustomers };
    }, [orders]);

    const filteredOrders = orders.filter(o => {
        const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
        const id = o.id || '';
        const name = o.customerName || '';
        const matchesSearch = id.toLowerCase().includes(search.toLowerCase()) || 
                              name.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getCommissionInfo = (orderId: string) => {
        const comms = mockService.getCommissionsByOrderId(orderId);
        if (comms.length === 0) return null;
        
        const total = comms.reduce((acc, c) => acc + c.amount, 0);
        const partnerIds = Array.from(new Set(comms.map(c => c.partnerId)));
        const partnerNames = partnerIds.map(pid => {
            const p = mockService.getPartnerById(pid);
            return p ? p.name : 'Unknown';
        }).join(', ');
        
        const allPaid = comms.every(c => c.status === CommissionStatus.PAID);
        
        return {
            total,
            partnerNames,
            status: allPaid ? 'Pago' : 'Pendente'
        };
    };

    const translateStatus = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING_PAYMENT: return 'Aguardando Pagamento';
            case OrderStatus.BUDGET_SENT: return 'Orçamento Enviado';
            case OrderStatus.PAID: return 'Pago';
            case OrderStatus.WAITING_FORM: return 'Aguardando Formulário';
            case OrderStatus.CUSTOMIZATION_RECEIVED: return 'Personalização Recebida';
            case OrderStatus.PRODUCTION: return 'Em Produção';
            case OrderStatus.SHIPPED: return 'Finalizado / Enviado';
            case OrderStatus.RECEIVED: return 'Recebido pelo Cliente';
            case OrderStatus.COMPLETED: return 'Concluído';
            case OrderStatus.CANCELLED: return 'Cancelado';
            default: return status;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            
            {/* INSIGHTS CARDS */}
            {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Fidelidade */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-brand-pink/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <Heart size={64} />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-pink/20 text-brand-pink rounded-lg"><Heart size={20}/></div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taxa de Fidelidade</h3>
                        </div>
                        <div className="text-2xl font-black text-white">{metrics.loyaltyRate.toFixed(1)}%</div>
                        <p className="text-xs text-slate-500 mt-1">
                            <strong className="text-brand-pink">{metrics.repeatCustomers}</strong> clientes recorrentes
                        </p>
                    </div>

                    {/* Card 2: Ticket Médio */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-green-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <TrendingUp size={64} />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-900/20 text-green-400 rounded-lg"><TrendingUp size={20}/></div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Médio</h3>
                        </div>
                        <div className="text-2xl font-black text-white">¥{metrics.avgTicket.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        <p className="text-xs text-slate-500 mt-1">Gasto médio por pedido</p>
                    </div>

                    {/* Card 3: Oportunidade Pós-Venda */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <MessageCircle size={64} />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-blue/20 text-brand-blue rounded-lg"><MessageCircle size={20}/></div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aguardando Feedback</h3>
                        </div>
                        <div className="text-2xl font-black text-white">{metrics.postSalesOpp}</div>
                        <p className="text-xs text-slate-500 mt-1">Pedidos Enviados/Recebidos. <span className="text-brand-blue font-bold cursor-pointer hover:underline" onClick={() => { setView('ORDERS'); setFilterStatus(OrderStatus.SHIPPED); }}>Filtrar</span></p>
                    </div>

                    {/* Card 4: Operacional */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-brand-yellow/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                            <Clock size={64} />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-brand-yellow/20 text-brand-yellow rounded-lg"><Clock size={20}/></div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Em Processamento</h3>
                        </div>
                        <div className="text-2xl font-black text-white">{metrics.backlog}</div>
                        <p className="text-xs text-slate-500 mt-1">Pedidos ativos na fila</p>
                    </div>
                </div>
            )}

             <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingBag size={20}/> Gerenciar Pedidos</h2>
                    {/* TOGGLE VIEW */}
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-700">
                        <button 
                            onClick={() => setView('ORDERS')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${view === 'ORDERS' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Pedidos
                        </button>
                        <button 
                            onClick={() => setView('ABANDONED')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${view === 'ABANDONED' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <ShoppingCart size={12}/> Abandonados ({abandonedCarts.length})
                        </button>
                    </div>
                </div>

                {view === 'ORDERS' && (
                    <div className="flex gap-4 w-full md:w-auto">
                        <input className="w-full md:w-64 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-blue" placeholder="Buscar pedido, cliente..." value={search} onChange={e => setSearch(e.target.value)} />
                        <select className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-blue" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">Todos os Status</option>
                            {Object.values(OrderStatus).map(s => <option key={s} value={s}>{translateStatus(s)}</option>)}
                        </select>
                    </div>
                )}
            </div>

            {view === 'ORDERS' ? (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Pedido</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Parceiro Associado</th>
                                <th className="px-6 py-4">Comissão</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status Pedido</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredOrders.map(order => {
                                const commInfo = getCommissionInfo(order.id);
                                // Highlight Recurring Customers
                                const customerOrderCount = orders.filter(o => o.customerEmail === order.customerEmail).length;
                                const isRecurring = customerOrderCount > 1;

                                return (
                                    <tr key={order.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4">
                                            <Link to={`/admin/dashboard/orders/${order.id}`} className="font-mono text-white hover:text-brand-blue hover:underline transition-colors block">
                                                {order.id}
                                            </Link>
                                            <div className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-medium flex items-center gap-2">
                                                {order.customerName}
                                                {isRecurring && <span className="text-[10px] bg-brand-pink/20 text-brand-pink px-1.5 py-0.5 rounded border border-brand-pink/30 flex items-center gap-0.5" title="Cliente Recorrente"><Heart size={8} fill="currentColor"/> VIP</span>}
                                            </div>
                                            <div className="text-xs">{order.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {commInfo ? (
                                                <span className="text-white font-medium">{commInfo.partnerNames}</span>
                                            ) : (
                                                <span className="text-slate-600 italic">Direto CP</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {commInfo ? (
                                                <span className="text-brand-yellow font-bold">¥{commInfo.total.toLocaleString()}</span>
                                            ) : (
                                                <span className="text-slate-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-white font-bold">¥{order.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                                    order.status === 'PAID' ? 'bg-green-900/30 text-green-400 border-green-500/30' :
                                                    order.status === 'SHIPPED' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                                                    order.status === 'RECEIVED' ? 'bg-teal-900/30 text-teal-400 border-teal-500/30' :
                                                    order.status === 'WAITING_FORM' ? 'bg-orange-900/30 text-orange-400 border-orange-500/30' :
                                                    order.status === 'BUDGET_SENT' ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30' :
                                                    order.status === 'PRODUCTION' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                                                    'bg-slate-800 text-slate-400 border-slate-700'
                                                }`}>
                                                {translateStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                            <button 
                                                onClick={() => navigate(`/admin/dashboard/orders/${order.id}`)}
                                                className="bg-brand-blue hover:bg-brand-blue/90 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors shadow-lg"
                                                title="Editar / Ver Detalhes"
                                            >
                                                <Edit size={14}/> Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* ABANDONED CARTS VIEW */
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-4">
                    <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-4 mb-4 flex items-center gap-3">
                        <AlertCircle className="text-red-400" size={24} />
                        <div>
                            <h3 className="font-bold text-red-400">Recuperação de Vendas</h3>
                            <p className="text-xs text-slate-400">Estes carrinhos ainda não viraram pedido. Entre em contato para recuperar.</p>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Cliente (Possível)</th>
                                <th className="px-6 py-4">Itens no Carrinho</th>
                                <th className="px-6 py-4 text-right">Valor Total</th>
                                <th className="px-6 py-4">Última Atividade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {abandonedCarts.map(cart => (
                                <tr key={cart.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">{cart.customerName || 'Visitante'}</div>
                                        <div className="text-xs">{cart.customerEmail || 'Email não capturado'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {cart.items.map((item, idx) => (
                                                <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                                                    <span className="font-bold">{item.quantity}x</span> {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-white">¥{cart.totalValue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {new Date(cart.updatedAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {abandonedCarts.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhum carrinho abandonado recente.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
