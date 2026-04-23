
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product, PriceTier, PlanOption } from '@/src/types';
import { useCart } from '../../cart/CartContext';
import { ShoppingCart, ShieldCheck, Zap, BadgeCheck, ArrowLeft, Layers, Package, PenTool, Gift, Calendar, Clock } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState(1);

  // Tiers Logic (Atacado)
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(null);

  // Plans Logic (Tempo/Assinatura)
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (id) {
      const found = mockService.getProduct(id);
      setProduct(found);

      if (found) {
        // Initialize Tier selection: Default to Best Seller, or First
        if (found.priceTiers && found.priceTiers.length > 0) {
          const bestSeller = found.priceTiers.find(t => t.isBestSeller);
          setSelectedTier(bestSeller || found.priceTiers[0]);
        }

        // Initialize Plan selection: Default to First Plan
        if (found.plans && found.plans.length > 0) {
          setSelectedPlan(found.plans[0]);
        }
      }
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // STRATEGY 1: Tier Logic (Atacado)
    if (product.priceTiers && selectedTier) {
      const effectiveUnitPrice = selectedTier.totalPrice / selectedTier.quantity;
      const productForCart = { ...product, price: effectiveUnitPrice };
      addToCart(productForCart, selectedTier.quantity, undefined);
    }
    // STRATEGY 2: Plan Logic (Serviços/Tempo)
    else if (product.plans && selectedPlan) {
      const productForCart = { ...product, price: selectedPlan.totalPrice };
      const planDetails = {
        "Plano Selecionado": selectedPlan.description || `${selectedPlan.months} Meses`
      };
      addToCart(productForCart, 1, planDetails);
    }
    // STRATEGY 3: Standard Logic (Unitário)
    else {
      addToCart(product, quantity, undefined);
    }

    navigate('/cart');
  };

  if (!product) return (
    <div className="min-h-[60vh] flex items-center justify-center text-brand-gray">
      <div className="animate-pulse">Carregando detalhes...</div>
    </div>
  );

  // Dynamic Price Calculation for Display
  let currentPrice = product.price;
  let priceSuffix = "/ unidade";

  if (selectedTier) {
    currentPrice = selectedTier.totalPrice;
    priceSuffix = `/ pacote de ${selectedTier.quantity} unid.`;
  } else if (selectedPlan) {
    currentPrice = selectedPlan.totalPrice;
    priceSuffix = `/ ${selectedPlan.description || ((selectedPlan.months || 12) + ' meses')}`;
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* Breadcrumb / Back */}
      <button onClick={() => navigate(-1)} className="text-brand-gray hover:text-brand-blue mb-8 text-sm font-bold uppercase tracking-wide transition-colors flex items-center gap-2 group">
        <div className="bg-slate-800 p-2 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </div>
        Voltar para Loja
      </button>

      <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* --- Image Section --- */}
          <div className="relative bg-slate-950 flex items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-800 group overflow-hidden">
            <div className="absolute inset-0 bg-brand-blue/5 blur-[100px] group-hover:bg-brand-blue/10 transition-colors duration-700"></div>

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 pointer-events-none"></div>

            <img
              src={product.imageUrl}
              alt={product.name}
              className="relative w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl hover:scale-105 transition-transform duration-500 z-10"
            />

            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-blue/50 shadow-lg flex items-center gap-2 w-fit animate-fade-in-up">
                <BadgeCheck size={14} /> OFICIAL CREATIVE PRINT
              </span>
            </div>
          </div>

          {/* --- Details Section --- */}
          <div className="p-8 lg:p-12 flex flex-col justify-center bg-slate-900 relative">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-slate-800 text-brand-blue border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Zap size={12} /> {product.category}
                </span>
                {product.priceTiers && (
                  <span className="bg-orange-900/30 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Layers size={12} /> Venda por Pacote
                  </span>
                )}
                {product.plans && (
                  <span className="bg-blue-900/30 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={12} /> Assinatura / Plano
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{product.name}</h1>

              <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-blue/10 p-3 rounded-xl border border-brand-blue/20">
                    <BadgeCheck className="text-brand-blue" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray font-bold uppercase tracking-wider mb-0.5">Produto Oficial</p>
                    <p className="text-white font-black text-lg">Creative Print</p>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6 border-b border-slate-800 pb-6">
                <span className="text-5xl font-black text-white tracking-tight">
                  ¥{currentPrice.toLocaleString()}
                </span>
                <span className="text-brand-gray text-sm font-medium">{priceSuffix}</span>
              </div>

              <div className="mb-6">
                <p className="text-slate-300 leading-relaxed text-base">{product.description}</p>

                {product.isCustomizable && (
                  <div className="mt-6 bg-brand-pink/10 border border-brand-pink/20 p-4 rounded-xl flex gap-3 items-start animate-fade-in">
                    <PenTool size={20} className="text-brand-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-brand-pink text-sm uppercase mb-1">Produto Personalizado</h4>
                      <p className="text-sm text-slate-300">
                        Este é um produto personalizado. Após a compra, você receberá pelo WhatsApp o formulário para envio da logo e dos dados de personalização.
                      </p>
                    </div>
                  </div>
                )}

                {product.includesFreePage && (
                  <div className="mt-4 bg-brand-yellow/10 border border-brand-yellow/30 p-4 rounded-xl flex gap-3 items-start animate-fade-in">
                    <Gift size={20} className="text-brand-yellow shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-brand-yellow text-sm uppercase mb-1">Bônus Incluso</h4>
                      <p className="text-sm text-slate-300">
                        Comprando este produto, você ganha uma página de links personalizada e acesso vitalício a Plataforma <strong>CreativeFlix</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {product.priceTiers && (
                <div className="space-y-3 mb-4 animate-fade-in">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Package size={14} /> Escolha o pacote:</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.priceTiers.map((tier, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTier(tier)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all relative overflow-hidden ${selectedTier === tier
                          ? 'bg-slate-900 text-brand-yellow border-brand-yellow shadow-lg scale-105'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                          }`}
                      >
                        {tier.isBestSeller && (
                          <div className="absolute top-0 right-0 bg-slate-900 border border-brand-yellow text-brand-yellow text-[8px] font-bold px-1.5 py-0.5 rounded-bl">HOT</div>
                        )}
                        <span className="font-black text-lg">{tier.quantity}</span>
                        <span className="text-[10px] uppercase font-bold">Unidades</span>
                        <span className="text-xs mt-1 font-medium">¥{tier.totalPrice.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.plans && (
                <div className="space-y-3 mb-4 animate-fade-in">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Clock size={14} /> Escolha a duração:</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {product.plans.map((plan, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all relative overflow-hidden ${selectedPlan === plan
                          ? 'bg-slate-900 text-brand-blue border-brand-blue shadow-lg scale-105'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                          }`}
                      >
                        <span className="font-black text-lg">{plan.months} Meses</span>
                        <span className="text-[10px] uppercase font-bold opacity-70">{plan.description}</span>
                        <span className="text-xs mt-1 font-bold text-white">¥{plan.totalPrice.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!product.priceTiers && !product.plans && (
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl h-14 sm:w-auto w-full">
                    <button
                      className="w-14 h-full hover:bg-slate-800 text-brand-gray hover:text-white transition-colors text-xl font-medium rounded-l-xl"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >-</button>
                    <span className="w-12 text-center font-bold text-white text-lg">{quantity}</span>
                    <button
                      className="w-14 h-full hover:bg-slate-800 text-brand-gray hover:text-white transition-colors text-xl font-medium rounded-r-xl"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={currentPrice === 0 && !product.includesFreePage}
                className={`w-full text-white font-bold h-14 rounded-xl transition-all shadow-[0_0_20px_rgba(56,182,255,0.3)] hover:shadow-[0_0_30px_rgba(56,182,255,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-3 uppercase tracking-wide text-sm ${currentPrice === 0 && !product.includesFreePage
                  ? 'bg-slate-800 cursor-not-allowed opacity-50'
                  : 'bg-brand-blue hover:bg-brand-blue/90'
                  }`}
              >
                <ShoppingCart size={20} />
                Adicionar ao Carrinho
              </button>

              <div className="flex items-center gap-2 text-xs text-brand-gray justify-center pt-2">
                <ShieldCheck size={14} className="text-green-500" />
                <span>Compra Segura</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full mx-1"></span>
                <span>Entrega em todo Japão</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
