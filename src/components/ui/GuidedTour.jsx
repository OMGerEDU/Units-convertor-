import React, { useState, useEffect } from 'react';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function GuidedTour() {
  const { language } = useLanguage();
  const [showTour, setShowTour] = useState(false);
  const [step, setStep] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  const text = {
    title: { en: "Welcome to Unit Converter", he: "ברוכים הבאים לממיר היחידות" },
    startTour: { en: "Start Tour", he: "התחל סיור" },
    skipTour: { en: "Skip", he: "דלג" },
    next: { en: "Next", he: "הבא" },
    previous: { en: "Previous", he: "הקודם" },
    finish: { en: "Finish", he: "סיים" },
    steps: [
      {
        title: { en: "Unit Categories", he: "קטגוריות יחידות" },
        content: { 
          en: "Choose from multiple unit categories like length, mass, volume, and more.",
          he: "בחר מתוך מגוון קטגוריות יחידות כמו אורך, מסה, נפח ועוד."
        }
      },
      {
        title: { en: "Convert Units", he: "המרת יחידות" },
        content: { 
          en: "Enter a value, select your 'from' and 'to' units, and hit convert to see results instantly.",
          he: "הזן ערך, בחר את יחידות ה'מ' וה'ל', ולחץ על המר כדי לראות תוצאות מיידיות."
        }
      },
      {
        title: { en: "Conversion History", he: "היסטוריית המרות" },
        content: { 
          en: "View your recent conversions in the history section. You can clear this anytime.",
          he: "צפה בהמרות האחרונות שלך בחלק ההיסטוריה. תוכל למחוק אותם בכל עת."
        }
      },
      {
        title: { en: "Custom Units", he: "יחידות מותאמות אישית" },
        content: { 
          en: "Add your own custom units with conversion factors to extend the functionality.",
          he: "הוסף יחידות מותאמות אישית עם גורמי המרה כדי להרחיב את הפונקציונליות."
        }
      },
      {
        title: { en: "Accessibility Options", he: "אפשרויות נגישות" },
        content: { 
          en: "Click the accessibility icon in the bottom left to customize your experience.",
          he: "לחץ על סמל הנגישות בפינה השמאלית התחתונה כדי להתאים את החוויה שלך."
        }
      },
      {
        title: { en: "Keyboard Shortcuts", he: "קיצורי מקלדת" },
        content: { 
          en: "Press 'L' to switch language, 'A' to open accessibility menu, and '?' for help.",
          he: "לחץ על 'L' כדי להחליף שפה, 'A' כדי לפתוח את תפריט הנגישות, ו-'?' לעזרה."
        }
      }
    ]
  };

  useEffect(() => {
    // Check if it's the first visit
    const hasVisited = localStorage.getItem('has-visited-before');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('has-visited-before', 'true');
    }
  }, []);

  useEffect(() => {
    // If it's the first visit, show the tour prompt after a delay
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  const handleStartTour = () => {
    setStep(0);
    setShowTour(true);
  };

  const handleNext = () => {
    if (step < text.steps.length - 1) {
      setStep(step + 1);
    } else {
      setShowTour(false);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === '?' || e.key === '/') {
      e.preventDefault();
      handleStartTour();
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tour prompt for first-time visitors
  if (isFirstVisit && !showTour) {
    return (
      <div className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-white hover:bg-indigo-700 rounded-full"
          onClick={() => setIsFirstVisit(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-5 w-5" />
          <h3 className="font-semibold">{useTranslation('welcome', text.title)}</h3>
        </div>
        <p className="text-sm mb-3">
          {useTranslation('welcome-content', { 
            en: "Would you like a quick tour of the app's features?", 
            he: "האם תרצה סיור מהיר של תכונות האפליקציה?" 
          })}
        </p>
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFirstVisit(false)}
            className="hover:bg-indigo-700"
          >
            {useTranslation('skip-tour', text.skipTour)}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white text-indigo-600 hover:bg-gray-100"
            onClick={handleStartTour}
          >
            {useTranslation('start-tour', text.startTour)}
          </Button>
        </div>
      </div>
    );
  }

  // Help button (always visible)
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-16 z-40 rounded-full w-10 h-10 p-0 bg-white dark:bg-gray-800 shadow-md"
        onClick={handleStartTour}
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5 text-indigo-600" />
      </Button>

      <Dialog open={showTour} onOpenChange={setShowTour}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {useTranslation(`step-${step}-title`, text.steps[step]?.title)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>
              {useTranslation(`step-${step}-content`, text.steps[step]?.content)}
            </p>
            
            <div className="flex items-center justify-center mt-4">
              {text.steps.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    index === step ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <div>
              {step > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {useTranslation('previous', text.previous)}
                </Button>
              )}
            </div>
            <div>
              <Button 
                onClick={handleNext}
                className="gap-1"
              >
                {step < text.steps.length - 1 ? (
                  <>
                    {useTranslation('next', text.next)}
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {useTranslation('finish', text.finish)}
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}