
import React, { useState, useMemo } from 'react';
import { mockService } from '@/src/services/mockData';
import { 
  TrendingUp, Users, DollarSign, CheckCircle, Store, Trophy, MousePointerClick, Wallet, AlertTriangle, XCircle, Bell, Gift, CalendarHeart, X
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
    const allOrders = mockService.getOrders();
    const stats = mockService.getDashboardStats();
    const digitalStats = mockService.getDigitalProductStats(); // Usado para obter o tráfego
    const partnerRanking = mockService.getPartnerRanking();
    
    // --- STOCK ALERTS LOGIC ---
    const materials = mockService.getMaterials();
    const products = mockService.getProducts();
    const customers = mockService.getCustomers();
    
    // State for dismissed birthday reminders
    const [dismissedBirthdays, setDismissedBirthdays] = useState<string[]>([]);

    // 1. Low/Empty Materials
    const criticalMaterials = materials.filter(m => m.currentStock <= m.minStock);
    
    // 2. Unavailable Products (Calculated Stock = 0)
    const unavailableProducts = products.filter(p => {
        const stock = mockService.getVirtualStock(p.id);
        return stock === 0 && p.category !== 'Serviços Digitais' && p.category !== 'Serviços';
    });

    // 3. Birthday Logic (Next 7 Days)
    const upcomingBirthdays = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return customers.filter(c => {
            if (!c.birthday || dismissedBirthdays.includes(c.id)) return false;

            const [dayStr, monthStr] = c.birthday.split('/');
            const day = parseInt(dayStr);
            const month = parseInt(monthStr);

            if (!day || !month) return false;

            // Check current year birthday
            const bdayThisYear = new Date(today.getFullYear(), month - 1, day);
            
            // Check next year birthday (handles Dec -> Jan transition)
            const bdayNextYear = new Date(today.getFullYear() + 1, month - 1, day);

            // Check if falls in range
            const isThisYear = bdayThisYear >= today && bdayThisYear <= nextWeek;
            const isNextYear = bdayNextYear >= today && bdayNextYear <= nextWeek;

            return isThisYear || isNextYear;
        }).map(c => {
            // Add a formatted date for display
            const [day, month] = c.birthday!.split('/');
            return { ...c, displayDate: `${day}/${month}` };
        });
    }, [customers, dismissedBirthdays]);

    const handleDismissBirthday = (id: string) => {
        setDismissedBirthdays(prev => [...prev, id]);
    };

    const now = new Date();
    const currentMonthOrders = allOrders.filter(o => {
        const d = new Date(o.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlySales = currentMonthOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    // Cálculo do Total de Comissões Geradas (Ciclo Atual: Pendentes + Pagas)
    const totalCommissionsGenerated = stats.totalCommissionsPending + stats.paidCommissionsMonth;

    const productSalesMap = new Map<string, { name: string, qty: number, revenue: number, image: string }>();
    allOrders.forEach(order => {
        order.items.forEach(item => {
            const existing = productSalesMap.get(item.id) || { name: item.name, qty: 0, revenue: 0, image: item.imageUrl };
            productSalesMap.set(item.id, {
                name: item.name,
                qty: existing.qty + item.quantity,
                revenue: existing.revenue + (item.price * item.quantity),
                image: item.imageUrl
            });
        });
    });
    
    const productRanking = Array.from(productSalesMap.values())
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-fade-in">
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* --- ALERTS & BIRTHDAYS COLUMN (Span 1 or Full on Mobile) --- */}
                <div className="xl:col-span-1 space-y-6">
                    
                    {/* BIRTHDAY CARD */}
                    <div className="bg-slate-900 border border-brand-pink/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        {/* Pink Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-[40px] pointer-events-none"></div>
                        
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Gift size={20} className="text-brand-pink animate-bounce-slow"/> 
                            <span className="text-brand-pink">Aniversariantes</span> 
                            <span className="text-xs text-slate-500 font-normal uppercase tracking-wider mt-0.5">(Próximos 7 Dias)</span>
                        </h2>

                        <div className="space-y-3">
                            {upcomingBirthdays.length > 0 ? (
                                upcomingBirthdays.map(c => (
                                    <div key={c.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-brand-pink/20 group hover:border-brand-pink/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center border border-brand-pink/30">
                                                <CalendarHeart size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{c.name}</p>
                                                <p className="text-xs text-brand-pink font-bold">Dia {c.displayDate}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDismissBirthday(c.id)}
                                            className="text-slate-600 hover:text-slate-400 p-2 rounded hover:bg-slate-800 transition-colors"
                                            title="Apagar Lembrete"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 px-4 bg-slate-950/50 rounded-xl border border-slate-800 border-dashed">
                                    <CalendarHeart size={32} className="text-slate-700 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">Aniversariantes próximos aparecerão aqui.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* OPERATIONAL ALERTS (If Any) */}
                    {(criticalMaterials.length > 0 || unavailableProducts.length > 0) && (
                        <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                                <Bell size={20} className="animate-pulse"/> Alertas Operacionais
                            </h2>
                            <div className="space-y-4">
                                {criticalMaterials.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><AlertTriangle size={10}/> Estoque Baixo</h3>
                                        <div className="space-y-2">
                                            {criticalMaterials.map(m => (
                                                <div key={m.id} className="flex justify-between items-center text-xs bg-slate-950/80 p-2 rounded border border-red-500/10">
                                                    <span className="text-slate-300">{m.name}</span>
                                                    <span className="text-red-400 font-bold">{m.currentStock} {m.unit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {unavailableProducts.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><XCircle size={10}/> Produtos Indisponíveis</h3>
                                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                                            {unavailableProducts.map(p => (
                                                <div key={p.id} className="flex items-center gap-2 text-xs bg-slate-950/80 p-2 rounded border border-red-500/10 opacity-75">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                    <span className="text-slate-300 truncate">{p.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- METRICS & CHARTS COLUMN (Span 2) --- */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Grid de Métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Vendas Mês */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400"><TrendingUp size={20}/></div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendas (Mês)</h3>
                            </div>
                            <div className="text-3xl font-black text-white">¥{monthlySales.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">{currentMonthOrders.length} pedidos este mês</p>
                        </div>

                        {/* 2. Vendas Parceiros */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-yellow-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-900/30 rounded-lg text-yellow-400"><Users size={20}/></div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendas Parceiros</h3>
                            </div>
                            <div className="text-3xl font-black text-white">¥{stats.partnerSales.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">Volume total acumulado</p>
                        </div>

                        {/* 3. Tráfego na Loja */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-indigo-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-900/30 rounded-lg text-indigo-400"><MousePointerClick size={20}/></div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tráfego na Loja</h3>
                            </div>
                            <div className="text-3xl font-black text-white">{digitalStats.flix.totalVisits.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">Cliques/Visitas totais</p>
                        </div>

                        {/* 4. Total Comissões Geradas */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-purple-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><Wallet size={20}/></div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Comissões</h3>
                            </div>
                            <div className="text-3xl font-black text-white">¥{totalCommissionsGenerated.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">Soma (Pendentes + Pagas)</p>
                        </div>

                        {/* 5. Comissões Pendentes */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-orange-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400"><DollarSign size={20}/></div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comissões Pendentes</h3>
                            </div>
                            <div className="text-3xl font-black text-orange-400">¥{stats.totalCommissionsPending.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">Aguardando repasse</p>
                        </div>

                        {/* 6. Comissões Pagas */}
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-green-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-900/30 rounded-lg text-green-400"><CheckCircle size={20}/></div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comissões Pagas</h3>
                            </div>
                            <div className="text-3xl font-black text-green-400">¥{stats.paidCommissionsMonth.toLocaleString()}</div>
                            <p className="text-xs text-slate-500 mt-1">Repassado neste mês</p>
                        </div>
                    </div>

                    {/* Rankings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Ranking Parceiros */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-800">
                                <h3 className="font-bold text-white flex items-center gap-2"><Store size={18} className="text-brand-blue"/> Ranking de Parceiros</h3>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-sm text-left text-slate-400">
                                    <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">#</th>
                                            <th className="px-6 py-4">Parceiro</th>
                                            <th className="px-6 py-4 text-right">Receita</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {partnerRanking.slice(0, 5).map((p, i) => (
                                            <tr key={p.id} className="hover:bg-slate-800/30">
                                                <td className="px-6 py-4">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                                                        {i + 1}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={p.photoUrl} className="w-8 h-8 rounded-full object-cover bg-slate-950" alt=""/>
                                                    <span className="text-white font-medium">{p.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-white font-mono">¥{p.totalEarnings.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mais Vendidos */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-800">
                                <h3 className="font-bold text-white flex items-center gap-2"><Trophy size={18} className="text-brand-yellow"/> Produtos Mais Vendidos</h3>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-sm text-left text-slate-400">
                                    <thead className="bg-slate-950 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Produto</th>
                                            <th className="px-6 py-4 text-right">Qtd</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {productRanking.map((prod, i) => (
                                            <tr key={i} className="hover:bg-slate-800/30">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={prod.image} className="w-8 h-8 rounded object-cover bg-slate-950" alt=""/>
                                                    <span className="text-white font-medium truncate max-w-[150px]">{prod.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-white">{prod.qty}</td>
                                                <td className="px-6 py-4 text-right text-emerald-400">¥{prod.revenue.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
