
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { useCart } from '../../CartContext';
import { PaymentMethod, SystemSettings } from '@/src/types';
import { mockService } from '@/src/services/mockData';
import { User, Mail, Phone, Truck, MapPin, CreditCard, Smartphone, Banknote, CheckCircle, Lock, UserPlus, LogIn, ChevronLeft, ShieldCheck, Download, Cloud, Loader2, AlertTriangle, Ticket, PenTool, Gift } from 'lucide-react';

interface CheckoutViewProps {
    onBack: () => void;
    onSuccess: (order: any) => void;
    shippingCost: number;
    setDeliveryMethod: (method: 'shipping' | 'pickup') => void;
    deliveryMethod: 'shipping' | 'pickup';
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBack, onSuccess, shippingCost, setDeliveryMethod, deliveryMethod }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { cart, clearCart, appliedCoupons, clearCoupons } = useCart(); // Access coupons from Context
    const [settings, setSettings] = useState<SystemSettings | null>(null);

    // States for Modal & Processing
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Check if cart contains ONLY digital items
    const isDigitalOnly = cart.length > 0 && cart.every(item => item.category === 'Serviços Digitais');

    // Form Data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        postalCode: user?.postalCode || '',
        cityState: ''
    });

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.SQUARE);

    useEffect(() => {
        setSettings(mockService.getSettings());
        // If digital only, force 'shipping' method logic (but visually hidden) to ensure address is captured for invoice/record
        if (isDigitalOnly) {
            setDeliveryMethod('shipping');
        }
    }, [isDigitalOnly]);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Discount Calc (Multiple)
    const discountAmount = appliedCoupons.reduce((sum, coupon) => {
        return sum + Math.floor(subtotal * coupon.discountPercentage);
    }, 0);

    const effectiveDiscount = Math.min(discountAmount, subtotal);
    const effectiveShipping = (deliveryMethod === 'pickup' || isDigitalOnly) ? 0 : shippingCost;
    const total = Math.max(0, subtotal + effectiveShipping - effectiveDiscount);

    // --- REDIRECT LOGIC ---
    const handleAuthRedirect = (path: 'login' | 'register') => {
        const targetUrl = encodeURIComponent('/cart?step=checkout');
        navigate(`/${path}?redirect=${targetUrl}`);
    };

    // STEP 1: VALIDATE AND OPEN MODAL
    const handleInitiateCheckout = () => {
        if (!formData.name || !formData.email) {
            alert("Nome e Email são obrigatórios.");
            return;
        }

        if (!formData.phone) {
            alert("O Telefone/WhatsApp é obrigatório para contato sobre a entrega.");
            return;
        }

        if (deliveryMethod === 'shipping' && (!formData.address || !formData.postalCode)) {
            alert("Por favor preencha o endereço completo.");
            return;
        }

        // Open Confirmation Modal
        setShowConfirmationModal(true);
    };

    // STEP 2: EXECUTE ORDER (AFTER CONFIRMATION)
    const handleFinalizeOrder = async () => {
        setIsProcessing(true);

        // Artificial Delay for UX (Simulate Processing)
        await new Promise(resolve => setTimeout(resolve, 2000));

        let finalAddress = "";

        if (isDigitalOnly) {
            finalAddress = "PRODUTO DIGITAL (Entrega via Email/WhatsApp)";
        } else {
            finalAddress = deliveryMethod === 'pickup'
                ? "RETIRADA NA LOJA: Shiga - Koka - Minakuchi"
                : `〒${formData.postalCode} ${formData.cityState} ${formData.address}`;
        }

        const newOrder = {
            id: `ORD-${Date.now()}`,
            createdAt: new Date().toISOString(),
            customerId: user?.id,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress: finalAddress,
            items: [...cart],
            totalAmount: total,
            discountAmount: effectiveDiscount,
            couponCodes: appliedCoupons.map(c => c.code), // Send Array
            paymentMethod,
            status: 'PENDING_PAYMENT',
        };

        mockService.createOrder(newOrder as any);
        clearCart();
        clearCoupons(); // Consume coupons from global state
        onSuccess(newOrder);
    };

    const getPaymentMethodLabel = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.SQUARE: return 'Cartão de Crédito';
            case PaymentMethod.PAYPAY: return 'PayPay';
            case PaymentMethod.TRANSFER: return 'Transferência Bancária';
            default: return method;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in relative">

            {/* CONFIRMATION MODAL OVERLAY */}
            {showConfirmationModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
                        <div className="p-8 text-center border-b border-slate-800">
                            <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue animate-pulse">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Confirmar Pedido?</h3>
                            <p className="text-slate-400 text-sm">Revise os detalhes finais antes de concluir sua compra.</p>
                        </div>

                        <div className="p-8 space-y-6 bg-slate-950/50">
                            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                                {appliedCoupons.map(c => (
                                    <div key={c.id} className="flex justify-between items-center text-sm border-b border-slate-800 pb-3 text-green-400">
                                        <span className="flex items-center gap-1"><Ticket size={14} /> Desconto ({c.code})</span>
                                        <span className="font-bold">- ¥{Math.floor(subtotal * c.discountPercentage).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                                    <span className="text-slate-400">Total a Pagar</span>
                                    <span className="text-white font-black text-xl">¥{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Pagamento</span>
                                    <span className="text-brand-blue font-bold">{getPaymentMethodLabel(paymentMethod)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Entrega</span>
                                    <span className="text-white font-medium">{isDigitalOnly ? 'Digital' : deliveryMethod === 'pickup' ? 'Retirada' : 'Envio'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900 border-t border-slate-800 flex gap-3">
                            <button
                                onClick={() => setShowConfirmationModal(false)}
                                disabled={isProcessing}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleFinalizeOrder}
                                disabled={isProcessing}
                                className="flex-[2] bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <><Loader2 className="animate-spin" size={20} /> Processando...</>
                                ) : (
                                    <><CheckCircle size={20} /> Sim, Finalizar</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LEFT COLUMN: FORM STEPS (Span 7) */}
            <div className="lg:col-span-7">

                {/* Header Mobile Only */}
                <div className="lg:hidden mb-4">
                    <button onClick={onBack} className="text-brand-gray text-sm flex items-center gap-2 hover:text-white">
                        <ChevronLeft size={16} /> Voltar ao Carrinho
                    </button>
                </div>

                <div className="space-y-6">
                    {!user ? (
                        /* --- AUTHENTICATION GATE --- */
                        <div className="bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-slate-700">
                                    <Lock size={32} className="text-brand-yellow" />
                                </div>

                                <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Identifique-se para continuar</h2>
                                <p className="text-brand-gray mb-8 max-w-md mx-auto">
                                    Para garantir a segurança do seu pedido e acompanhar a entrega, por favor faça login ou crie sua conta rapidamente.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                    <button
                                        onClick={() => handleAuthRedirect('login')}
                                        className="flex-1 bg-brand-yellow hover:bg-brand-yellow/90 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <LogIn size={20} /> Já tenho conta
                                    </button>
                                    <button
                                        onClick={() => handleAuthRedirect('register')}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-brand-yellow/30 hover:border-brand-yellow/60 flex items-center justify-center gap-2"
                                    >
                                        <UserPlus size={20} /> Quero me cadastrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* --- CHECKOUT FORM SECTIONS --- */
                        <>
                            <h2 className="text-2xl font-black text-white mb-2">Confirme seus dados e selecione a entrega</h2>
                            <p className="text-slate-400 text-sm mb-6">Verifique se as informações de contato estão corretas.</p>

                            {/* SECTION: PERSONAL DATA */}
                            <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg p-6 space-y-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="text-brand-blue" size={20} />
                                    <h3 className="font-bold text-white">Dados de Contato</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase mb-2">Nome Completo</label>
                                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none transition-all focus:ring-1 focus:ring-brand-blue/50"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase mb-2">Email</label>
                                        <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none transition-all focus:ring-1 focus:ring-brand-blue/50"
                                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase mb-2">WhatsApp / Telefone <span className="text-red-500">*</span></label>
                                    <input type="tel" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none placeholder-slate-700 transition-all focus:ring-1 focus:ring-brand-blue/50"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Para contato sobre a entrega" />
                                </div>
                            </section>

                            {/* SECTION: DELIVERY */}
                            <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    {isDigitalOnly ? <Cloud className="text-brand-blue" size={20} /> : <Truck className="text-brand-yellow" size={20} />}
                                    <h3 className="font-bold text-white">Opções de Entrega</h3>
                                </div>

                                {isDigitalOnly ? (
                                    <div className="bg-brand-blue/10 border border-brand-blue/30 p-5 rounded-2xl flex items-center gap-4 mb-6">
                                        <div className="bg-brand-blue/20 p-3 rounded-full text-brand-blue">
                                            <Download size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm uppercase tracking-wide">Produto Digital</h4>
                                            <p className="text-sm text-slate-300">
                                                O acesso ao seu produto será enviado via <strong>Email</strong> e <strong>WhatsApp</strong> após a confirmação do pagamento.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <button
                                            onClick={() => setDeliveryMethod('shipping')}
                                            className={`relative p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${deliveryMethod === 'shipping'
                                                ? 'bg-brand-blue/10 border-brand-blue shadow-[0_0_20px_rgba(56,182,255,0.1)]'
                                                : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'shipping' ? 'border-brand-blue' : 'border-slate-600'}`}>
                                                {deliveryMethod === 'shipping' && <div className="w-3 h-3 bg-brand-blue rounded-full"></div>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white flex items-center gap-2">Envio / Correio</div>
                                                <div className="text-xs text-slate-400 mt-1">Taxa: ¥{shippingCost}</div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setDeliveryMethod('pickup')}
                                            className={`relative p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${deliveryMethod === 'pickup'
                                                ? 'bg-green-900/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                                                : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'pickup' ? 'border-green-500' : 'border-slate-600'}`}>
                                                {deliveryMethod === 'pickup' && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white flex items-center gap-2">Retirada na Loja</div>
                                                <div className="text-xs text-green-400 mt-1 font-bold">Grátis (Shiga-ken)</div>
                                            </div>
                                        </button>
                                    </div>
                                )}

                                {deliveryMethod === 'shipping' ? (
                                    <div className="space-y-4 animate-fade-in bg-slate-950/50 p-5 rounded-xl border border-slate-800">
                                        <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase"><MapPin size={12} /> Endereço Completo</label>

                                        <div className="flex flex-col gap-4">
                                            {/* Postal Code - Search Button Removed as requested */}
                                            <div>
                                                <input
                                                    type="text"
                                                    className="w-full sm:w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:border-brand-blue outline-none"
                                                    value={formData.postalCode}
                                                    onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                                                    placeholder="Código Postal (〒)"
                                                    maxLength={8}
                                                />
                                            </div>

                                            <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:border-brand-blue outline-none"
                                                placeholder="Província / Cidade" value={formData.cityState} onChange={e => setFormData({ ...formData, cityState: e.target.value })} />
                                            <textarea className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none resize-none h-20"
                                                value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Bairro, Número, Nome do Edifício..." />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                                        <MapPin className="text-green-500 shrink-0 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-sm text-white">Local de Retirada</p>
                                            <p className="text-sm text-slate-400">Shiga-ken, Koka-shi, Minakuchi-cho</p>
                                            <p className="text-xs text-slate-500 mt-1">Combinaremos o horário exato pelo WhatsApp.</p>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: SUMMARY + PAYMENT (Span 5) */}
            <div className="lg:col-span-5 relative space-y-6">

                {/* 1. SUMMARY CARD */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-slate-800 pb-4">Resumo do Pedido</h2>

                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                        {cart.map(item => (
                            <div key={item.cartId} className="border-b border-slate-800 pb-4 last:border-0">
                                <div className="flex justify-between items-start text-sm mb-1">
                                    <div className="text-slate-300">
                                        <span className="font-bold text-white">{item.quantity}x</span> {item.name}
                                    </div>
                                    <div className="text-slate-400 font-mono">¥{(item.price * item.quantity).toLocaleString()}</div>
                                </div>

                                {/* Status Badges for Checkout */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {item.isCustomizable && (
                                        <span className="bg-brand-pink/10 text-brand-pink border border-brand-pink/30 px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1">
                                            <PenTool size={10} /> Personalizado
                                        </span>
                                    )}
                                    {item.includesFreePage && (
                                        <span className="bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/30 px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1">
                                            <Gift size={10} /> Página Free Inclusa
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 mb-4 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center text-sm text-slate-400">
                            <span>Subtotal</span><span>¥{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-400">
                            <span>Frete</span>
                            <span className={(deliveryMethod === 'pickup' || isDigitalOnly) ? 'text-green-400 font-bold' : ''}>
                                {effectiveShipping > 0 ? `¥${effectiveShipping}` : 'Grátis'}
                            </span>
                        </div>
                        {appliedCoupons.map((c) => (
                            <div key={c.id} className="flex justify-between items-center text-sm text-green-400 font-bold">
                                <span className="flex items-center gap-1"><Ticket size={14} /> Desconto ({c.code})</span>
                                <span>- ¥{Math.floor(subtotal * c.discountPercentage).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-brand-gray text-sm font-bold">Total Final</span>
                        <span className="text-2xl font-black text-white">¥{total.toLocaleString()}</span>
                    </div>

                    <button onClick={onBack} className="w-full text-center text-xs text-brand-gray hover:text-white font-bold mt-4">
                        Voltar e Editar Carrinho
                    </button>
                </div>

                {/* 2. PAYMENT CARD & CONFIRMATION */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                        <CreditCard size={20} className="text-green-400" />
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Selecione a forma de pagamento</h2>
                    </div>

                    <div className="space-y-3 mb-8">
                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.SQUARE
                                ? 'bg-brand-blue/10 border-brand-blue'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <input type="radio" name="payment" className="hidden"
                                checked={paymentMethod === PaymentMethod.SQUARE} onChange={() => setPaymentMethod(PaymentMethod.SQUARE)} />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === PaymentMethod.SQUARE ? 'border-brand-blue' : 'border-slate-600'}`}>
                                {paymentMethod === PaymentMethod.SQUARE && <div className="w-2.5 h-2.5 bg-brand-blue rounded-full"></div>}
                            </div>
                            <CreditCard size={24} className={paymentMethod === PaymentMethod.SQUARE ? "text-brand-blue" : "text-slate-500"} />
                            <div>
                                <span className="font-bold text-white block">Cartão de Crédito</span>
                                <span className="text-xs text-slate-500">Link seguro via Square</span>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.PAYPAY
                                ? 'bg-red-900/10 border-red-500'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <input type="radio" name="payment" className="hidden"
                                checked={paymentMethod === PaymentMethod.PAYPAY} onChange={() => setPaymentMethod(PaymentMethod.PAYPAY)} />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === PaymentMethod.PAYPAY ? 'border-red-500' : 'border-slate-600'}`}>
                                {paymentMethod === PaymentMethod.PAYPAY && <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>}
                            </div>
                            <Smartphone size={24} className={paymentMethod === PaymentMethod.PAYPAY ? "text-red-500" : "text-slate-500"} />
                            <div>
                                <span className="font-bold text-white block">PayPay</span>
                                <span className="text-xs text-slate-500">Link de pagamento</span>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === PaymentMethod.TRANSFER
                                ? 'bg-green-900/10 border-green-500'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <input type="radio" name="payment" className="hidden"
                                checked={paymentMethod === PaymentMethod.TRANSFER} onChange={() => setPaymentMethod(PaymentMethod.TRANSFER)} />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === PaymentMethod.TRANSFER ? 'border-green-500' : 'border-slate-600'}`}>
                                {paymentMethod === PaymentMethod.TRANSFER && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
                            </div>
                            <Banknote size={24} className={paymentMethod === PaymentMethod.TRANSFER ? "text-green-500" : "text-slate-500"} />
                            <div>
                                <span className="font-bold text-white block">Transferência Bancária</span>
                                <span className="text-xs text-slate-500">JP Bank (Banco do Correio)</span>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleInitiateCheckout}
                        disabled={!user}
                        className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2 ${user
                            ? 'bg-brand-blue text-white hover:bg-brand-blue/90 hover:shadow-brand-blue/25'
                            : 'bg-slate-800 text-slate-300 cursor-not-allowed border border-slate-700'
                            }`}
                    >
                        {user ? <><CheckCircle size={20} /> Confirmar Pedido</> : <><Lock size={20} /> Faça Login ou Cadastre-se para concluir</>}
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                        <ShieldCheck size={12} /> Compra 100% Segura
                    </div>
                </div>
            </div>
        </div>
    );
};
