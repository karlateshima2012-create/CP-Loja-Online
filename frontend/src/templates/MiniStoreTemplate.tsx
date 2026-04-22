import React, { useState } from 'react';
import { FlixProfile, FlixStyleConfig } from '@/src/types';
import { ShoppingBag, MessageCircle, Heart, Star, ChevronRight, Apple as Fruit, Coffee, Pizza, LayoutGrid, LayoutList } from 'lucide-react';

interface MiniStoreTemplateProps {
    profile: FlixProfile;
    baseContent: any;
    modules: any;
}

export const MiniStoreTemplate: React.FC<MiniStoreTemplateProps> = ({ profile, baseContent, modules }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const style: FlixStyleConfig = profile.style || {};
    const primaryColor = style.buttonColor || '#e5157a'; // Default to pink for store
    const backgroundColor = style.backgroundColor || '#f8fafc';

    // Mock items if catalog module is empty
    const catalogItems = modules.catalog?.items || [
        { id: 1, name: 'Produto Exemplo 1', price: 1500, category: 'Novidades', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' },
        { id: 2, name: 'Produto Exemplo 2', price: 2800, category: 'Destaques', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
        { id: 3, name: 'Produto Exemplo 3', price: 950, category: 'Promoção', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
        { id: 4, name: 'Produto Exemplo 4', price: 4200, category: 'Novidades', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90' },
    ];

    const categories = ['Todos', ...new Set(catalogItems.map((i: any) => i.category))];
    const filteredItems = catalogItems.filter((i: any) => selectedCategory === 'Todos' || i.category === selectedCategory);

    const handleWhatsAppOrder = (item: any) => {
        const text = encodeURIComponent(`Olá ${profile.displayName}! Gostaria de encomendar o item: ${item.name} (¥${item.price.toLocaleString()})`);
        window.open(`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen w-full flex flex-col font-sans mb-20" style={{ backgroundColor }}>
            {/* Header / Brand */}
            <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl mb-6 border-4 border-white">
                    <img src={profile.profileImageUrl} className="w-full h-full object-cover" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">{profile.displayName}</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] bg-slate-100 px-3 py-1 rounded-full">{profile.category} • WhatsApp Shopping</p>

                <div className="flex gap-4 mt-8 w-full max-w-md">
                    <div className="flex-1 bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                        <div className="text-xl font-black text-slate-900">100%</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Seguro</div>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                        <div className="text-xl font-black text-slate-900">Japan</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Pronta Entrega</div>
                    </div>
                </div>
            </div>

            {/* Filter / View Switch */}
            <div className="px-6 py-8 flex items-center justify-between">
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as any)}
                            className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="hidden sm:flex bg-white p-1 rounded-xl border border-slate-200">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-slate-100' : 'text-slate-300'}`}><LayoutGrid size={18} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-slate-100' : 'text-slate-300'}`}><LayoutList size={18} /></button>
                </div>
            </div>

            {/* Items Grid */}
            <div className={`px-6 grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {filteredItems.map((item: any) => (
                    <div key={item.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group flex ${viewMode === 'list' ? 'flex-row h-40' : 'flex-col'}`}>
                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-40 h-full' : 'w-full aspect-square'}`}>
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-3 right-3">
                                <button className="bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm"><Heart size={16} /></button>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1 justify-between">
                            <div>
                                <div className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.category}</div>
                                <h3 className="text-sm font-black text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                <div className="flex items-center gap-1 text-[10px] text-brand-yellow font-bold mt-1">
                                    <Star size={10} fill="currentColor" /> 4.9 <span className="text-slate-300 font-medium">(24)</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-lg font-black text-slate-900">¥{item.price.toLocaleString()}</div>
                                <button
                                    onClick={() => handleWhatsAppOrder(item)}
                                    className="bg-slate-900 text-white p-3 rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-slate-900/10"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <MessageCircle size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center opacity-30">
                    <ShoppingBag size={64} className="mb-4" />
                    <p className="font-bold">Nenhum item encontrado nesta categoria.</p>
                </div>
            )}

            {/* Info Message */}
            <div className="mx-6 mt-12 mb-20 bg-brand-blue/5 border-2 border-dashed border-brand-blue/20 rounded-[2.5rem] p-8 text-center">
                <h4 className="text-brand-blue font-black uppercase tracking-wider mb-2">Pedidos pelo WhatsApp</h4>
                <p className="text-sm text-slate-500 font-medium">Nosso catálogo digital facilita sua escolha. Selecione o produto e nos envie uma mensagem para combinar entrega e pagamento.</p>
            </div>

            {/* Footer */}
            <footer className="mt-auto py-12 flex flex-col items-center gap-4 opacity-30">
                <div className="font-black text-sm tracking-widest">{profile.displayName}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em]">Creative Print Shop</div>
            </footer>
        </div>
    );
};
