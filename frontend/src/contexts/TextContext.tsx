
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteTexts, Language } from '@/src/types';
import { mockService } from '@/src/services/mockData';
import { TRANSLATIONS } from '../services/translations';

// Cache keys
const CACHE_KEY_TEXTS = 'cp_site_texts';
const CACHE_KEY_LANG = 'cp_language';

interface TextContextType {
  texts: SiteTexts;
  updateText: (key: string, value: string) => void;
  isLoading: boolean;
  t: (key: string, defaultText?: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const TextContext = createContext<TextContextType>({} as TextContextType);

// Helper hook to consume texts easily
export const useText = () => useContext(TextContext);

export const TextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [texts, setTexts] = useState<SiteTexts>({});
  const [language, setLanguage] = useState<Language>('pt');
  const [isLoading, setIsLoading] = useState(true);

  // Load initial settings
  useEffect(() => {
    // 0. Language
    const cachedLang = localStorage.getItem(CACHE_KEY_LANG) as Language;
    if (cachedLang && ['pt', 'en', 'jp'].includes(cachedLang)) {
        setLanguage(cachedLang);
    }

    // 1. Dynamic Texts (CMS)
    const cachedData = localStorage.getItem(CACHE_KEY_TEXTS);
    if (cachedData) {
        try {
            setTexts(JSON.parse(cachedData));
            setIsLoading(false);
        } catch (e) {
            console.error("Cache corrupted", e);
        }
    }

    // Fetch fresh CMS data (Background)
    mockService.getSiteTexts().then((serverTexts) => {
        const currentString = JSON.stringify(texts);
        const serverString = JSON.stringify(serverTexts);
        if (currentString !== serverString) {
            setTexts(serverTexts);
            localStorage.setItem(CACHE_KEY_TEXTS, serverString);
        }
        setIsLoading(false);
    });
  }, []);

  const handleSetLanguage = (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem(CACHE_KEY_LANG, lang);
  }

  const updateText = (key: string, value: string) => {
      const newTexts = { ...texts, [key]: value };
      setTexts(newTexts);
      mockService.updateSiteTexts(newTexts);
      localStorage.setItem(CACHE_KEY_TEXTS, JSON.stringify(newTexts));
  };

  // Simplified Translation Function (CMS + Static + Default)
  const t = (key: string, defaultText?: string): string => {
      // 1. CMS Dynamic Text (Overrides everything if present)
      if (texts[key]) {
          return texts[key];
      }
      
      // 2. Static Translations
      const langTrans = TRANSLATIONS[language];
      if (langTrans && langTrans[key]) {
          return langTrans[key];
      }

      // 3. Fallback to Portuguese (if not PT)
      if (language !== 'pt' && TRANSLATIONS['pt'] && TRANSLATIONS['pt'][key]) {
          return TRANSLATIONS['pt'][key];
      }

      // 4. Default (Hardcoded in Component)
      return defaultText || key;
  };

  return (
    <TextContext.Provider value={{ texts, updateText, isLoading, t, language, setLanguage: handleSetLanguage }}>
      {children}
    </TextContext.Provider>
  );
};

// Helper Component for easier rendering
export const T: React.FC<{ k: string; default?: string }> = ({ k, default: def }) => {
    const { t } = useText();
    return <>{t(k, def)}</>;
};