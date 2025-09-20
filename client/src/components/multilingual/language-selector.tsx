import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ✅ Add this line - Pre-load all locale files
const localeModules = import.meta.glob('../locales/*.json', { 
  eager: true, 
  import: 'default' 
});

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
  className?: string;
}

export function LanguageSelector({ onLanguageChange, className = '' }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === currentLanguage) return;

    setIsTranslating(true);
    setCurrentLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);

    try {
      await translatePage(newLanguage);
      
      toast({
        title: 'Language Changed',
        description: `Page translated to ${supportedLanguages.find(lang => lang.code === newLanguage)?.name}`,
      });

      onLanguageChange?.(newLanguage);
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate the page. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const translatePage = async (targetLanguage: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Translating page to ${targetLanguage}`);
        resolve(true);
      }, 1000);
    });
  };

  const currentLanguageInfo = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange} disabled={isTranslating}>
        <SelectTrigger className="w-32">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span>{currentLanguageInfo?.flag}</span>
              <span className="hidden sm:inline">{currentLanguageInfo?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
                {language.code === currentLanguage && (
                  <Check className="w-4 h-4 ml-auto text-primary" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isTranslating && (
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}

// Hook for using translations
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
    loadTranslations(savedLanguage);
  }, []);

  // ✅ Updated loadTranslations function
  const loadTranslations = async (language: string) => {
    try {
      const modulePath = `../locales/${language}.json`;
      const translationData = localeModules[modulePath];
      
      if (translationData) {
        setTranslations(translationData as Record<string, string>);
      } else {
        throw new Error(`Translation file not found: ${language}.json`);
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
      if (language !== 'en') {
        const englishPath = '../locales/en.json';
        const englishTranslations = localeModules[englishPath];
        if (englishTranslations) {
          setTranslations(englishTranslations as Record<string, string>);
        }
      }
    }
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  return { t, currentLanguage, setCurrentLanguage };
}

// Translation component for easy text replacement
interface TransProps {
  i18nKey: string;
  fallback?: string;
  className?: string;
}

export function Trans({ i18nKey, fallback, className }: TransProps) {
  const { t } = useTranslation();
  return <span className={className}>{t(i18nKey, fallback)}</span>;
}
