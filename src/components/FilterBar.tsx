import React from 'react';
import type { ActiveTab } from '../types/radio';

interface FilterOption {
  id: string;
  label: string;
}

const GREECE_FILTERS: FilterOption[] = [
  { id: 'all', label: 'הכל' },
  { id: 'laika', label: 'לאיקה ורבטיקו' },
  { id: 'hits', label: 'להיטים מיוון' },
  { id: 'classics', label: 'קלאסיקות יווניות' }
];

const ISRAEL_FILTERS: FilterOption[] = [
  { id: 'all', label: 'הכל' },
  { id: 'news', label: 'חדשות ואקטואליה' },
  { id: 'mediterranean', label: 'ים-תיכוני ויווני' },
  { id: 'israeli_music', label: 'מוזיקה ישראלית' }
];

interface FilterBarProps {
  activeTab: ActiveTab;
  currentFilter: string;
  onFilterChange: (filterId: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  currentFilter,
  onFilterChange
}) => {
  if (activeTab === 'favorites') {
    return null;
  }

  const filters = activeTab === 'greece' ? GREECE_FILTERS : ISRAEL_FILTERS;

  return (
    <div className="w-full px-3 pt-2 pb-1 bg-[#131210] border-b border-[#2b2722] box-border">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 w-full box-border">
        {filters.map(item => {
          const isSelected = currentFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`font-extrabold text-base sm:text-lg px-4 py-2 rounded-lg border whitespace-nowrap transition-all select-none active:scale-95 ${
                isSelected
                  ? 'bg-amber-400 text-black border-amber-300 shadow-md font-black'
                  : 'bg-[#24211d] text-amber-100 hover:text-white border-[#453e34] hover:border-amber-400/50'
              }`}
              aria-pressed={isSelected}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
