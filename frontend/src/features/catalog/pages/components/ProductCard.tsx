
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/src/types';
import { ShoppingBag, BadgeCheck, PenTool, Layers, Calendar, Trophy, Gift } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Lógica de Preço Inteligente
  const getPriceDisplay = () => {
    if (product.priceTiers && product.priceTiers.length > 0) {
      const minPrice = Math.min(...product.priceTiers.map(t => t.totalPrice));
      return { label: 'A partir de', price: minPrice, icon: <Layers size={12} className="text-orange-400" /> };
    }
    if (product.plans && product.plans.length > 0) {
      const minPrice = Math.min(...product.plans.map(t => t.totalPrice));
      return { label: 'Planos a partir de', price: minPrice, icon: <Calendar size={12} className="text-brand-blue" /> };
    }
    return { label: 'Preço', price: product.price, icon: null };
  };

  const { label, price, icon } = getPriceDisplay();

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-brand-blue/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(36,155,203,0.15)] flex flex-col h-full animate-fade-in-up"
    >
      <div className="aspect-square bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* BEST SELLER BADGE */}
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-slate-900 text-brand-yellow text-[10px] font-bold px-3 py-1 rounded-full border border-brand-yellow shadow-lg z-20 flex items-center gap-1">
            <Trophy size={10} fill="currentColor" /> MAIS VENDIDO
          </span>
        )}

        {/* BONUS BADGE */}
        {product.includesFreePage && (
          <span className="absolute top-3 right-3 bg-brand-yellow text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full border border-brand-yellow shadow-lg z-20 flex items-center gap-1">
            <Gift size={10} /> + BÔNUS
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs text-brand-blue font-bold uppercase tracking-wider mb-2">{product.category}</div>
        <h3 className="font-bold text-white text-lg mb-2 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">{product.name}</h3>

        {/* Indicators */}
        <div className="mb-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-brand-gray font-medium">
            <BadgeCheck size={12} className="text-brand-blue" />
            <span>Creative Print Oficial</span>
          </div>

          {/* Customization Badge */}
          {product.isCustomizable && (
            <div className="flex items-center gap-1.5 text-xs text-brand-pink font-bold">
              <PenTool size={12} />
              <span>Personalizável</span>
            </div>
          )}

          {/* Bonus Badge (Info) */}
          {product.includesFreePage && (
            <div className="flex items-center gap-1.5 text-xs text-brand-yellow font-bold">
              <Gift size={12} />
              <span>+ Bônus CreativeFlix</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-gray uppercase font-bold flex items-center gap-1">
              {icon} {label}
            </span>
            <span className="font-bold text-xl text-white">¥{price.toLocaleString()}</span>
          </div>
          <button className="bg-slate-800 hover:bg-brand-blue text-brand-gray hover:text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-blue/20">
            <ShoppingBag size={14} /> Comprar
          </button>
        </div>
      </div>
    </Link>
  );
};
