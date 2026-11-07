import React from 'react';
import type { ActiveTab } from '../types/radio';

interface FilterOption {
  id: string;
  label: string;
  icon?: string;
}

const GREECE_FILTERS: FilterOption[] = [
  { id: 'all', label: 'הכל', icon: '🏛️' },
  { id: 'laika', label: 'לאיקה ורבטיקו', icon: '🪕' },
  { id: 'hits', label: 'להיטים מיוון', icon: '🔥' },
  { id: 'classics', label: 'קלאסיקות יווניות', icon: '✨' }
];

const ISRAEL_FILTERS: FilterOption[] = [
  { id: 'all', label: 'הכל', icon: '📻' },
  { id: 'news', label: 'חדשות ואקטואליה', icon: '📰' },
  { id: 'mediterranean', label: 'ים-תיכוני ויווני', icon: '🎶' },
  { id: 'israeli_music', label: 'מוזיקה ישראלית', icon: '🇮🇱' }
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
    return null; // Favorites does not require sub-filters
  }

  const filters = activeTab === 'greece' ? GREECE_FILTERS : ISRAEL_FILTERS;

  return (
    <div className="px-3 py-2.5 bg-slate-900/80 border-b border-slate-800">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {filters.map(item => {
          const isSelected = currentFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`min-h-[56px] px-3 py-2 rounded-xl text-center flex items-center justify-center gap-2 font-bold transition-all text-base sm:text-lg select-none active:scale-[0.98] ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20 ring-2 ring-amber-300'
                  : 'bg-[#1E293B] text-slate-200 hover:bg-slate-700/60 border border-slate-700'
              }`}
              aria-pressed={isSelected}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
