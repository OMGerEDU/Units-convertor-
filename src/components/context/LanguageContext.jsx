import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [dir, setDir] = useState('ltr');

  useEffect(() => {
    // Check if a language preference exists in localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Set the direction based on the language
    setDir(language === 'he' ? 'rtl' : 'ltr');
    
    // Set the dir attribute on the document element
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'he' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('preferred-language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, dir, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation(key, textMap) {
  const { language } = useLanguage();
  
  if (!textMap || typeof textMap !== 'object') {
    console.error(`Translation missing for key: ${key}`);
    return key;
  }
  
  return textMap[language] || textMap.en || key;
}