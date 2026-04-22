import React from 'react';
import { FlixProfile, FlixStyleConfig } from '@/src/types';
import { UtensilsCrossed, Clock, MapPin, Instagram, Facebook, MessageCircle, ArrowRight, Star, Heart } from 'lucide-react';

interface InteractiveMenuTemplateProps {
    profile: FlixProfile;
    baseContent: any;
    modules: any;
}

export const InteractiveMenuTemplate: React.FC<InteractiveMenuTemplateProps> = ({ profile, baseContent, modules }) => {
    const style: FlixStyleConfig = profile.style || {};
    const primaryColor = style.buttonColor || '#ef4444'; // Standard food red
    const backgroundColor = style.backgroundColor || '#ffffff';

    // Mock foods if menu module is empty
    const menuItems = modules.menu?.items || [
        { id: 1, name: 'Combo Especial House', price: 2900, description: 'Hambúrguer de 180g, queijo cheddar, bacon caramelizado e fritas.', category: 'Principais', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
        { id: 2, name: 'Double Cheese Bacon', price: 2400, description: 'Duas carnes de 120g, muito queijo e bacon crocante.', category: 'Principais', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5' },
        { id: 3, name: 'Fritas Rústicas G', price: 950, description: 'Porção generosa de fritas com tempero especial da casa.', category: 'Acompanhamentos', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877' },
        { id: 4, name: 'Suco de Laranja 500ml', price: 600, description: 'Puro e natural, espremido na hora.', category: 'Bebidas', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423' },
    ];

    const categories = [...new Set(menuItems.map((i: any) => i.category))];

    const handleWAOrder = (item: any) => {
        const text = encodeURIComponent(`Olá ${profile.displayName}! Gostaria de pedir: ${item.name} (${item.category})`);
        window.open(`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen w-full flex flex-col font-sans mb-32" style={{ backgroundColor }}>
            {/* Header / Hero */}
            <div className="relative h-[25vh] overflow-hidden">
                <img src={profile.coverImageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            {/* Brand Card */}
            <div className="px-6 -mt-16 relative z-10 flex flex-col items-center">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                    <img src={profile.profileImageUrl} className="w-full h-full object-cover rounded-[2rem]" />
                </div>
                <div className="text-center mt-6">
                    <h1 className="text-3xl font-black text-slate-800 mb-1">{profile.displayName}</h1>
                    <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1"><Clock size={12} className="text-green-500" /> Aberto Agora</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center gap-1"><Star size={12} className="text-brand-yellow" /> 4.8 (150+)</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 px-6 mt-10 max-w-lg mx-auto w-full">
                <button className="bg-slate-50 border border-slate-100 p-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-slate-100 transition-colors">
                    <MapPin size={24} className="text-brand-blue" />
                    <span className="text-[10px] font-black uppercase text-slate-500">Localização</span>
                </button>
                <a href={profile.instagram} target="_blank" className="bg-slate-50 border border-slate-100 p-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-slate-100 transition-colors">
                    <Instagram size={24} className="text-brand-pink" />
                    <span className="text-[10px] font-black uppercase text-slate-500">Instagram</span>
                </a>
            </div>

            {/* Menu Items by Category */}
            <div className="mt-12 px-6 space-y-12">
                {categories.map(cat => (
                    <div key={cat as any} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">{cat as any}</h2>
                            <div className="flex-1 h-[2px] bg-slate-100"></div>
                        </div>
                        <div className="space-y-4">
                            {menuItems.filter((i: any) => i.category === cat).map((item: any) => (
                                <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-all relative group">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-bold text-slate-800 mb-1">{item.name}</h3>
                                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="font-black text-slate-900">¥{item.price.toLocaleString()}</span>
                                            <button
                                                onClick={() => handleWAOrder(item)}
                                                className="bg-slate-100 p-2 rounded-xl text-slate-600 hover:bg-primary hover:text-white transition-all"
                                                style={{ active: { backgroundColor: primaryColor } } as any}
                                            >
                                                <MessageCircle size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Order Note */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
                <a
                    href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`}
                    className="w-full bg-slate-900 text-white h-16 rounded-[2rem] flex items-center justify-center gap-4 text-lg font-black shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    style={{ backgroundColor: primaryColor }}
                >
                    <UtensilsCrossed size={24} />
                    FAZER MEU PEDIDO
                    <ArrowRight size={24} />
                </a>
            </div>

            {/* Brand Footer */}
            <footer className="mt-20 py-10 opacity-20 text-center flex flex-col items-center gap-2">
                <div className="flex items-center gap-4 mb-4">
                    <Instagram size={20} />
                    <Facebook size={20} />
                </div>
                <div className="font-black text-sm uppercase tracking-[0.3em] font-serif">{profile.displayName}</div>
                <div className="text-[10px] font-bold">DIGITAL MENU BY CREATIVE PRINT</div>
            </footer>
        </div>
    );
};
