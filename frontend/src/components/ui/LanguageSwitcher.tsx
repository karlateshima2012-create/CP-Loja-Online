
import React, { useState } from 'react';
import { useText } from '@/src/contexts/TextContext';
import { Language } from '@/src/types';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useText();
    const [isOpen, setIsOpen] = useState(false);

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'pt', label: 'Português', flag: '🇧🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'jp', label: '日本語', flag: '🇯🇵' },
    ];

    const current = languages.find(l => l.code === language) || languages[0];

    const handleSelect = (code: Language) => {
        setLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-brand-blue/50 transition-all text-xs font-bold text-slate-300 hover:text-white"
            >
                <span>{current.flag}</span>
                <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                        {languages.map(l => (
                            <button
                                key={l.code}
                                onClick={() => handleSelect(l.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors text-left ${
                                    language === l.code 
                                    ? 'bg-brand-blue/10 text-brand-blue' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <span className="text-base">{l.flag}</span>
                                {l.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
