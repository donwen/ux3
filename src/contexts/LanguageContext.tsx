import React, { createContext, useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../translations';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {}
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    
    // Try to detect user's language
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) return savedLanguage;
    
    const browserLang = navigator.language.split('-')[0] as Language;
    return SUPPORTED_LANGUAGES[browserLang] ? browserLang : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const setLanguage = (lang: Language) => {
    if (SUPPORTED_LANGUAGES[lang]) {
      setCurrentLanguage(lang);
    }
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};