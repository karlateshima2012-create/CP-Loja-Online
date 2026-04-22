
import React from 'react';
import { Logo } from '@/src/components/ui/Logo';
import { FlixProfile, FlixStyleConfig } from '@/src/types';

interface LinksCleanTemplateProps {
    profile: any;
    baseContent: any;
    modules: any;
}

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

export const LinksCleanTemplate: React.FC<LinksCleanTemplateProps> = ({ profile, baseContent, modules }) => {
    // Note: In production these styles would come from page.settings or similar
    const style = DEFAULT_STYLE;
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
        switch (style.buttonStyle) {
            case 'outline': return { ...base, backgroundColor: style.buttonColor, border: `1px solid ${effectColor}` };
            case 'glass': return { ...base, backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' };
            case 'hard-shadow': return { ...base, backgroundColor: style.buttonColor, border: `2px solid ${effectColor}`, boxShadow: `6px 6px 0px ${effectColor}` };
            case 'soft-shadow': return { ...base, backgroundColor: style.buttonColor, boxShadow: `0 15px 30px -5px ${effectColor}44` };
            default: return { ...base, backgroundColor: style.buttonColor };
        }
    };

    return (
        <div className={`min-h-screen w-full flex flex-col items-center pb-20 ${style.fontFamily === 'serif' ? 'font-serif' : style.fontFamily === 'mono' ? 'font-mono' : 'font-sans'}`} style={{ backgroundColor: style.backgroundColor, color: style.textColor }}>
            {/* Header / Hero */}
            <div className="w-full h-48 bg-slate-100 relative overflow-hidden">
                {profile.poster_url && <img src={profile.poster_url} className="w-full h-full object-cover blur-sm opacity-30" alt="Background" />}
            </div>

            <div className="w-full max-w-lg px-6 -mt-20 flex flex-col items-center relative z-10">
                {/* Profile Image */}
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white mb-6">
                    {profile.poster_url && <img src={profile.poster_url} className="w-full h-full object-cover" alt={profile.display_name} />}
                </div>

                <h1 className={`${currentFont.name} font-black mb-1 text-center`} style={{ textTransform: transform as any }}>
                    {baseContent.title || profile.display_name}
                </h1>

                {baseContent.bio && (
                    <p className={`${currentFont.bio} font-medium opacity-70 mb-8 text-center leading-relaxed px-4 whitespace-pre-wrap`}>
                        {baseContent.bio}
                    </p>
                )}

                {/* Links Slot */}
                <div className="w-full space-y-3">
                    {baseContent.links?.map((l: any, idx: number) => (
                        <a
                            key={idx}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`${shapeClass} w-full py-4 px-6 text-center font-bold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center shadow-md bg-white`}
                            style={getBtnStyle()}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-20 flex flex-col items-center gap-2 opacity-30">
                    <Logo className="h-5" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Powered by Creative Print</span>
                </div>
            </div>
        </div>
    );
};
