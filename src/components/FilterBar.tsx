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
    return null;
  }

  const filters = activeTab === 'greece' ? GREECE_FILTERS : ISRAEL_FILTERS;

  return (
    <div className="px-3 py-2 bg-[#1C1917] border-b-2 border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
        {filters.map(item => {
          const isSelected = currentFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`min-h-[56px] px-3 py-2 rounded-xl text-center flex items-center justify-center gap-2 font-black transition-all text-base sm:text-lg select-none ${
                isSelected
                  ? 'translate-y-1 bg-gradient-to-b from-amber-300 to-amber-500 text-stone-950 border-2 border-amber-200 border-b-[2px] border-b-stone-950 shadow-inner ring-2 ring-amber-300'
                  : 'bg-gradient-to-b from-stone-800 to-stone-900 text-stone-200 hover:from-stone-750 hover:to-stone-850 border-2 border-stone-700 border-b-[5px] border-b-stone-950 shadow-md active:translate-y-1 active:border-b-[2px]'
              }`}
              aria-pressed={isSelected}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
