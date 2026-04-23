import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { Product, PriceTier, PlanOption, ProductAccordionItem } from '@/src/types';
import { useCart } from '../../cart/CartContext';
import { 
    ShoppingCart, ShieldCheck, Zap, BadgeCheck, ArrowLeft, 
    Layers, Package, PenTool, Gift, Calendar, Clock,
    ChevronDown, ChevronUp, MessageCircle, Info
} from 'lucide-react';

const AccordionItem: React.FC<{ item: ProductAccordionItem, isOpen: boolean, onToggle: () => void }> = ({ item, isOpen, onToggle }) => {
    return (
        <div className="border-b border-slate-800 last:border-0">
            <button 
                onClick={onToggle}
                className="w-full py-4 flex items-center justify-between text-left group transition-all"
            >
                <span className={`font-bold text-sm uppercase tracking-wider transition-colors ${isOpen ? 'text-brand-blue' : 'text-slate-400 group-hover:text-white'}`}>
                    {item.title}
                </span>
                {isOpen ? <ChevronUp size={18} className="text-brand-blue" /> : <ChevronDown size={18} className="text-slate-600" />}
            </button>
            {isOpen && (
                <div className="pb-6 animate-fade-in">
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {item.content}
                    </div>
                </div>
            )}
        </div>
    );
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0); // Primeiro aberto por padrão

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

  // Fallback para Accordion padrão caso não venha do banco
  const defaultAccordion: ProductAccordionItem[] = [
    {
        title: "👉 Como funciona",
        content: "Encoste o celular no produto e acesse seu link digital automaticamente.\nCompatível com a maioria dos smartphones modernos, sem necessidade de app."
    },
    {
        title: "👉 O que você recebe",
        content: "• 1 chaveiro personalizado\n• NFC programado com seu link\n• Acesso à sua página digital (CP Connect)"
    },
    {
        title: "👉 Personalização",
        content: "Após a compra, você envia suas informações e arte.\nNós cuidamos de toda a configuração e produção."
    },
    {
        title: "👉 Prazo de produção e entrega",
        content: "Produção: 2 a 5 dias úteis\nEnvio no Japão: rápido e com rastreio"
    },
    {
        title: "👉 Compatibilidade",
        content: "Funciona com Android e iPhone (modelos com NFC ativo).\nNão precisa instalar aplicativo."
    },
    {
        title: "👉 Dúvidas frequentes",
        content: "Posso mudar o link depois? → Sim\nPrecisa de internet? → Sim, para abrir o conteúdo\nPosso usar para empresa? → Sim, ideal para negócios"
    }
  ];

  const displayAccordion = product.accordion && product.accordion.length > 0 ? product.accordion : defaultAccordion;

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <button onClick={() => navigate(-1)} className="text-brand-gray hover:text-brand-blue mb-8 text-sm font-bold uppercase tracking-wide transition-colors flex items-center gap-2 group">
        <div className="bg-slate-800 p-2 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </div>
        Voltar para Loja
      </button>

      <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* --- Image Section --- */}
          <div className="relative bg-slate-950 flex items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-800 group overflow-hidden">
            <div className="absolute inset-0 bg-brand-blue/5 blur-[100px] group-hover:bg-brand-blue/10 transition-colors duration-700"></div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="relative w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl hover:scale-105 transition-transform duration-500 z-10"
            />
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-blue/50 shadow-lg flex items-center gap-2">
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
                {product.isCustomizable && (
                  <span className="bg-brand-pink/20 text-brand-pink border border-brand-pink/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Personalizável</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">{product.name}</h1>

              <div className="flex items-baseline gap-2 mb-8 border-b border-slate-800 pb-8">
                <span className="text-5xl font-black text-white tracking-tight">¥{currentPrice.toLocaleString()}</span>
                <span className="text-brand-gray text-sm font-medium">{priceSuffix}</span>
              </div>

              {/* DESCRIÇÃO E ACCORDION */}
              <div className="space-y-8">
                <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info size={14} /> Descrição
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-base">{product.description}</p>
                </div>

                <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 shadow-inner">
                    <h4 className="text-xs font-black text-brand-blue uppercase tracking-widest mb-2">Como funciona</h4>
                    <div className="flex flex-col">
                        {displayAccordion.map((item, idx) => (
                            <AccordionItem 
                                key={idx} 
                                item={item} 
                                isOpen={openAccordionIndex === idx} 
                                onToggle={() => setOpenAccordionIndex(openAccordionIndex === idx ? null : idx)} 
                            />
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center gap-4">
                        <p className="text-sm font-bold text-slate-400">Ainda com dúvida?</p>
                        <a 
                            href="https://wa.me/819011886491" 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full bg-green-500 hover:bg-green-600 text-slate-950 font-black uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/20"
                        >
                            <MessageCircle size={18} /> Falar no WhatsApp
                        </a>
                    </div>
                </div>
              </div>
            </div>

            {/* AÇÕES DE COMPRA */}
            <div className="space-y-4 pt-8 border-t border-slate-800">
                {product.priceTiers && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {product.priceTiers.map((tier, idx) => (
                            <button key={idx} onClick={() => setSelectedTier(tier)} className={`p-3 rounded-xl border flex flex-col items-center transition-all ${selectedTier === tier ? 'bg-brand-blue/10 border-brand-blue text-brand-blue scale-105 shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                                <span className="font-black text-xl">{tier.quantity} Unid.</span>
                                <span className="text-xs font-bold">¥{tier.totalPrice.toLocaleString()}</span>
                            </button>
                        ))}
                    </div>
                )}

                <button onClick={handleAddToCart} className="w-full bg-brand-blue hover:bg-brand-blue/90 text-slate-950 font-black h-16 rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-base transition-all shadow-lg hover:shadow-brand-blue/30">
                    <ShoppingCart size={22} /> Adicionar ao Carrinho
                </button>

                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 justify-center">
                    <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-500" /> Compra Segura</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="flex items-center gap-1"><Package size={12} className="text-brand-blue" /> Entrega em todo Japão</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
