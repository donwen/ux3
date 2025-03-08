import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations, formatMessage, TranslationKey } from '../translations';

export function useTranslation() {
  const { currentLanguage } = useContext(LanguageContext);

  const t = (key: TranslationKey, values?: Record<string, string | number>) => {
    const message = translations[currentLanguage][key];
    return formatMessage(message, values);
  };

  return { t, currentLanguage };
}