import React, { useContext, useState } from 'react';
import { Moon, Sun, Globe, Sparkles } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { KawaiiTooltip, KawaiiToggle } from './KawaiiComponents';

const HeaderControls: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { currentLanguage, toggleLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();
  const [sparkle, setSparkle] = useState(false);

  const triggerSparkle = () => {
    setSparkle(true);
    setTimeout(() => setSparkle(false), 500);
  };

  return (
    <div className="flex items-center space-x-4">
      <KawaiiTooltip tooltip={t('language')}>
        <button
          onClick={() => {
            toggleLanguage();
            triggerSparkle();
          }}
          className="kawaii-icon-btn relative flex items-center"
          aria-label={t('language')}
        >
          <Globe className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <span className="ml-1 text-sm font-medium font-kawaii text-primary-700 dark:text-primary-300">
            {currentLanguage.toUpperCase()}
          </span>
          {sparkle && (
            <span className="absolute -top-1 -right-1 text-kawaii-yellow animate-pop">✦</span>
          )}
        </button>
      </KawaiiTooltip>

      <KawaiiTooltip tooltip={isDarkMode ? t('lightMode') : t('darkMode')}>
        <button
          onClick={toggleDarkMode}
          className="kawaii-icon-btn group"
          aria-label={isDarkMode ? t('lightMode') : t('darkMode')}
        >
          <div className="relative">
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-kawaii-yellow group-hover:animate-wiggle" />
            ) : (
              <Moon className="h-5 w-5 text-primary-600 group-hover:animate-wiggle" />
            )}
            <span className="absolute -top-1 -right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </div>
        </button>
      </KawaiiTooltip>

      <div className="ml-2 opacity-0 hover:opacity-100 transition-opacity">
        <Sparkles className="h-4 w-4 text-kawaii-pink animate-pulse-subtle" />
      </div>
    </div>
  );
};

export default HeaderControls;