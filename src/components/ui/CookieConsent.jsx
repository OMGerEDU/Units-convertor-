import React, { useState, useEffect } from 'react';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  const text = {
    title: { en: "Cookie Notice", he: "הודעת עוגיות" },
    description: { 
      en: "We use cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.", 
      he: "אנו משתמשים בעוגיות כדי לשפר את החוויה שלך. המשך שימוש באתר מהווה הסכמה לשימוש בעוגיות."
    },
    accept: { en: "Accept", he: "קבל" },
    settings: { en: "Cookie Settings", he: "הגדרות עוגיות" }
  };

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookie-consent-accepted');
    if (!hasAccepted) {
      // Show the cookie consent banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent-accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 p-4 ${language === 'he' ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">
            {useTranslation('cookie-title', text.title)}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {useTranslation('cookie-description', text.description)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(false)}
            aria-label="Close"
            className="w-8 h-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/cookie-policy', '_blank')}
          >
            {useTranslation('cookie-settings', text.settings)}
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
          >
            {useTranslation('accept', text.accept)}
          </Button>
        </div>
      </div>
    </div>
  );
}