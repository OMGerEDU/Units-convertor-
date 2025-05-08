import React, { useState, useEffect } from 'react';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2, Copy, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { he as heLocale, enUS } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

const HISTORY_UPDATE_EVENT = 'conversionHistoryUpdate';

export default function ConversionHistory() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [history, setHistory] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const text = {
    history: { en: "Conversion History", he: "היסטוריית המרות" },
    noHistory: { en: "No conversion history yet", he: "אין היסטוריית המרות עדיין" },
    clearHistory: { en: "Clear History", he: "נקה היסטוריה" },
    timeAgo: { en: "ago", he: "לפני" },
    copied: { en: "Copied!", he: "הועתק!" },
    copy: { en: "Copy", he: "העתק" }
  };

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('conversion-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse conversion history:', error);
        setHistory([]);
      }
    } else {
      setHistory([]);
    }
  };

  useEffect(() => {
    // Load initial history
    loadHistory();

    // Listen for history updates
    const handleHistoryUpdate = () => {
      loadHistory();
    };

    window.addEventListener(HISTORY_UPDATE_EVENT, handleHistoryUpdate);

    return () => {
      window.removeEventListener(HISTORY_UPDATE_EVENT, handleHistoryUpdate);
    };
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversion-history');
    // Notify other components about the change
    window.dispatchEvent(new CustomEvent(HISTORY_UPDATE_EVENT));
  };

  const getTimeAgo = (timestamp) => {
    try {
      const dateObj = new Date(timestamp);
      return formatDistanceToNow(dateObj, { 
        addSuffix: true,
        locale: language === 'he' ? heLocale : enUS
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.calculation).then(() => {
      setCopiedId(item.id);
      toast({
        title: useTranslation('copied', text.copied),
        description: item.calculation,
      });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (history.length === 0) {
    return (
      <Card className="mt-8 shadow-md overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-900/20">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-500" />
            <span>{useTranslation('history', text.history)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-4 text-center text-gray-500">
          {useTranslation('no-history', text.noHistory)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-md overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-500" />
            <span>{useTranslation('history', text.history)}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearHistory}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {useTranslation('clear-history', text.clearHistory)}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/10 transition-colors relative group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-lg">
                  {item.calculation}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(item)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedId === item.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {useTranslation('copy', text.copy)}
                  </span>
                </Button>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  {useTranslation(item.category, { en: item.category, he: item.category })}
                </div>
                <div>
                  {getTimeAgo(item.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}