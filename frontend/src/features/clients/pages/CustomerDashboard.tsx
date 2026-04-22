
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { mockService } from '@/src/services/mockData';
import { Order, OrderStatus, Customer, TestimonialSource, Testimonial, Coupon } from '@/src/types';
import { ShoppingBag, Package, CheckCircle, Clock, Edit, Save, User, LogOut, Copy, Star, Loader2, ThumbsUp, MessageSquare, Truck, Hammer, FileText, AlertCircle, Ticket, CalendarHeart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [myReviews, setMyReviews] = useState<Testimonial[]>([]);
    const [myCoupons, setMyCoupons] = useState<Coupon[]>([]);
    const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'coupons'>('orders');

    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [showThankYou, setShowThankYou] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<Partial<Customer>>({});

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewContent, setReviewContent] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        if (user && user.id) {
            const freshCustomer = mockService.getCustomerById(user.id);
            if (freshCustomer) {
                setProfileData({ ...freshCustomer });
            }
            loadOrders();
            loadReviews();
            loadCoupons();
        }
    }, [user]);

    const loadOrders = () => {
        if (user) {
            const data = mockService.getCustomerOrders(user.id);
            // Ordenar por data (mais recente primeiro)
            const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(sorted.map(o => ({ ...o })));
        }
    };

    const loadReviews = () => {
        setMyReviews(mockService.getTestimonials());
    };

    const loadCoupons = () => {
        if (user) {
            setMyCoupons(mockService.getCouponsForCustomer(user.id));
        }
    };

    const handleSaveProfile = () => {
        if (!user) return;
        mockService.updateCustomer(user.id, profileData);
        setIsEditing(false);
        alert("Dados atualizados com sucesso!");
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCopyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    // --- CONFIRM RECEIPT FLOW ---
    const initiateConfirm = (e: React.MouseEvent, orderId: string) => {
        e.stopPropagation();
        setConfirmingId(orderId);
        setTimeout(() => {
            setConfirmingId(prev => (prev === orderId ? null : prev));
        }, 3000);
    };

    const executeConfirmReceipt = async (e: React.MouseEvent, orderId: string) => {
        e.stopPropagation();
        setConfirmingId(null);
        setLoadingId(orderId);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula rede

        // Atualiza status para RECEIVED
        mockService.updateOrderStatus(orderId, OrderStatus.RECEIVED);

        loadOrders();
        setLoadingId(null);
    };

    // --- REVIEW FLOW ---
    const openReviewModal = (orderId: string) => {
        setReviewOrderId(orderId);
        setReviewRating(5);
        setReviewContent('');
        setReviewModalOpen(true);
    };

    const submitReview = () => {
        if (!user || !reviewOrderId) return;
        if (!reviewContent.trim()) {
            alert("Por favor, escreva um comentário para ajudar outros clientes.");
            return;
        }

        // Salva o depoimento (Vai para o Painel Admin)
        mockService.saveTestimonial({
            id: `test-${Date.now()}`,
            name: user.name,
            role: 'Cliente Verificado',
            content: reviewContent,
            rating: reviewRating,
            source: TestimonialSource.STORE, // Fonte interna
            date: new Date().toISOString(),
            orderId: reviewOrderId,
            approved: false // Requer aprovação do admin
        });

        setReviewModalOpen(false);
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 4000);

        loadOrders();
        loadReviews(); // Atualiza lista de reviews para esconder o botão
    };

    const capitalize = (str: string) => str.replace(/\b\w/g, l => l.toUpperCase());

    const translateStatus = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING_PAYMENT: return 'Aguardando Pagamento';
            case OrderStatus.BUDGET_SENT: return 'Orçamento Enviado';
            case OrderStatus.PAID: return 'Pago / Aprovado';
            case OrderStatus.WAITING_FORM: return 'Aguardando Dados';
            case OrderStatus.CUSTOMIZATION_RECEIVED: return 'Dados Recebidos';
            case OrderStatus.PRODUCTION: return 'Em Produção';
            case OrderStatus.SHIPPED: return 'Enviado';
            case OrderStatus.RECEIVED: return 'Recebido';
            case OrderStatus.COMPLETED: return 'Concluído';
            case OrderStatus.CANCELLED: return 'Cancelado';
            default: return status;
        }
    };

    const getStatusBadge = (status: OrderStatus) => {
        const styles = {
            [OrderStatus.PAID]: 'bg-green-900/30 text-green-400 border-green-500/30',
            [OrderStatus.SHIPPED]: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30',
            [OrderStatus.PENDING_PAYMENT]: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
            [OrderStatus.RECEIVED]: 'bg-teal-900/30 text-teal-400 border-teal-500/30',
            [OrderStatus.COMPLETED]: 'bg-slate-800 text-slate-300 border-slate-600',
            [OrderStatus.PRODUCTION]: 'bg-blue-900/30 text-blue-400 border-blue-500/30',
            [OrderStatus.WAITING_FORM]: 'bg-orange-900/30 text-orange-400 border-orange-500/30',
            [OrderStatus.CUSTOMIZATION_RECEIVED]: 'bg-purple-900/30 text-purple-400 border-purple-500/30',
            [OrderStatus.CANCELLED]: 'bg-red-900/30 text-red-400 border-red-500/30',
        };
        const defaultStyle = 'bg-slate-800 text-slate-400 border-slate-700';

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1 w-fit ${styles[status] || defaultStyle}`}>
                {status === OrderStatus.SHIPPED && <Truck size={12} />}
                {status === OrderStatus.PRODUCTION && <Hammer size={12} />}
                {status === OrderStatus.WAITING_FORM && <FileText size={12} />}
                {status === OrderStatus.CANCELLED && <AlertCircle size={12} />}
                {translateStatus(status)}
            </span>
        );
    };

    if (!user) return <div className="p-8 text-white">Carregando...</div>;

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in relative">
            {showThankYou && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-up w-full max-w-sm px-4">
                    <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-2 border-green-400">
                        <CheckCircle size={28} className="text-white" />
                        <div><h4 className="font-bold text-lg">Obrigado!</h4><p className="text-sm">Sua avaliação foi enviada.</p></div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 space-y-6">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue border border-slate-700"><User size={32} /></div>
                        <h2 className="text-white font-bold text-lg">{user.name}</h2>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                        <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-slate-900 text-slate-400 hover:text-white'}`}><ShoppingBag size={18} /> Meus Pedidos</button>
                        <button onClick={() => setActiveTab('coupons')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'coupons' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-slate-900 text-slate-400 hover:text-white'}`}><Ticket size={18} /> Meus Cupons</button>
                        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-slate-900 text-slate-400 hover:text-white'}`}><User size={18} /> Meus Dados</button>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-900/20 transition-all border border-transparent hover:border-red-900/50 mt-8"><LogOut size={18} /> LOGOUT</button>
                    </div>
                </aside>

                <div className="flex-1">
                    {activeTab === 'orders' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-white mb-6">Histórico de Pedidos</h2>
                            {orders.length === 0 ? (
                                <div className="bg-slate-900 p-12 rounded-3xl border border-slate-800 text-center">
                                    <Package size={48} className="text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-400">Você ainda não fez nenhum pedido.</p>
                                    <button onClick={() => navigate('/produtos')} className="mt-4 text-brand-blue font-bold hover:underline">Ir para a Loja</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => {
                                        // Verifica se já foi avaliado
                                        const hasReviewed = myReviews.some(r => r.orderId === order.id);

                                        return (
                                            <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                                <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1"><span className="font-mono text-white font-bold">{order.id}</span>{getStatusBadge(order.status)}</div>
                                                        <p className="text-xs text-slate-500 flex items-center gap-2"><Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-black text-white">¥{order.totalAmount.toLocaleString()}</div>
                                                        <div className="text-xs text-slate-500">{order.items.length} itens</div>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-slate-950/30">
                                                    <div className="space-y-3">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden shrink-0"><img src={item.imageUrl} className="w-full h-full object-cover" alt="" /></div>
                                                                <div className="flex-1"><p className="text-sm font-bold text-white">{item.name}</p></div>
                                                                <div className="text-sm text-slate-400">x{item.quantity}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                                                        {order.trackingCode && (
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Código para Rastreio:</p>
                                                                <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 p-3 rounded-xl w-fit">
                                                                    <span className="font-mono text-brand-yellow font-bold text-lg">{order.trackingCode}</span>
                                                                    <button onClick={() => handleCopyCode(order.trackingCode!, order.id)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                                                                        {copiedId === order.id ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* --- ACTIONS AREA --- */}
                                                        <div className="ml-auto flex items-center gap-3">
                                                            {/* 1. SE ENVIADO -> CONFIRMAR RECEBIMENTO */}
                                                            {order.status === OrderStatus.SHIPPED && (
                                                                <button onClick={(e) => confirmingId === order.id ? executeConfirmReceipt(e, order.id) : initiateConfirm(e, order.id)} disabled={loadingId === order.id} className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                                                                    {loadingId === order.id ? <Loader2 size={18} className="animate-spin" /> : confirmingId === order.id ? <><CheckCircle size={18} /> Confirmar?</> : <><ThumbsUp size={18} /> Confirmar Recebimento</>}
                                                                </button>
                                                            )}

                                                            {/* 2. SE RECEBIDO E NÃO AVALIADO -> AVALIAR */}
                                                            {(order.status === OrderStatus.RECEIVED || order.status === OrderStatus.COMPLETED) && !hasReviewed && (
                                                                <button onClick={() => openReviewModal(order.id)} className="bg-brand-yellow hover:bg-brand-yellow/90 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105">
                                                                    <Star size={18} fill="black" /> Avaliar Compra
                                                                </button>
                                                            )}

                                                            {/* 3. SE JÁ AVALIADO -> LABEL */}
                                                            {hasReviewed && (
                                                                <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-900/20 px-3 py-2 rounded-lg border border-green-500/30">
                                                                    <CheckCircle size={16} /> Avaliação Enviada
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'coupons' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-white mb-6">Meus Cupons de Desconto</h2>
                            {myCoupons.length === 0 ? (
                                <div className="bg-slate-900 p-12 rounded-3xl border border-slate-800 text-center">
                                    <Ticket size={48} className="text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-400">Você não possui cupons ativos no momento.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {myCoupons.map(coupon => (
                                        <div key={coupon.id} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-brand-yellow/30 p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                            <div className="absolute top-0 right-0 p-6 opacity-5"><Ticket size={100} /></div>

                                            <div className="relative z-10">
                                                <p className="text-xs text-brand-yellow font-bold uppercase tracking-widest mb-1">Cupom Exclusivo</p>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-3xl font-black text-white font-mono">{coupon.code}</span>
                                                    <button onClick={() => handleCopyCode(coupon.code, coupon.id)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                                                        {copiedId === coupon.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-slate-400 text-sm">Desconto de</p>
                                                        <p className="text-2xl font-bold text-green-400">{(coupon.discountPercentage * 100).toFixed(0)}% OFF</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Válido até</p>
                                                        <p className="text-sm text-white">{new Date(coupon.expirationDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 animate-fade-in">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white">Meus Dados</h2>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="text-brand-blue font-bold flex items-center gap-2 hover:underline"><Edit size={16} /> Editar</button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsEditing(false)} className="text-slate-500 font-bold hover:text-white">Cancelar</button>
                                        <button onClick={handleSaveProfile} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Save size={16} /> Salvar</button>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nome</label><input disabled={!isEditing} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white disabled:opacity-50 capitalize" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: capitalize(e.target.value) })} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Email</label><input disabled className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white disabled:opacity-50 cursor-not-allowed" value={profileData.email} /></div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                                        <CalendarHeart size={12} /> Aniversário
                                    </label>
                                    <input
                                        disabled
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white disabled:opacity-50 cursor-not-allowed"
                                        value={profileData.birthday || 'Não informado'}
                                    />
                                </div>

                                <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Telefone</label><input disabled={!isEditing} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white disabled:opacity-50" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Código postal</label><input disabled={!isEditing} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white disabled:opacity-50" value={profileData.postalCode} onChange={e => setProfileData({ ...profileData, postalCode: e.target.value })} /></div>
                                <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Endereço Completo</label><input disabled={!isEditing} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white disabled:opacity-50 capitalize" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: capitalize(e.target.value) })} /></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {reviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
                        <div className="p-6 text-center border-b border-slate-800">
                            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                                <MessageSquare size={24} className="text-brand-yellow" /> Avaliar Experiência
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">O que você achou dos produtos?</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex flex-col items-center gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2">Sua Nota</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setReviewRating(star)} className="transition-transform hover:scale-110">
                                            <Star size={36} fill={star <= reviewRating ? "#FFF200" : "none"} className={star <= reviewRating ? "text-brand-yellow" : "text-slate-700"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Seu Comentário</label>
                                <textarea
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white h-32 focus:border-brand-blue outline-none resize-none"
                                    placeholder="Conte-nos como foi sua experiência, qualidade do produto, atendimento..."
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setReviewModalOpen(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors">Cancelar</button>
                                <button onClick={submitReview} className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white py-3 rounded-xl font-bold transition-colors shadow-lg">Enviar Avaliação</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
