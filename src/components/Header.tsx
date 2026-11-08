import React from 'react';
import type { ActiveTab } from '../types/radio';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  favoritesCount: number;
  isPlaying?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  isPlaying = false
}) => {
  return (
    <div className="w-full box-border">
      {/* Top Speaker And Branding Header */}
      <header className="w-full relative pt-3 px-3 pb-2 border-b-4 border-[#0c0b0a] bg-[#11100f] safe-pt box-border">
        {/* Decorative chassis corner screws & ON AIR indicator */}
        <div className="flex justify-between items-center px-1 mb-2">
          <div className="screw-head"></div>
          
          {/* ON AIR Indicator Lamp */}
          <div className="flex items-center gap-2 bg-[#090807] px-3.5 py-1 rounded-full border border-[#3a352f] shadow-inner">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isPlaying ? 'jewel-lamp-green animate-pulse' : 'jewel-lamp-amber'
              }`}
            ></div>
            <span className="text-[14px] font-black tracking-wider text-emerald-400 font-dial uppercase">
              {isPlaying ? 'ON AIR • משדר כעת' : 'STANDBY • מוכן'}
            </span>
          </div>

          <div className="screw-head"></div>
        </div>

        {/* Anodized Metallic Speaker Grille Texture Area */}
        <div className="speaker-grille h-14 w-full rounded-md border-2 border-[#3d362c] flex items-center justify-center p-1 relative shadow-inner">
          {/* Embossed Champagne-Brass Badge: הרדיו של סבא יצחק */}
          <div className="metallic-brass rounded px-4 py-1.5 flex items-center gap-3 border border-[#ffe699] shadow-lg">
            <span className="text-[#302107] font-black text-xl tracking-tight leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
              📻 הרדיו של סבא יצחק
            </span>
            <span className="text-[#593d0c] font-black text-[11px] uppercase tracking-widest border-s-2 border-[#593d0c]/40 ps-2 leading-none font-dial">
              TRANSISTOR • SOLID STATE
            </span>
          </div>
        </div>

        {/* Sub-label: Clear instructional text for senior users */}
        <div className="text-center mt-2">
          <p className="text-amber-200/90 text-sm font-semibold tracking-wide">
            לחצו על כפתור התחנה להשמעה מיידית בקול ברור
          </p>
        </div>
      </header>

      {/* 1970s Heavy Mechanical Push Buttons (Band Selectors) */}
      <section className="w-full p-3 bg-[#131210] border-b-2 border-[#2b2722] box-border" data-purpose="band-selector">
        <div className="grid grid-cols-3 w-full gap-3" role="tablist">
          {/* Button 1: מועדפים */}
          <button
            onClick={() => onTabChange('favorites')}
            aria-selected={activeTab === 'favorites'}
            className={`${
              activeTab === 'favorites'
                ? 'bakelite-button-active border-2 border-amber-500/80'
                : 'bakelite-button border-2 border-[#3d3830]'
            } w-full box-border rounded-lg py-3 px-2 flex flex-col items-center justify-center transition-transform`}
            role="tab"
          >
            <div className="flex items-center gap-1">
              <span className="text-2xl text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">★</span>
              <span className="text-xs font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-dial">
                {favoritesCount}
              </span>
            </div>
            <span
              className={`text-xl font-black tracking-tight mt-1 leading-tight ${
                activeTab === 'favorites' ? 'text-amber-300' : 'text-gray-200'
              }`}
            >
              מועדפים
            </span>
          </button>

          {/* Button 2: להיטי יוון */}
          <button
            onClick={() => onTabChange('greece')}
            aria-selected={activeTab === 'greece'}
            className={`${
              activeTab === 'greece'
                ? 'bakelite-button-active border-2 border-amber-500/80'
                : 'bakelite-button border-2 border-[#3d3830]'
            } w-full box-border rounded-lg py-3 px-2 flex flex-col items-center justify-center transition-transform`}
            role="tab"
          >
            <span className="text-2xl leading-none">🇬🇷</span>
            <span
              className={`text-xl font-bold tracking-tight mt-1 leading-tight ${
                activeTab === 'greece' ? 'text-amber-300' : 'text-gray-200'
              }`}
            >
              להיטי יוון
            </span>
          </button>

          {/* Button 3: רדיו ישראל */}
          <button
            onClick={() => onTabChange('israel')}
            aria-selected={activeTab === 'israel'}
            className={`${
              activeTab === 'israel'
                ? 'bakelite-button-active border-2 border-amber-500/80'
                : 'bakelite-button border-2 border-[#3d3830]'
            } w-full box-border rounded-lg py-3 px-2 flex flex-col items-center justify-center transition-transform`}
            role="tab"
          >
            <span className="text-2xl leading-none">🇮🇱</span>
            <span
              className={`text-xl font-bold tracking-tight mt-1 leading-tight ${
                activeTab === 'israel' ? 'text-amber-300' : 'text-gray-200'
              }`}
            >
              רדיו ישראל
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
