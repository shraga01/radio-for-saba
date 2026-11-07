import React from 'react';
import { Radio, Star } from 'lucide-react';
import type { ActiveTab } from '../types/radio';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  favoritesCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0F172A]/95 backdrop-blur-md border-b-2 border-slate-700 shadow-xl px-3 pt-3 pb-3">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-inner">
            <Radio size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              הרדיו של אבא
            </h1>
            <p className="text-sm font-semibold text-amber-300/90">
              מוזיקה וחדשות בלחיצה אחת • ללא פרסומות
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-emerald-400 text-sm font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          שידור חי
        </div>
      </div>

      {/* 3 Giant Navigation Tabs */}
      <nav className="grid grid-cols-3 gap-2" aria-label="בחירת קטגוריית שידור">
        {/* Tab 1: Favorites */}
        <button
          onClick={() => onTabChange('favorites')}
          className={`min-h-[76px] sm:min-h-[84px] px-2 py-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none active:scale-[0.98] ${
            activeTab === 'favorites'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-4 ring-amber-300'
              : 'bg-[#1E293B] text-slate-200 hover:bg-slate-700/80 border-2 border-slate-700 font-bold'
          }`}
          aria-pressed={activeTab === 'favorites'}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Star
              size={28}
              strokeWidth={2.5}
              className={activeTab === 'favorites' ? 'fill-slate-950 text-slate-950' : 'text-amber-400 fill-amber-400/30'}
            />
            {favoritesCount > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'favorites' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-xl sm:text-2xl font-extrabold leading-none">מועדפים</span>
        </button>

        {/* Tab 2: Greek Hits */}
        <button
          onClick={() => onTabChange('greece')}
          className={`min-h-[76px] sm:min-h-[84px] px-2 py-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none active:scale-[0.98] ${
            activeTab === 'greece'
              ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/30 ring-4 ring-sky-300'
              : 'bg-[#1E293B] text-slate-200 hover:bg-slate-700/80 border-2 border-slate-700 font-bold'
          }`}
          aria-pressed={activeTab === 'greece'}
        >
          <span className="text-2xl leading-none">🇬🇷</span>
          <span className="text-xl sm:text-2xl font-extrabold leading-none">להיטי יוון</span>
        </button>

        {/* Tab 3: Israel Radio */}
        <button
          onClick={() => onTabChange('israel')}
          className={`min-h-[76px] sm:min-h-[84px] px-2 py-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center select-none active:scale-[0.98] ${
            activeTab === 'israel'
              ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30 ring-4 ring-blue-300'
              : 'bg-[#1E293B] text-slate-200 hover:bg-slate-700/80 border-2 border-slate-700 font-bold'
          }`}
          aria-pressed={activeTab === 'israel'}
        >
          <span className="text-2xl leading-none">🇮🇱</span>
          <span className="text-xl sm:text-2xl font-extrabold leading-none">רדיו ישראל</span>
        </button>
      </nav>
    </header>
  );
};
