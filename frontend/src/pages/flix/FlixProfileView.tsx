
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockService } from '@/src/services/mockData';
import { FlixProfile, FlixStyleConfig } from '@/src/types';
import { 
    Instagram, MapPin, Globe, Menu, Phone, MessageCircle, Youtube, Share2, 
    Mail, Facebook, DollarSign, Star, ImageIcon
} from 'lucide-react';
import { Logo } from '../../components/Logo';

const DEFAULT_STYLE: FlixStyleConfig = {
    backgroundType: 'color',
    backgroundColor: '#ffffff',
    buttonStyle: 'soft-shadow',
    buttonShape: 'rounded',
    buttonColor: '#ffffff',
    buttonTextColor: '#000000',
    effectColor: '#000000',
    textColor: '#000000',
    fontFamily: 'sans',
    fontSize: 'md',
    textTransform: 'none',
    layoutMode: 'stack'
};

export const FlixProfileView: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [profile, setProfile] = useState<FlixProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            const found = mockService.getFlixProfileBySlug(slug);
            if (found && found.active) setProfile(found);
        }
        setLoading(false);
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 font-bold uppercase animate-pulse">Carregando...</div>;
    if (!profile) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">404 - Não encontrado</div>;

    const style = profile.style || DEFAULT_STYLE;
    const effectColor = style.effectColor || '#000000';
    const fontConfig: Record<string, { name: string, bio: string, btn: string, header: string }> = {
        sm: { name: 'text-xl', bio: 'text-xs', btn: 'text-sm', header: 'text-xs' },
        md: { name: 'text-2xl', bio: 'text-sm', btn: 'text-base', header: 'text-sm' },
        lg: { name: 'text-3xl', bio: 'text-base', btn: 'text-lg', header: 'text-base' }
    };
    const currentFont = fontConfig[style.fontSize || 'md'];
    const transform = style.textTransform === 'uppercase' ? 'uppercase' : 'none';
    const shapeClass = style.buttonShape === 'pill' ? 'rounded-full' : style.buttonShape === 'square' ? 'rounded-none' : style.buttonShape === 'sharp' ? 'rounded-md' : 'rounded-2xl';

    const getBtnStyle = (): React.CSSProperties => {
        const base: React.CSSProperties = { color: style.buttonTextColor, textTransform: transform as any };
        switch(style.buttonStyle) {
            case 'outline': return { ...base, backgroundColor: style.buttonColor, border: `1px solid ${effectColor}` };
            case 'glass': return { ...base, backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' };
            case 'hard-shadow': return { ...base, backgroundColor: style.buttonColor, border: `2px solid ${effectColor}`, boxShadow: `6px 6px 0px ${effectColor}` };
            case 'soft-shadow': return { ...base, backgroundColor: style.buttonColor, boxShadow: `0 15px 30px -5px ${effectColor}44` };
            default: return { ...base, backgroundColor: style.buttonColor };
        }
    };

    return (
        <div className={`min-h-screen w-full flex flex-col items-center ${style.fontFamily === 'serif' ? 'font-serif' : style.fontFamily === 'mono' ? 'font-mono' : 'font-sans'}`} style={{ backgroundColor: style.backgroundColor, color: style.textColor }}>
            <div className="w-full h-72 md:h-96 bg-slate-200 relative overflow-hidden">{profile.coverImageUrl && <img src={profile.coverImageUrl} className="w-full h-full object-cover" alt="Banner"/>}</div>
            <div className="w-full max-w-lg px-6 pb-20 -mt-24 flex flex-col items-center relative z-10">
                <div className="w-44 h-44 rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-white mb-6">{profile.profileImageUrl && <img src={profile.profileImageUrl} className="w-full h-full object-cover" alt={profile.displayName}/>}</div>
                <h1 className={`${currentFont.name} font-black mb-2 text-center drop-shadow-sm`} style={{ textTransform: transform as any }}>{profile.displayName}</h1>
                {profile.slogan && <p className={`${currentFont.bio} font-medium opacity-80 mb-4 text-center leading-tight`} style={{ textTransform: transform as any }}>{profile.slogan}</p>}
                {profile.fullBio && <p className="text-sm opacity-70 text-center mb-8 leading-relaxed px-4 whitespace-pre-wrap">{profile.fullBio}</p>}
                <div className="w-full space-y-4">
                    {profile.links?.sort((a,b)=>a.order-b.order).map(l => (
                        l.type === 'header' 
                        ? <h3 key={l.id} className={`${currentFont.header} font-bold uppercase tracking-[0.2em] text-center mt-10 mb-4 opacity-50`} style={{ textTransform: transform as any }}>{l.label}</h3>
                        : <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className={`${shapeClass} w-full py-4 px-6 text-center font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg`} style={getBtnStyle()}>{l.label}</a>
                    ))}
                </div>
                <div className="mt-20 flex flex-col items-center gap-4 opacity-40">
                    <Logo className="h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Powered by CreativeFlix</span>
                </div>
            </div>
        </div>
    );
};
