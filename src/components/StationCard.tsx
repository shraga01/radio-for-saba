import React from 'react';
import { Play, Pause, Loader2, Star, Volume2 } from 'lucide-react';
import type { Station, PlaybackState } from '../types/radio';

interface StationCardProps {
  station: Station;
  isPlaying: boolean;
  playbackState: PlaybackState;
  isFavorite: boolean;
  onPlay: (station: Station) => void;
  onToggleFavorite: (stationId: string) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isPlaying,
  playbackState,
  isFavorite,
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
      className={`group relative min-h-[115px] p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 text-start select-none active:scale-[0.99] ${
        isPlayingThis
          ? 'bg-slate-800/95 border-4 border-emerald-400 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-300/40'
          : isLoadingThis
          ? 'bg-slate-800/95 border-4 border-amber-400 shadow-xl shadow-amber-500/20'
          : 'bg-[#1E293B] hover:bg-slate-800 border-2 border-slate-700/80 hover:border-slate-500 shadow-md'
      }`}
      aria-label={`תחנת ${station.name}, ${isPlayingThis ? 'מנגנת כעת' : 'לחץ להאזנה'}`}
    >
      {/* Right side: Station Info (in RTL, starts on the right) */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 mb-1">
          {isPlayingThis && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 text-sm font-black animate-pulse">
              <Volume2 size={18} strokeWidth={3} />
              מנגן
            </span>
          )}
          {isLoadingThis && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-sm font-black">
              <Loader2 size={18} className="animate-spin" />
              טוען...
            </span>
          )}
          {station.isCurated && !isPlayingThis && !isLoadingThis && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300 font-bold border border-slate-600/50">
              מומלץ
            </span>
          )}
        </div>

        {/* Primary Station Name */}
        <h3 className="text-[24px] sm:text-[26px] font-black text-white leading-tight tracking-tight mb-1 truncate">
          {station.name}
        </h3>

        {/* Subtitle / Genre / Details */}
        <p className="text-[17px] sm:text-[18px] text-amber-300 font-semibold leading-snug line-clamp-1">
          {station.subtitle}
        </p>

        {station.originalName && station.originalName !== station.name && (
          <p className="text-sm text-slate-400 font-medium truncate mt-0.5">
            {station.originalName}
          </p>
        )}
      </div>

      {/* Left side: Action Buttons (Play Indicator + Favorite Toggle) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Play / State Beacon Button */}
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95 shadow-md ${
            isPlayingThis
              ? 'bg-emerald-500 text-slate-950 font-black ring-4 ring-emerald-300'
              : isLoadingThis
              ? 'bg-amber-400 text-slate-950 font-black animate-pulse ring-4 ring-amber-300'
              : 'bg-slate-700/80 text-white group-hover:bg-amber-500 group-hover:text-slate-950'
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

        {/* Giant Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(station.id);
          }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all active:scale-90 border-2 ${
            isFavorite
              ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-sm'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-amber-300 hover:border-slate-500'
          }`}
          aria-label={isFavorite ? `הסר את ${station.name} מהמועדפים` : `הוסף את ${station.name} למועדפים`}
        >
          <Star
            size={32}
            strokeWidth={2.5}
            className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}
          />
        </button>
      </div>
    </div>
  );
};
