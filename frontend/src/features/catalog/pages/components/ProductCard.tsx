import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/src/types';
import { ShoppingCart, PenTool, Trophy } from 'lucide-react';

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
      className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 md:hover:border-brand-blue/50 transition-all duration-300 md:hover:shadow-[0_0_30px_rgba(36,155,203,0.15)] flex flex-col h-full animate-fade-in-up border-brand-blue/20 md:border-slate-800"
    >
      <div className="aspect-square bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-blue/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500 opacity-100 md:opacity-90 md:group-hover:opacity-100"
        />


        {/* BEST SELLER BADGE */}
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-brand-yellow text-[10px] font-bold px-3 py-1 rounded-full border border-brand-yellow shadow-lg z-20 flex items-center gap-1">
            <Trophy size={10} fill="currentColor" /> MAIS VENDIDO
          </span>
        )}
      </div>

      <div className="p-4 md:p-6 flex-1 flex flex-col">
        {/* NOME DO PRODUTO (BOLD 700) */}
        <h3 className="font-bold text-slate-200 text-base md:text-lg mb-2 leading-tight md:group-hover:text-brand-blue transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* DESCRIÇÃO/SUBTÍTULO (REGULAR 400 - CINZA) */}
        <p className="text-slate-400 text-[10px] md:text-xs font-normal mb-4 line-clamp-2">
          {product.shortDescription || product.description}
        </p>

        {/* Rodapé — Unificado para vertical em todos os dispositivos */}
        <div className="flex flex-col justify-between mt-auto pt-5 border-t border-white/5 gap-3">
          <div className="flex flex-col">
            {/* PREÇO (EXTRABOLD 800) - Espaço entre símbolo e valor */}
            <span className="font-extrabold text-lg md:text-2xl text-white tracking-tight">
              ¥ {price.toLocaleString()}
            </span>
          </div>
          {/* BOTÃO (MEDIUM 500) */}
          <button className="w-full bg-slate-800 md:hover:bg-brand-blue text-slate-300 md:hover:text-slate-950 px-4 py-3 rounded-xl text-[10px] md:text-xs font-medium uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 transform md:hover:-translate-y-1 shadow-lg md:hover:shadow-brand-blue/30 border border-brand-blue/30 md:border-brand-blue/20">
            <ShoppingCart size={14} /> Adicionar
          </button>
        </div>
      </div>
    </Link>
  );
};
