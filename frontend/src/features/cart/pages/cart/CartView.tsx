
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import { useCart } from '../../CartContext';
import { Coupon } from '@/src/types';
import { Trash2, Minus, Plus, Store, Info, ArrowRight, ShieldCheck, Banknote, ShoppingBag, ArrowLeft, Ticket, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';

interface CartViewProps {
    onProceed: () => void;
    shippingCost: number;
}

export const CartView: React.FC<CartViewProps> = ({ onProceed, shippingCost }) => {
    const { cart, removeFromCart, updateQuantity, appliedCoupons, applyCoupon, removeCoupon } = useCart();
    const { user } = useAuth();

    // Local state for coupon input
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);

    useEffect(() => {
        if (user) {
            // Load available coupons for this user
            const coupons = mockService.getCouponsForCustomer(user.id);
            setUserCoupons(coupons);
        }
    }, [user]);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Calculate Total Discount (Sum of all coupons)
    const discountAmount = appliedCoupons.reduce((sum, coupon) => {
        return sum + Math.floor(subtotal * coupon.discountPercentage);
    }, 0);

    // Ensure discount doesn't exceed subtotal (unlikely but safe)
    const effectiveDiscount = Math.min(discountAmount, subtotal);
    const total = Math.max(0, subtotal + shippingCost - effectiveDiscount);

    const handleApplyCoupon = () => {
        setCouponError('');
        if (!couponCode) return;

        // Use global context function
        const result = applyCoupon(couponCode, user?.id);

        if (result.success) {
            setCouponCode('');
        } else {
            setCouponError(result.message || 'Erro ao aplicar cupom.');
        }
    };

    const handleOneClickCoupon = (c: Coupon) => {
        const result = applyCoupon(c.code, user?.id);
        if (!result.success) {
            // Optional: Handle visual feedback for one-click error (rare since list is filtered)
        }
    };

    const handleProceedClick = () => {
        onProceed();
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-32 text-center animate-fade-in">
                <div className="inline-flex p-8 rounded-full bg-slate-900 border border-slate-800 mb-8 shadow-2xl">
                    <ShoppingBag size={64} className="text-slate-700" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4">Seu carrinho está vazio</h2>
                <p className="text-brand-gray text-lg mb-8 max-w-md mx-auto">Navegue pelo nosso catálogo e encontre a solução digital perfeita para o seu negócio.</p>
                <Link to="/produtos" className="inline-flex items-center gap-2 bg-brand-blue text-white px-10 py-4 rounded-xl font-bold hover:bg-brand-blue/90 transition-all shadow-lg hover:shadow-brand-blue/25">
                    Explorar Loja <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* LEFT COLUMN: Cart Items */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                    {cart.map((item, index) => {
                        const isPackProduct = item.priceTiers && item.priceTiers.length > 0;
                        return (
                            <div key={item.cartId} className={`p-6 flex flex-col md:flex-row gap-6 ${index !== cart.length - 1 ? 'border-b border-slate-800' : ''}`}>
                                {/* Product Image */}
                                <div className="w-full md:w-28 h-28 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex-shrink-0 relative">
                                    <div className="absolute inset-0 bg-brand-blue/10"></div>
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover relative z-10" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-white text-lg leading-tight mb-1">{item.name}</h3>
                                            <div className="text-xs text-brand-blue font-bold uppercase tracking-wider mb-2">{item.category}</div>

                                            {item.isExclusive && (
                                                <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-800 text-brand-yellow px-2 py-0.5 rounded border border-brand-yellow/20">
                                                    <Store size={10} /> Produto Exclusivo
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => removeFromCart(item.cartId)} className="text-slate-600 hover:text-red-500 transition-colors p-2 hover:bg-slate-800 rounded-lg" title="Remover item">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Customizations */}
                                    {item.customizationValues && Object.keys(item.customizationValues).length > 0 && (
                                        <div className="mb-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                            <p className="text-[10px] uppercase font-bold text-brand-gray mb-1 flex items-center gap-1"><Info size={10} /> Personalização:</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                                {Object.entries(item.customizationValues).map(([k, v]) => (
                                                    <div key={k} className="flex gap-1">
                                                        <span className="text-slate-500">{k}:</span>
                                                        <span className="text-white font-medium truncate">{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price & Quantity Controls */}
                                    <div className="flex justify-between items-end mt-auto">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg h-9">
                                                {isPackProduct ? (
                                                    <div className="px-3 text-sm font-bold text-orange-400 bg-orange-900/10 h-full flex items-center border-r border-slate-700 rounded-l-lg border-l-0">
                                                        Pacote
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-l-lg transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                )}

                                                <span className="min-w-[32px] px-2 text-center text-sm font-bold text-white">{item.quantity}</span>

                                                {isPackProduct ? (
                                                    <div className="w-8 h-full flex items-center justify-center text-slate-600 cursor-not-allowed">
                                                        <span className="text-[10px] uppercase">Und</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-r-lg transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-xs text-brand-gray mb-0.5">Subtotal</div>
                                            <div className="text-xl font-black text-brand-blue">
                                                ¥{(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT COLUMN: Summary */}
            <div className="lg:col-span-1">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24">
                    <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                        <Banknote size={20} className="text-brand-blue" /> Resumo
                    </h2>

                    <div className="space-y-3 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="flex justify-between text-brand-gray text-sm">
                            <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} itens)</span>
                            <span>¥{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-brand-gray text-sm">
                            <span>Frete (Envio)</span>
                            <span className="text-white font-bold">¥{shippingCost.toLocaleString()}</span>
                        </div>

                        {/* LIST APPLIED COUPONS */}
                        {appliedCoupons.map((coupon) => (
                            <div key={coupon.id} className="flex justify-between text-sm text-green-400 font-bold border-t border-slate-800 pt-2 mt-2 items-center">
                                <span className="flex items-center gap-1"><Ticket size={14} /> Cupom ({coupon.code})</span>
                                <span>- ¥{Math.floor(subtotal * coupon.discountPercentage).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    {/* Coupon Input Area */}
                    <div className="mb-6">
                        {/* Always show input to allow adding MORE coupons */}
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="DIGITE O CÓDIGO DO CUPOM DE DESCONTO"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-20 py-3 text-white focus:border-brand-blue outline-none uppercase font-mono text-sm"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-blue hover:text-white bg-transparent hover:bg-brand-blue/10 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold"
                                >
                                    APLICAR
                                </button>
                            </div>
                            {couponError && <p className="text-red-400 text-xs pl-2">{couponError}</p>}

                            {/* List Applied Coupons visually below input */}
                            {appliedCoupons.length > 0 && (
                                <div className="space-y-2 mt-3">
                                    {appliedCoupons.map(c => (
                                        <div key={c.id} className="bg-green-900/20 border border-green-500/30 p-2 rounded-lg flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Check size={14} className="text-green-400" />
                                                <div>
                                                    <p className="text-green-400 font-bold text-xs">{c.code}</p>
                                                    <p className="text-green-600 text-[10px]">{(c.discountPercentage * 100).toFixed(0)}% OFF</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeCoupon(c.id)} className="text-slate-500 hover:text-red-400 p-1">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* One-Click Available Coupons (Filtered: Hide already applied) */}
                            {userCoupons.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Selecione Seus Cupons Disponíveis:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {userCoupons.filter(uc => !appliedCoupons.some(ac => ac.id === uc.id)).map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => handleOneClickCoupon(c)}
                                                className="bg-brand-yellow/10 hover:bg-brand-yellow/20 border border-brand-yellow/30 text-brand-yellow text-xs px-3 py-1.5 rounded-lg transition-all font-bold flex items-center gap-1"
                                            >
                                                <Ticket size={12} /> {c.code}
                                            </button>
                                        ))}
                                        {userCoupons.every(uc => appliedCoupons.some(ac => ac.id === uc.id)) && (
                                            <p className="text-[10px] text-slate-600 italic">Todos os seus cupons já foram aplicados.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-slate-800 py-4 mb-6 flex justify-between items-end">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-3xl font-black text-white">
                            ¥{total.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleProceedClick}
                        className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-brand-blue/90 transition-all shadow-[0_0_20px_rgba(56,182,255,0.4)] hover:shadow-[0_0_30px_rgba(56,182,255,0.6)] flex justify-center items-center gap-2 transform active:scale-[0.98]"
                    >
                        Finalizar Compra <ArrowRight size={20} />
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                        <ShieldCheck size={12} /> Compra 100% Segura
                    </div>

                    <div className="border-t border-slate-800 my-6"></div>

                    <Link to="/produtos" className="w-full py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 font-bold text-sm transition-all flex justify-center items-center gap-2">
                        <ArrowLeft size={18} /> Continuar Comprando
                    </Link>
                </div>
            </div>
        </div>
    );
};
