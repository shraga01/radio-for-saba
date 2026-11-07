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
    <header className="sticky top-0 z-30 bg-[#24201D] border-b-4 border-stone-950 shadow-2xl safe-pt">
      {/* 1970s Perforated Speaker Grille Area */}
      <div className="vintage-speaker-grille px-3 py-2.5 border-b-2 border-stone-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Vintage Radio Logo Plate */}
          <div className="flex items-center gap-3 bg-[#1C1917]/90 px-3.5 py-1.5 rounded-xl border border-stone-700/80 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-amber-400">
              <Radio size={26} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-100 flex items-center gap-1.5 leading-none">
                  הרדיו של אבא
                </h1>
                <span className="text-[10px] tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-stone-800 text-amber-400/90 border border-amber-500/30">
                  TRANSISTOR
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-300/80 mt-0.5">
                רדיו נייד קלאסי • ללא פרסומות • בחירה מיידית
              </p>
            </div>
          </div>

          {/* Glowing ON AIR Vintage Indicator */}
          <div className="flex items-center gap-2 bg-[#1C1917]/90 border border-stone-700 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="w-3.5 h-3.5 rounded-full led-jewel-on-air animate-pulse"></span>
            <span className="text-xs sm:text-sm font-black tracking-wider text-emerald-400 uppercase font-mono">
              ON AIR
            </span>
          </div>
        </div>
      </div>

      {/* Brushed Metallic Band-Selector Switch Chassis */}
      <div className="bg-[#1C1917] px-3 pt-3 pb-3 border-t border-stone-700">
        <nav
          className="grid grid-cols-3 gap-2.5 max-w-7xl mx-auto"
          aria-label="בורר תדרים מכני (Mechanical Band Selector)"
        >
          {/* Tab 1: Favorites Push-Button */}
          <button
            onClick={() => onTabChange('favorites')}
            className={`min-h-[76px] sm:min-h-[84px] px-2 py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-center select-none ${
              activeTab === 'favorites'
                ? 'translate-y-1 bg-gradient-to-b from-amber-300 to-amber-500 text-stone-950 font-black border-2 border-amber-200 border-b-[2px] border-b-stone-950 shadow-inner ring-2 ring-amber-300'
                : 'bg-gradient-to-b from-stone-800 to-stone-900 text-stone-200 hover:from-stone-750 hover:to-stone-850 border-2 border-stone-700 border-b-[6px] border-b-stone-950 shadow-lg active:translate-y-1 active:border-b-[2px] font-bold'
            }`}
            aria-pressed={activeTab === 'favorites'}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Star
                size={26}
                strokeWidth={2.5}
                className={
                  activeTab === 'favorites'
                    ? 'fill-stone-950 text-stone-950'
                    : 'text-amber-400 fill-amber-400/30'
                }
              />
              {favoritesCount > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-black ${
                    activeTab === 'favorites'
                      ? 'bg-stone-950 text-amber-400'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {favoritesCount}
                </span>
              )}
            </div>
            <span className="text-xl sm:text-2xl font-black leading-none">מועדפים</span>
          </button>

          {/* Tab 2: Greek Hits Push-Button */}
          <button
            onClick={() => onTabChange('greece')}
            className={`min-h-[76px] sm:min-h-[84px] px-2 py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-center select-none ${
              activeTab === 'greece'
                ? 'translate-y-1 bg-gradient-to-b from-amber-300 to-amber-500 text-stone-950 font-black border-2 border-amber-200 border-b-[2px] border-b-stone-950 shadow-inner ring-2 ring-amber-300'
                : 'bg-gradient-to-b from-stone-800 to-stone-900 text-stone-200 hover:from-stone-750 hover:to-stone-850 border-2 border-stone-700 border-b-[6px] border-b-stone-950 shadow-lg active:translate-y-1 active:border-b-[2px] font-bold'
            }`}
            aria-pressed={activeTab === 'greece'}
          >
            <span className="text-2xl leading-none">🇬🇷</span>
            <span className="text-xl sm:text-2xl font-black leading-none">להיטי יוון</span>
          </button>

          {/* Tab 3: Israel Radio Push-Button */}
          <button
            onClick={() => onTabChange('israel')}
            className={`min-h-[76px] sm:min-h-[84px] px-2 py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-center select-none ${
              activeTab === 'israel'
                ? 'translate-y-1 bg-gradient-to-b from-amber-300 to-amber-500 text-stone-950 font-black border-2 border-amber-200 border-b-[2px] border-b-stone-950 shadow-inner ring-2 ring-amber-300'
                : 'bg-gradient-to-b from-stone-800 to-stone-900 text-stone-200 hover:from-stone-750 hover:to-stone-850 border-2 border-stone-700 border-b-[6px] border-b-stone-950 shadow-lg active:translate-y-1 active:border-b-[2px] font-bold'
            }`}
            aria-pressed={activeTab === 'israel'}
          >
            <span className="text-2xl leading-none">🇮🇱</span>
            <span className="text-xl sm:text-2xl font-black leading-none">רדיו ישראל</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
