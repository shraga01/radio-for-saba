import React from 'react';
import { Play, Pause, Loader2, Star } from 'lucide-react';
import type { Station, PlaybackState } from '../types/radio';

interface StationCardProps {
  station: Station;
  isPlaying: boolean;
  playbackState: PlaybackState;
  isFavorite: boolean;
  isFavoritesTab?: boolean;
  onPlay: (station: Station) => void;
  onToggleFavorite: (stationId: string) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isPlaying,
  playbackState,
  isFavorite,
  isFavoritesTab = false,
  onPlay,
  onToggleFavorite
}) => {
  const isCurrentlyActive = isPlaying;
  const isLoadingThis = isCurrentlyActive && playbackState === 'loading';
  const isPlayingThis = isCurrentlyActive && playbackState === 'playing';

  return (
    <div
      onClick={() => onPlay(station)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay(station);
        }
      }}
      className={`group relative min-h-[115px] p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 text-start select-none ${
        isPlayingThis
          ? 'translate-y-1.5 bg-[#2A241F] border-2 border-amber-500 border-b-[3px] border-b-stone-950 shadow-inner ring-4 ring-amber-400/30'
          : isLoadingThis
          ? 'translate-y-1 bg-[#28221D] border-2 border-amber-400 border-b-[4px] border-b-stone-950 shadow-md ring-2 ring-amber-300/40'
          : 'bg-[#221E1B] hover:bg-[#282420] border-2 border-stone-700 border-b-[8px] border-b-stone-950 shadow-xl active:translate-y-1.5 active:border-b-[3px]'
      }`}
      aria-label={`תחנת ${station.name}, ${isPlayingThis ? 'מנגנת כעת' : 'לחץ להאזנה'}`}
    >
      {/* Right side: Station Info (in RTL, starts on the right) */}
      <div className="flex-1 min-w-0 pr-1">
        {/* Top Status Bar with Vintage Jewel LED Indicator */}
        <div className="flex items-center gap-2.5 mb-1.5">
          {isPlayingThis ? (
            <div className="flex items-center gap-1.5 bg-stone-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/50">
              <span className="w-3.5 h-3.5 rounded-full led-jewel-on-air inline-block flex-shrink-0 animate-pulse"></span>
              <span className="text-xs font-mono font-black text-emerald-400 tracking-wider">
                ON AIR
              </span>
            </div>
          ) : isLoadingThis ? (
            <div className="flex items-center gap-1.5 bg-stone-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/50">
              <span className="w-3.5 h-3.5 rounded-full led-jewel-amber inline-block flex-shrink-0 animate-pulse"></span>
              <span className="text-xs font-mono font-black text-amber-300 tracking-wider">
                TUNING...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-stone-950/60 px-2 py-0.5 rounded-full border border-stone-700/60">
              <span className="w-2.5 h-2.5 rounded-full led-jewel-off inline-block flex-shrink-0"></span>
              <span className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                PRESET
              </span>
            </div>
          )}

          {station.isCurated && !isPlayingThis && !isLoadingThis && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-stone-800 text-amber-300/90 font-bold border border-amber-500/30">
              עוגן
            </span>
          )}

          {isFavoritesTab && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
              שמור במסך הבית
            </span>
          )}
        </div>

        {/* Primary Station Name (Standard Bold Sans-Serif 26px for AAA Accessibility) */}
        <h3 className="text-[24px] sm:text-[26px] font-black text-amber-50 leading-tight tracking-tight mb-1 truncate">
          {station.name}
        </h3>

        {/* Subtitle / Genre / Description (18px Amber) */}
        <p className="text-[17px] sm:text-[18px] text-amber-300 font-bold leading-snug line-clamp-1">
          {station.subtitle}
        </p>

        {station.originalName && station.originalName !== station.name && (
          <p className="text-sm text-stone-400 font-medium truncate mt-0.5">
            {station.originalName}
          </p>
        )}
      </div>

      {/* Left side: Mechanical Preset Push-Key & Favorite Toggle */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Tactile Push-Key Beacon */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all shadow-md ${
            isPlayingThis
              ? 'translate-y-1 bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 border-2 border-amber-200 border-b-[2px] border-b-stone-950 ring-2 ring-amber-300 shadow-inner'
              : isLoadingThis
              ? 'translate-y-0.5 bg-gradient-to-b from-amber-500 to-amber-600 text-stone-950 border-2 border-amber-300 border-b-[3px] border-b-stone-950 animate-pulse'
              : 'bg-gradient-to-b from-stone-700 to-stone-800 text-amber-100 group-hover:from-stone-650 group-hover:to-stone-750 border-2 border-stone-600 border-b-[5px] border-b-stone-950'
          }`}
          aria-hidden="true"
        >
          {isPlayingThis ? (
            <Pause size={34} strokeWidth={3} className="fill-current" />
          ) : isLoadingThis ? (
            <Loader2 size={34} strokeWidth={3} className="animate-spin" />
          ) : (
            <Play size={34} strokeWidth={3} className="fill-current translate-x-[-1px]" />
          )}
        </div>

        {/* Favorite Protection Indicator / Button */}
        {isFavoritesTab ? (
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center bg-amber-500/15 border-2 border-amber-400/40 text-amber-400 pointer-events-none shadow-inner"
            title="תחנה מועדפת שמורה"
          >
            <Star size={30} className="fill-amber-400 text-amber-400" />
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(station.id);
            }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all border-2 border-b-[5px] active:translate-y-1 active:border-b-[2px] ${
              isFavorite
                ? 'bg-gradient-to-b from-stone-800 to-stone-900 border-amber-500/80 border-b-stone-950 text-amber-400 shadow-md'
                : 'bg-gradient-to-b from-stone-800 to-stone-900 border-stone-700 border-b-stone-950 text-stone-400 hover:text-amber-300 hover:border-stone-500'
            }`}
            aria-label={isFavorite ? `הסר את ${station.name} מהמועדפים` : `הוסף את ${station.name} למועדפים`}
          >
            <Star
              size={32}
              strokeWidth={2.5}
              className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-400'}
            />
          </button>
        )}
      </div>
    </div>
  );
};
