import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState({
    showFocusOutlines: false,
    textSize: 1, // 1 is the default size multiplier
    highlightLinks: false,
    largeCursor: false,
    darkMode: false,
    reducedMotion: false,
    highContrast: false
  });

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      updateSetting('darkMode', true);
    }

    // Check system preference for reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateSetting('reducedMotion', true);
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // Apply settings to the document
    document.documentElement.classList.toggle('focus-visible', settings.showFocusOutlines);
    document.documentElement.classList.toggle('highlight-links', settings.highlightLinks);
    document.documentElement.classList.toggle('large-cursor', settings.largeCursor);
    document.documentElement.classList.toggle('dark', settings.darkMode);
    document.documentElement.classList.toggle('reduce-motion', settings.reducedMotion);
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    
    // Apply text size
    document.documentElement.style.fontSize = `${100 * settings.textSize}%`;
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}