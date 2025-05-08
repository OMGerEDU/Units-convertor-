import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useAccessibility();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: settings.reducedMotion ? 'auto' : 'smooth'
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 z-40 rounded-full w-10 h-10 p-0 bg-indigo-500 hover:bg-indigo-600 shadow-md"
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}