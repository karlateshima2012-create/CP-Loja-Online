import React, { useState, useEffect } from 'react';
import { useCart } from '../App';
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
  const [lastOrder, setLastOrder] = useState<Order | null>(null); // Store full order object
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    setPartners(mockService.getPartners());
    // Scroll to top
    window.scrollTo(0,0);
  }, [step]);

  // Financial Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = deliveryMethod === 'shipping' ? SHIPPING_COST : 0;
  const total = subtotal + shippingFee;

  const getPartnerName = (id?: string) => {
    if (!id) return null;
    return partners.find(p => p.id === id)?.name;
  };

  const handleCheckout = () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Por favor preencha os dados de contato (Nome, Email, Telefone).");
      return;
    }

    if (deliveryMethod === 'shipping' && !formData.address) {
        alert("Por favor preencha o endereço de entrega.");
        return;
    }

    // Determine Final Address string based on method
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
      items: [...cart], // Copy items before clearing
      totalAmount: total, // Includes Shipping
      paymentMethod,
      status: OrderStatus.PENDING_PAYMENT,
    };

    mockService.createOrder(newOrder);
    setLastOrder(newOrder); // Save for display
    clearCart();
    setStep('success');
  };

  // Simulated Upload Handler
  const handleUploadProof = () => {
    if (!lastOrder) return;
    setIsUploading(true);
    setTimeout(() => {
      // Update order in Mock Service with a fake URL
      mockService.updateOrderDetails(lastOrder.id, {
          paymentProofUrl: 'https://images.unsplash.com/photo-1550523118-971c6d3d666d?auto=format&fit=crop&w=300&q=80' // Placeholder Receipt Image
      });
      
      setIsUploading(false);
      setUploadSuccess(true);
    }, 1500);
  };

  // --- SUCCESS VIEW ---
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
             {/* Left: Instructions */}
             <div>
                <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                <Info size={16} className="text-brand-blue"/> Pagamento
                </h3>
                
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner h-full">
                    {paymentMethod === PaymentMethod.SQUARE && (
                    <div className="space-y-4">
                        <p className="text-slate-300 text-sm">Enviamos um link de pagamento seguro para o seu email e WhatsApp.</p>
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-3">
                            <Mail className="text-brand-blue" size={20} />
                            <span className="text-xs text-brand-gray break-all">Verifique: <strong className="text-white">{formData.email}</strong></span>
                        </div>
                    </div>
                    )}
                    
                    {paymentMethod === PaymentMethod.PAYPAY && (
                    <div className="space-y-4">
                        <p className="text-slate-300 text-sm">Aguarde o link/QR Code que será enviado pelo nosso atendimento via WhatsApp/LINE.</p>
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-3">
                            <Smartphone className="text-brand-blue" size={20} />
                            <span className="text-xs text-brand-gray">Enviaremos para: <strong className="text-white">{formData.phone}</strong></span>
                        </div>
                    </div>
                    )}
                    
                    {paymentMethod === PaymentMethod.TRANSFER && (
                    <div className="space-y-4">
                        <p className="text-slate-300 text-sm mb-2">Realize a transferência para a conta:</p>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                            <div className="flex justify-between"><span className="text-brand-gray">Banco</span> <span className="text-white font-bold">JP Bank</span></div>
                            <div className="flex justify-between"><span className="text-brand-gray">Agência</span> <span className="text-white font-bold">123</span></div>
                            <div className="flex justify-between"><span className="text-brand-gray">Conta</span> <span className="text-white font-bold">456789</span></div>
                            <div className="flex justify-between"><span className="text-brand-gray">Titular</span> <span className="text-white font-bold">CREATIVE PRINT KK</span></div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <p className="text-xs text-brand-gray mb-3 font-bold uppercase">Comprovante</p>
                            {!uploadSuccess ? (
                            <button 
                                onClick={handleUploadProof}
                                disabled={isUploading}
                                className="w-full border border-dashed border-slate-700 hover:border-brand-blue hover:bg-slate-900/50 text-brand-gray hover:text-brand-blue transition-all rounded-xl p-4 flex flex-col items-center gap-2"
                            >
                                {isUploading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-blue"></div>
                                ) : (
                                <>
                                    <UploadCloud size={24} />
                                    <span className="font-bold text-xs">Enviar Agora</span>
                                </>
                                )}
                            </button>
                            ) : (
                            <div className="w-full bg-green-900/20 border border-green-500/30 text-green-400 rounded-xl p-3 flex items-center justify-center gap-2 font-bold text-xs">
                                <CheckCircle size={16} /> Recebido!
                            </div>
                            )}
                        </div>
                    </div>
                    )}
                </div>
             </div>

             {/* Right: Order Summary */}
             <div>
                <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                   <Package size={16} className="text-brand-yellow"/> Resumo do Pedido
                </h3>
                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {lastOrder.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                                <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-900" alt="" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-bold truncate">{item.name}</p>
                                    <p className="text-xs text-slate-500">Qtd: {item.quantity} x ¥{item.price.toLocaleString()}</p>
                                    {item.customizationValues && (
                                        <p className="text-[10px] text-brand-blue mt-0.5 truncate">
                                            {Object.values(item.customizationValues).join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div className="text-white font-bold text-sm">
                                    ¥{(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-900 p-4 border-t border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-brand-gray">Frete</span>
                            <span className="text-white font-medium">{lastOrder.totalAmount - lastOrder.items.reduce((a,b)=>a+(b.price*b.quantity),0) > 0 ? `¥${SHIPPING_COST}` : 'Grátis'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                            <span className="text-brand-gray font-bold">Total Final</span>
                            <span className="text-xl font-black text-white">¥{lastOrder.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-center">
            <Link to="/shop" className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-brand-blue/20">
                Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- EMPTY CART VIEW ---
  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="inline-flex p-8 rounded-full bg-slate-900 border border-slate-800 mb-8 shadow-2xl">
           <Smartphone size={64} className="text-slate-700" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4">Seu carrinho está vazio</h2>
        <p className="text-brand-gray text-lg mb-8 max-w-md mx-auto">Navegue pelo nosso catálogo e encontre a solução digital perfeita para o seu negócio.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-blue text-white px-10 py-4 rounded-xl font-bold hover:bg-brand-blue/90 transition-all shadow-lg hover:shadow-brand-blue/25">
          Explorar Loja <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  // --- CART & CHECKOUT FLOW ---
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-white mb-8 flex items-center gap-3">
        <span className="bg-gradient-to-br from-brand-blue to-brand-yellow w-3 h-10 rounded-full"></span>
        {step === 'cart' ? 'Carrinho de Compras' : 'Finalizar Pedido'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            {cart.map((item, index) => {
              const partnerName = item.isExclusive ? getPartnerName(item.partnerId) : getPartnerName(item.referralPartnerId);
              const partnerLabel = item.isExclusive ? 'Vendido por' : 'Indicação';
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
                         
                         {/* Partner Badge */}
                         {partnerName && (
                           <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-800 text-brand-yellow px-2 py-0.5 rounded border border-brand-yellow/20">
                              <Store size={10} />
                              {partnerLabel}: {partnerName}
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
                        <p className="text-[10px] uppercase font-bold text-brand-gray mb-1 flex items-center gap-1"><Info size={10}/> Personalização:</p>
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
                          {/* Qty Selector */}
                          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg h-9">
                                {isPackProduct ? (
                                    // Locked Qty for Pack Products
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
                          {isPackProduct && <span className="text-[10px] text-orange-400 italic">*Item vendido em lote</span>}
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
          
          {step === 'cart' && (
             <Link to="/shop" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-blue font-bold text-sm transition-colors pl-2">
                <ArrowRight className="rotate-180" size={16} /> Continuar Comprando
             </Link>
          )}
        </div>

        {/* RIGHT COLUMN: Summary & Checkout Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24">
            
            {step === 'cart' ? (
              // SUMMARY VIEW
              <>
                <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Banknote size={20} className="text-brand-blue"/> Resumo
                </h2>
                
                <div className="space-y-3 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-brand-gray text-sm">
                    <span>Subtotal ({cart.length} itens)</span>
                    <span>¥{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-gray text-sm">
                    <span>Frete Estimado</span>
                    <span className="text-slate-400 text-xs">Calculado no checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 py-4 mb-6 flex justify-between items-end">
                   <span className="text-white font-bold">Total Aproximado</span>
                   <span className="text-3xl font-black text-white">
                     ¥{total.toLocaleString()}
                   </span>
                </div>

                <button 
                  onClick={() => { setStep('checkout'); }}
                  className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl hover:bg-brand-blue/90 transition-all shadow-[0_0_20px_rgba(56,182,255,0.4)] hover:shadow-[0_0_30px_rgba(56,182,255,0.6)] flex justify-center items-center gap-2 transform active:scale-[0.98]"
                >
                  Finalizar Compra <ArrowRight size={20}/>
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                    <ShieldCheck size={12} /> Compra 100% Segura
                </div>
              </>
            ) : (
              // CHECKOUT FORM VIEW
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-lg font-bold text-white">Seus Dados</h2>
                   <button onClick={() => setStep('cart')} className="text-xs text-brand-blue hover:underline font-bold">Editar Carrinho</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase mb-2">
                      <User size={12}/> Nome Completo
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none transition-colors placeholder-slate-700 focus:ring-1 focus:ring-brand-blue"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase mb-2">
                      <Mail size={12}/> Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none transition-colors placeholder-slate-700 focus:ring-1 focus:ring-brand-blue"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="Ex: joao@email.com"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase mb-2">
                      <Phone size={12}/> WhatsApp / Telefone
                    </label>
                    <input 
                      type="tel" 
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none transition-colors placeholder-slate-700 focus:ring-1 focus:ring-brand-blue"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="Ex: 090-1234-5678"
                    />
                  </div>
                  
                  {/* --- DELIVERY METHOD SELECTOR --- */}
                  <div className="pt-2 border-t border-slate-800 mt-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase mb-2">
                        <Truck size={12}/> Método de Entrega
                      </label>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                           <button 
                             onClick={() => setDeliveryMethod('shipping')}
                             className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${deliveryMethod === 'shipping' ? 'bg-brand-blue/20 border-brand-blue text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                           >
                               <Truck size={20} className="mb-1"/>
                               <span className="text-xs font-bold">Envio</span>
                               <span className="text-[10px]">¥{SHIPPING_COST}</span>
                           </button>

                           <button 
                             onClick={() => setDeliveryMethod('pickup')}
                             className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${deliveryMethod === 'pickup' ? 'bg-green-900/20 border-green-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                           >
                               <Store size={20} className="mb-1"/>
                               <span className="text-xs font-bold">Retirada</span>
                               <span className="text-[10px] text-green-400">Grátis</span>
                           </button>
                      </div>

                      {deliveryMethod === 'pickup' ? (
                          <div className="bg-green-900/10 border border-green-500/30 p-4 rounded-xl text-green-400 animate-fade-in">
                              <p className="text-xs font-bold uppercase mb-1 flex items-center gap-1"><MapPin size={12}/> Local de Retirada:</p>
                              <p className="font-bold text-sm">Shiga - Koka - Minakuchi</p>
                              <p className="text-[10px] mt-1 text-slate-400">Entraremos em contato para agendar o horário.</p>
                          </div>
                      ) : (
                          <div className="animate-fade-in">
                                <label className="flex items-center gap-2 text-xs font-bold text-brand-gray uppercase mb-2">
                                <MapPin size={12}/> Endereço de Entrega
                                </label>
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <input 
                                    type="text" 
                                    className="col-span-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-3 text-white focus:border-brand-blue outline-none transition-colors placeholder-slate-700 focus:ring-1 focus:ring-brand-blue"
                                    value={formData.postalCode}
                                    onChange={e => setFormData({...formData, postalCode: e.target.value})}
                                    placeholder="CEP (〒)"
                                    />
                                    <input 
                                    type="text" 
                                    disabled
                                    className="col-span-2 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-3 text-brand-gray italic cursor-not-allowed"
                                    placeholder="Preenchimento auto..."
                                    />
                                </div>
                                <textarea 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none transition-colors placeholder-slate-700 resize-none h-24 focus:ring-1 focus:ring-brand-blue"
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                placeholder="Província, Cidade, Bairro, Edifício..."
                                />
                          </div>
                      )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h2 className="text-lg font-bold text-white mb-4">Pagamento</h2>
                  <div className="space-y-3">
                    <button 
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition-all ${paymentMethod === PaymentMethod.SQUARE ? 'bg-brand-blue/20 border-brand-blue text-white shadow-[0_0_15px_rgba(36,155,203,0.15)]' : 'bg-slate-950 border-slate-800 text-brand-gray hover:border-slate-600'}`}
                      onClick={() => setPaymentMethod(PaymentMethod.SQUARE)}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className={paymentMethod === PaymentMethod.SQUARE ? "text-brand-blue" : ""} />
                        <span className="font-bold text-sm">Cartão (Square)</span>
                      </div>
                      {paymentMethod === PaymentMethod.SQUARE && <div className="w-3 h-3 bg-brand-blue rounded-full"></div>}
                    </button>
                    
                    <button 
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition-all ${paymentMethod === PaymentMethod.PAYPAY ? 'bg-brand-blue/20 border-brand-blue text-white shadow-[0_0_15px_rgba(36,155,203,0.15)]' : 'bg-slate-950 border-slate-800 text-brand-gray hover:border-slate-600'}`}
                      onClick={() => setPaymentMethod(PaymentMethod.PAYPAY)}
                    >
                      <div className="flex items-center gap-3">
                         <Smartphone size={20} className={paymentMethod === PaymentMethod.PAYPAY ? "text-red-500" : ""} />
                         <span className="font-bold text-sm">PayPay</span>
                      </div>
                      {paymentMethod === PaymentMethod.PAYPAY && <div className="w-3 h-3 bg-brand-blue rounded-full"></div>}
                    </button>

                    <button 
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition-all ${paymentMethod === PaymentMethod.TRANSFER ? 'bg-brand-blue/20 border-brand-blue text-white shadow-[0_0_15px_rgba(36,155,203,0.15)]' : 'bg-slate-950 border-slate-800 text-brand-gray hover:border-slate-600'}`}
                      onClick={() => setPaymentMethod(PaymentMethod.TRANSFER)}
                    >
                      <div className="flex items-center gap-3">
                         <Banknote size={20} className={paymentMethod === PaymentMethod.TRANSFER ? "text-green-500" : ""} />
                         <span className="font-bold text-sm">Transferência (JP Post)</span>
                      </div>
                       {paymentMethod === PaymentMethod.TRANSFER && <div className="w-3 h-3 bg-brand-blue rounded-full"></div>}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-sm text-slate-400">
                            <span>Subtotal</span>
                            <span>¥{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-400">
                            <span>Frete ({deliveryMethod === 'shipping' ? 'Envio' : 'Retirada'})</span>
                            <span className={deliveryMethod === 'pickup' ? 'text-green-400 font-bold' : ''}>{deliveryMethod === 'shipping' ? `¥${SHIPPING_COST}` : 'Grátis'}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 border-t border-slate-800 pt-3">
                        <span className="text-brand-gray">Total a pagar:</span>
                        <span className="text-2xl font-black text-white">¥{total.toLocaleString()}</span>
                    </div>
                    <button 
                    onClick={handleCheckout}
                    className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(56,182,255,0.4)] hover:shadow-[0_0_30px_rgba(56,182,255,0.6)] hover:bg-brand-blue/90 transition-transform active:scale-[0.98] flex justify-center items-center gap-2"
                    >
                    Confirmar Pedido <CheckCircle size={20}/>
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};