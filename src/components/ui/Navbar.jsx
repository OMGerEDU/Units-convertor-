import React from 'react';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Globe, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export default function Navbar({ categories }) {
  const { language, toggleLanguage } = useLanguage();
  const { settings, updateSetting } = useAccessibility();
  const [isOpen, setIsOpen] = React.useState(false);

  const text = {
    title: { en: "Unit Converter", he: "ממיר יחידות" },
    language: { en: "Language", he: "שפה" },
    switchToEn: { en: "Switch to English", he: "החלף לאנגלית" },
    switchToHe: { en: "החלף לעברית", he: "החלף לעברית" },
    darkMode: { en: "Dark Mode", he: "מצב כהה" },
    lightMode: { en: "Light Mode", he: "מצב מואר" }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'L' || e.key === 'l') {
      toggleLanguage();
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'he' ? 'right' : 'left'} className="w-64">
              <nav className="mt-8 flex flex-col gap-4">
                {categories?.map((category) => (
                  <SheetClose asChild key={category.name}>
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => window.scrollTo({
                        top: document.getElementById(category.name)?.offsetTop - 100,
                        behavior: 'smooth'
                      })}
                    >
                      {useTranslation(category.name, { en: category.en, he: category.he })}
                    </Button>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <a href="#" className="flex items-center gap-2">
            <svg 
              className="h-6 w-6 text-indigo-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" 
              />
            </svg>
            <span className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
              {useTranslation('app-title', text.title)}
            </span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={useTranslation('toggle-language', text.language)}
            onClick={toggleLanguage}
            className="ml-auto"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">{language === 'en' ? text.switchToHe.en : text.switchToEn.en}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            aria-label={settings.darkMode ? useTranslation('light-mode', text.lightMode) : useTranslation('dark-mode', text.darkMode)}
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
          >
            {settings.darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}