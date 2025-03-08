import React, { useContext } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const HeaderControls: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { currentLanguage, toggleLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleLanguage}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('language')}
      >
        <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <span className="ml-1 text-sm font-medium">
          {currentLanguage.toUpperCase()}
        </span>
      </button>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t('darkMode')}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </div>
  );
};

export default HeaderControls;