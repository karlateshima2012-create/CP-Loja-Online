
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product, Partner } from '@/src/types';
import { ProductCard } from './ProductCard';

interface ProductSliderProps {
    title: string;
    subtitle: string;
    products: Product[];
    partnerSlug: string | null;
    partnersList: Partner[];
    accentColor: 'blue' | 'yellow' | 'pink';
    onViewAll?: () => void;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ title, subtitle, products, partnerSlug, partnersList, accentColor, onViewAll }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 320; // Aproximadamente a largura de um card + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const colorClasses = {
        blue: 'text-brand-blue hover:text-brand-blue',
        yellow: 'text-brand-yellow hover:text-brand-yellow',
        pink: 'text-brand-pink hover:text-brand-pink',
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="container mx-auto px-4 mb-16 relative group/slider animate-fade-in">
            <div className="flex justify-between items-end mb-6 px-1">
                <div>
                    <div className={`font-bold uppercase tracking-wider text-xs mb-1 ${colorClasses[accentColor].split(' ')[0]}`}>{subtitle}</div>
                    <h2 className="text-3xl font-black text-white">{title}</h2>
                </div>
                {onViewAll && (
                    <button onClick={onViewAll} className={`text-brand-gray text-sm font-bold flex items-center gap-1 transition-colors ${colorClasses[accentColor]}`}>
                        Ver todos <ArrowRight size={14}/>
                    </button>
                )}
            </div>

            <div className="relative">
                {/* Left Arrow */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-slate-900/80 hover:bg-brand-blue text-white p-3 rounded-full shadow-xl border border-slate-700 backdrop-blur opacity-0 group-hover/slider:opacity-100 transition-all duration-300 disabled:opacity-0 hidden md:block"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Slider Container */}
                <div 
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-1 -mx-1 snap-x snap-mandatory"
                >
                    {products.map((product, index) => (
                        <div key={`${product.id}-${index}`} className="min-w-[280px] w-[280px] md:min-w-[300px] md:w-[300px] snap-start">
                            <ProductCard product={product} partnerSlug={partnerSlug} partnersList={partnersList} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-slate-900/80 hover:bg-brand-blue text-white p-3 rounded-full shadow-xl border border-slate-700 backdrop-blur opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hidden md:block"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};
