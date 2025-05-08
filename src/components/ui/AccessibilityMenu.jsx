import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { Accessibility, Eye, Type, Link2, MousePointer, Moon, Zap, SunMoon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

export default function AccessibilityMenu() {
  const { settings, updateSetting } = useAccessibility();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const text = {
    title: { en: "Accessibility Options", he: "אפשרויות נגישות" },
    focusOutlines: { en: "Show Focus Outlines", he: "הצג מתארי פוקוס" },
    textSize: { en: "Text Size", he: "גודל טקסט" },
    highlightLinks: { en: "Highlight Links", he: "הדגש קישורים" },
    largeCursor: { en: "Large Cursor", he: "סמן גדול" },
    darkMode: { en: "Dark Mode", he: "מצב כהה" },
    reducedMotion: { en: "Reduce Animations", he: "הפחתת אנימציות" },
    highContrast: { en: "High Contrast", he: "ניגודיות גבוהה" },
    reset: { en: "Reset All", he: "איפוס הכל" }
  };

  const handleResetSettings = () => {
    updateSetting('showFocusOutlines', false);
    updateSetting('textSize', 1);
    updateSetting('highlightLinks', false);
    updateSetting('largeCursor', false);
    updateSetting('reducedMotion', false);
    updateSetting('highContrast', false);
    // Don't reset dark mode as it might be based on system preference
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full h-12 w-12 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
            aria-label={useTranslation('accessibility', text.title)}
          >
            <Accessibility className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </Button>
        </SheetTrigger>
        <SheetContent side={language === 'he' ? 'right' : 'left'} className="w-80">
          <SheetHeader>
            <SheetTitle className="text-center mb-6">
              {useTranslation('accessibility-title', text.title)}
            </SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Eye className="w-5 h-5 text-indigo-500" />
                <Label htmlFor="focus-outlines">{useTranslation('focus-outlines', text.focusOutlines)}</Label>
              </div>
              <Switch 
                id="focus-outlines" 
                checked={settings.showFocusOutlines}
                onCheckedChange={(checked) => updateSetting('showFocusOutlines', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Type className="w-5 h-5 text-indigo-500" />
                <Label>{useTranslation('text-size', text.textSize)}</Label>
              </div>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <span className="text-sm">A</span>
                <Slider 
                  id="text-size"
                  min={0.8}
                  max={1.5}
                  step={0.1}
                  value={[settings.textSize]}
                  onValueChange={(value) => updateSetting('textSize', value[0])}
                  className="flex-1"
                />
                <span className="text-lg font-bold">A</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link2 className="w-5 h-5 text-indigo-500" />
                <Label htmlFor="highlight-links">{useTranslation('highlight-links', text.highlightLinks)}</Label>
              </div>
              <Switch 
                id="highlight-links" 
                checked={settings.highlightLinks}
                onCheckedChange={(checked) => updateSetting('highlightLinks', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <MousePointer className="w-5 h-5 text-indigo-500" />
                <Label htmlFor="large-cursor">{useTranslation('large-cursor', text.largeCursor)}</Label>
              </div>
              <Switch 
                id="large-cursor" 
                checked={settings.largeCursor}
                onCheckedChange={(checked) => updateSetting('largeCursor', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Moon className="w-5 h-5 text-indigo-500" />
                <Label htmlFor="dark-mode">{useTranslation('dark-mode', text.darkMode)}</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Zap className="w-5 h-5 text-indigo-500" />
                <Label htmlFor="reduced-motion">{useTranslation('reduced-motion', text.reducedMotion)}</Label>
              </div>
              <Switch 
                id="reduced-motion" 
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <SunMoon className="w-5 h-5 text-indigo-500" />
                <Label htmlFor="high-contrast">{useTranslation('high-contrast', text.highContrast)}</Label>
              </div>
              <Switch 
                id="high-contrast" 
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={handleResetSettings}
            >
              {useTranslation('reset-accessibility', text.reset)}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}