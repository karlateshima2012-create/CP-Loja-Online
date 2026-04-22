
import React, { useEffect, useState } from 'react';
import { mockService } from '@/src/services/mockData';
import { Product } from '@/src/types';
import { ProductCard } from '../../catalog/pages/components/ProductCard';
import { Check, Star, Crown, Zap, ArrowRight, Smartphone, Layout, ShoppingBag, MousePointerClick, ArrowDown } from 'lucide-react';
import { T } from '@/src/contexts/TextContext'; // CMS

export const PlansPage: React.FC = () => {
    const [plans, setPlans] = useState<Product[]>([]);

    useEffect(() => {
        // Filter products that are categorized as 'Serviços Digitais' or involve 'Upgrade'
        const allProducts = mockService.getProducts();
        const serviceProducts = allProducts.filter(p =>
            p.category === 'Serviços Digitais' ||
            p.name.includes('Plano') ||
            p.name.includes('Upgrade')
        );
        setPlans(serviceProducts);
    }, []);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold uppercase tracking-wider mb-4">
                        <Crown size={14} />
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                        </span>
                        <T k="plans_hero_tag" default="Ecossistema Digital" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        <T k="plans_hero_title" default="Todos os planos e sistemas da CP" />
                    </h1>
                    <p className="text-brand-gray max-w-2xl mx-auto text-lg">
                        <T k="plans_hero_desc" default="Soluções completas para sua presença física e digital." />
                    </p>
                </div>
            </div>

            {/* --- EVOLUTION SCHEME (UPGRADE EXPLANATION) --- (Omitted or Keep if relevant, but user said "exclua o titulo escolha seu upgrade todos os planos e sistemas da CP") */}
            {/* User said: exclua o titulo: "escolha seu upgrade" todos os planos e sistemas da CP. */}

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map(plan => (
                        <ProductCard key={plan.id} product={plan} partnerSlug={null} partnersList={[]} />
                    ))}
                </div>
            </div>
        </div>
    );
};
