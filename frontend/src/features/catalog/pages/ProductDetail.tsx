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
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      const found = mockService.getProduct(id);
      setProduct(found);
      if (found) {
        if (found.priceTiers && found.priceTiers.length > 0) {
          const bestSeller = found.priceTiers.find(t => t.isBestSeller);
          setSelectedTier(bestSeller || found.priceTiers[0]);
        }
        if (found.plans && found.plans.length > 0) {
          setSelectedPlan(found.plans[0]);
        }
      }
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.priceTiers && selectedTier) {
      const effectiveUnitPrice = selectedTier.totalPrice / selectedTier.quantity;
      const productForCart = { ...product, price: effectiveUnitPrice };
      addToCart(productForCart, selectedTier.quantity, undefined);
    } else if (product.plans && selectedPlan) {
      const productForCart = { ...product, price: selectedPlan.totalPrice };
      const planDetails = { "Plano Selecionado": selectedPlan.description || `${selectedPlan.months} Meses` };
      addToCart(productForCart, 1, planDetails);
    } else {
      addToCart(product, quantity, undefined);
    }
    navigate('/cart');
  };

  if (!product) return (
    <div className="min-h-[60vh] flex items-center justify-center text-brand-gray">
      <div className="animate-pulse">Carregando detalhes...</div>
    </div>
  );

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
      <button onClick={() => navigate(-1)} className="text-brand-gray hover:text-brand-blue mb-8 text-sm font-bold uppercase tracking-wide transition-colors flex items-center gap-2 group">
        <div className="bg-slate-800 p-2 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </div>
        Voltar para Loja
      </button>

      <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative bg-slate-950 flex items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-800 group overflow-hidden">
            <div className="absolute inset-0 bg-brand-blue/5 blur-[100px]"></div>
            <img src={product.imageUrl} alt={product.name} className="relative w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl hover:scale-105 transition-transform duration-500 z-10" />
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-blue/50 shadow-lg flex items-center gap-2">
                <BadgeCheck size={14} /> OFICIAL CREATIVE PRINT
              </span>
            </div>
          </div>

          <div className="p-8 lg:p-12 flex flex-col justify-center bg-slate-900 relative">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-slate-800 text-brand-blue border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Zap size={12} /> {product.category}
                </span>
                {product.isCustomizable && (
                  <span className="bg-brand-pink/20 text-brand-pink border border-brand-pink/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Personalizável</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{product.name}</h1>

              <div className="flex items-baseline gap-2 mb-6 border-b border-slate-800 pb-6">
                <span className="text-5xl font-black text-white tracking-tight">¥{currentPrice.toLocaleString()}</span>
                <span className="text-brand-gray text-sm font-medium">{priceSuffix}</span>
              </div>

              <div className="mb-6">
                <p className="text-slate-300 leading-relaxed text-base">{product.description}</p>
                {product.isCustomizable && (
                  <div className="mt-6 bg-brand-pink/10 border border-brand-pink/20 p-4 rounded-xl flex gap-3 items-start animate-fade-in">
                    <PenTool size={20} className="text-brand-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-brand-pink text-sm uppercase mb-1">Produto Personalizado</h4>
                      <p className="text-sm text-slate-300">Após a compra, você receberá pelo WhatsApp informações para personalização.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button onClick={handleAddToCart} className="w-full bg-brand-blue hover:bg-brand-blue/90 text-slate-950 font-black h-14 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-lg transition-all">
                <ShoppingCart size={20} /> Adicionar ao Carrinho
              </button>
              
              <button 
                onClick={() => navigate(-1)} 
                className="w-full bg-transparent border border-brand-blue/40 text-slate-400 hover:text-brand-blue hover:border-brand-blue font-bold h-12 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] transition-all shadow-[0_0_10px_rgba(56,182,255,0.1)]"
              >
                Continuar Comprando
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
