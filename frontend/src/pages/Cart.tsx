import React, { useState, useEffect } from 'react';
import { useCart } from '../features/cart/CartContext';
import { PaymentMethod, Order, OrderStatus, Partner } from '@/src/types';
import { mockService } from '@/src/services/mockData';
import { Trash2, CreditCard, Banknote, Smartphone, CheckCircle, ArrowRight, MapPin, User, Mail, Phone, Store, UploadCloud, Info, Minus, Plus, ShieldCheck, Package, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [partners, setPartners] = useState<Partner[]>([]);
  
  // Checkout State
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: ''
  });
  
  // New Delivery State
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');
  const SHIPPING_COST = 600;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.SQUARE);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    setPartners(mockService.getPartners());
    window.scrollTo(0,0);
  }, [step]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = deliveryMethod === 'shipping' ? SHIPPING_COST : 0;
  const total = subtotal + shippingFee;

  const getPartnerName = (id?: string) => {
    if (!id) return null;
    return partners.find(p => p.id === id)?.name;
  };

  const handleCheckout = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Por favor preencha os dados de contato (Nome, Email, Telefone).");
      return;
    }
    const finalShippingAddress = deliveryMethod === 'pickup' 
        ? "RETIRADA NA LOJA: Shiga - Koka - Minakuchi" 
        : `${formData.postalCode} ${formData.address}`;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: finalShippingAddress,
      items: [...cart],
      totalAmount: total,
      paymentMethod,
      status: OrderStatus.PENDING_PAYMENT,
    };

    mockService.createOrder(newOrder);
    setLastOrder(newOrder);
    clearCart();
    setStep('success');
  };

  if (step === 'success' && lastOrder) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-brand-yellow"></div>
          <div className="p-8 text-center border-b border-slate-800">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce-slow">
                <CheckCircle size={40} strokeWidth={3} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Pedido Recebido!</h2>
            <p className="text-brand-gray text-lg">Seu pedido <span className="text-white font-mono font-bold">#{lastOrder.id}</span> foi criado com sucesso.</p>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                    <Info size={16} className="text-brand-blue"/> Pagamento
                </h3>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner h-full text-white">
                    {paymentMethod === PaymentMethod.SQUARE && (
                    <div className="space-y-4">
                        <p className="text-slate-300 text-sm">Enviamos o link de pagamento para seu email.</p>
                    </div>
                    )}
                    {paymentMethod === PaymentMethod.TRANSFER && (
                    <div className="space-y-4">
                        <p className="text-slate-300 text-sm">Realize a transferência para a conta JP Bank.</p>
                    </div>
                    )}
                </div>
             </div>
          </div>
          <div className="p-6 bg-slate-950 flex justify-center">
            <Link to="/products" className="bg-brand-blue text-white font-bold py-3 px-8 rounded-xl">
                Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-4xl font-black text-white mb-4">Seu carrinho está vazio</h2>
        <Link to="/products" className="inline-flex items-center gap-2 bg-brand-blue text-white px-10 py-4 rounded-xl font-bold">
          Explorar Loja <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-white mb-8">
        {step === 'cart' ? 'Carrinho' : 'Finalizar Pedido'}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.cartId} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex gap-6">
                <img src={item.imageUrl} className="w-24 h-24 rounded-xl object-cover" alt={item.name} />
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white text-lg">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-slate-500 hover:text-red-500"><Trash2 size={20} /></button>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 h-10">
                            <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-3 text-white"><Minus size={14}/></button>
                            <span className="px-2 text-white font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-3 text-white"><Plus size={14}/></button>
                        </div>
                        <span className="text-xl font-black text-brand-blue">¥{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Resumo</h2>
            <div className="flex justify-between text-white font-black text-2xl mb-8 border-t border-slate-800 pt-6">
                <span>Total</span>
                <span>¥{total.toLocaleString()}</span>
            </div>
            {step === 'cart' ? (
                <button onClick={() => setStep('checkout')} className="w-full bg-brand-blue text-white font-black py-5 rounded-2xl shadow-xl shadow-brand-blue/20">Finalizar Compra</button>
            ) : (
                <div className="space-y-4">
                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome Completo" />
                    <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" />
                    <input type="tel" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="WhatsApp" />
                    <button onClick={handleCheckout} className="w-full bg-green-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-500/20 mt-4 uppercase tracking-widest">Confirmar Pedido</button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};