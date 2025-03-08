import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export type SortOption = 'title' | 'likes' | 'date';

interface SortControlProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortControl: React.FC<SortControlProps> = ({ currentSort, onSortChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="h-5 w-5 text-gray-500" />
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="date">{t('sortByDate')}</option>
        <option value="title">{t('sortByTitle')}</option>
        <option value="likes">{t('sortByLikes')}</option>
      </select>
    </div>
  );
};

export default SortControl;