import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/src/types';
import { ShoppingBag, PenTool, Trophy } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getPriceDisplay = () => {
    if (product.priceTiers && product.priceTiers.length > 0) {
      const minPrice = Math.min(...product.priceTiers.map(t => t.totalPrice));
      return { price: minPrice };
    }
    if (product.plans && product.plans.length > 0) {
      const minPrice = Math.min(...product.plans.map(t => t.totalPrice));
      return { price: minPrice };
    }
    return { price: product.price };
  };

  const { price } = getPriceDisplay();

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-brand-blue/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(36,155,203,0.15)] flex flex-col h-full animate-fade-in-up"
    >
      <div className="aspect-square bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* PERSONALIZÁVEL TAG */}
        {product.isCustomizable && (
          <div className="absolute top-3 right-3 z-20 backdrop-blur-md bg-white/10 border border-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl">
            <PenTool size={10} className="text-brand-pink" />
            <span className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-tighter">Personalizável</span>
          </div>
        )}

        {/* BEST SELLER BADGE */}
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-brand-yellow text-[10px] font-bold px-3 py-1 rounded-full border border-brand-yellow shadow-lg z-20 flex items-center gap-1">
            <Trophy size={10} fill="currentColor" /> MAIS VENDIDO
          </span>
        )}
      </div>

      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <div className="text-[10px] md:text-xs text-brand-blue/60 font-bold uppercase tracking-wider mb-1">{product.category}</div>
        <h3 className="font-bold text-white text-base md:text-lg mb-3 leading-tight group-hover:text-brand-blue transition-colors line-clamp-2">{product.name}</h3>

        {/* Rodapé do Card — Responsivo (Empilhado no Mobile) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-4 border-t border-white/5 gap-3 md:gap-4">
          <div className="flex flex-col">
            <span className="font-black text-lg md:text-xl text-white tracking-tight">
              ¥{price.toLocaleString()}
            </span>
          </div>
          <button className="w-full md:w-auto bg-slate-800 hover:bg-brand-blue text-slate-300 hover:text-slate-950 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1 shadow-lg hover:shadow-brand-blue/30 border border-brand-blue/20 md:border-transparent">
            <ShoppingBag size={14} /> Comprar
          </button>
        </div>
      </div>
    </Link>
  );
};
