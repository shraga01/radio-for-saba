import React from 'react';
import { Play, Pause, Loader2, Star, AlertCircle, Volume2 } from 'lucide-react';
import type { Station, PlaybackState } from '../types/radio';

interface BottomPlayerProps {
  currentStation: Station | null;
  playbackState: PlaybackState;
  errorMessage: string | null;
  isFavorite: boolean;
  onTogglePlay: () => void;
  onToggleFavorite: (stationId: string) => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
  currentStation,
  playbackState,
  errorMessage,
  isFavorite,
  onTogglePlay,
  onToggleFavorite
}) => {
  const isPlaying = playbackState === 'playing';
  const isLoading = playbackState === 'loading';
  const isError = playbackState === 'error';

  const handleFavoriteClick = () => {
    if (!currentStation) return;
    if (isFavorite) {
      if (window.confirm(`להסיר את ${currentStation.name} מהמועדפים?`)) {
        onToggleFavorite(currentStation.id);
      }
    } else {
      onToggleFavorite(currentStation.id);
    }
  };

  return (
    <aside
      className="fixed bottom-0 start-0 end-0 z-40 h-[125px] bg-[#1C1917] border-t-4 border-stone-600/90 shadow-[0_-12px_30px_rgba(0,0,0,0.85)] px-2.5 sm:px-5 flex items-center justify-between gap-2 sm:gap-4 select-none safe-pb"
      aria-label="לוח כוונון ותחנה פעילה (Analog Radio Tuner)"
    >
      {/* Right side in RTL: Backlit Analog Radio Tuner Window */}
      <div className="flex-1 min-w-0 h-[96px] bg-[#FEF3C7] rounded-xl border-3 border-stone-900 shadow-[inset_0_3px_8px_rgba(0,0,0,0.4)] px-3 py-1.5 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Decorative Radio Frequency Dial Scale */}
        <div className="flex items-center justify-between border-b border-stone-400/80 pb-0.5 text-[11px] font-mono font-black text-stone-700 select-none">
          <span className="tracking-widest">FM 88</span>
          <span className="opacity-70">92</span>
          <span className="opacity-70">96</span>
          <span className="text-red-700 font-extrabold scale-110">100</span>
          <span className="opacity-70">104</span>
          <span className="tracking-widest">108 MHz</span>
        </div>

        {/* Vintage Red Tuning Needle Overlay (Visible when playing/tuning) */}
        {(isPlaying || isLoading) && (
          <div className="absolute top-0 bottom-0 start-[48%] w-0.5 bg-red-600/90 shadow-[0_0_4px_rgba(220,38,38,0.8)] pointer-events-none z-10 animate-pulse"></div>
        )}

        {/* Station Name & Status inside Backlit Glass (High Contrast Charcoal #111827 for Senior Eyes) */}
        <div className="min-w-0 pr-0.5 my-auto">
          {currentStation ? (
            <>
              <h2 className="text-[21px] sm:text-[25px] font-black text-stone-950 leading-tight truncate tracking-tight">
                {currentStation.name}
              </h2>

              <div className="flex items-center gap-2 mt-0.5">
                {isPlaying && (
                  <span className="flex items-center gap-1 text-emerald-800 font-black text-sm sm:text-base">
                    <Volume2 size={18} strokeWidth={3} className="text-emerald-700 animate-pulse" />
                    <span>מנגן כעת בשידור חי</span>
                  </span>
                )}

                {isLoading && (
                  <span className="flex items-center gap-1 text-amber-800 font-black text-sm sm:text-base">
                    <Loader2 size={18} className="animate-spin text-amber-700" />
                    <span>{errorMessage || 'מכוון תדר שידור...'}</span>
                  </span>
                )}

                {playbackState === 'paused' && (
                  <span className="flex items-center gap-1.5 text-stone-700 font-extrabold text-sm sm:text-base">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-600"></span>
                    <span>מושהה (לחץ על כפתור נגן)</span>
                  </span>
                )}

                {isError && (
                  <span className="flex items-center gap-1 text-red-800 font-black text-xs sm:text-sm">
                    <AlertCircle size={18} className="text-red-700 flex-shrink-0" />
                    <span className="truncate">{errorMessage || 'התחנה לא זמינה כרגע'}</span>
                  </span>
                )}

                {playbackState === 'idle' && (
                  <span className="text-stone-700 font-bold text-sm sm:text-base">
                    לחץ על כפתור נגן להתחלת שידור
                  </span>
                )}
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 leading-tight">
                הרדיו מוכן לקליטה
              </h2>
              <p className="text-xs sm:text-sm font-bold text-stone-700">
                בחר תחנה מהלחצנים למעלה להאזנה מיידית
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Left side in RTL: Mechanical Rocker Switch & Preset Save Key */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Mechanical Preset Save Key */}
        {currentStation && (
          <button
            onClick={handleFavoriteClick}
            className={`h-[84px] px-3 sm:px-4 rounded-xl flex flex-col items-center justify-center gap-1 font-black text-xs sm:text-sm border-2 border-b-[5px] border-b-stone-950 transition-all active:translate-y-1 active:border-b-[2px] ${
              isFavorite
                ? 'bg-gradient-to-b from-stone-800 to-stone-900 border-amber-400 text-amber-400 shadow-inner ring-1 ring-amber-300'
                : 'bg-gradient-to-b from-stone-800 to-stone-900 border-stone-700 text-stone-300 hover:text-white'
            }`}
            aria-label={isFavorite ? 'מועדף (לחץ להסרה)' : 'שמור במועדפים'}
          >
            <Star
              size={32}
              strokeWidth={2.5}
              className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
            />
            <span className="leading-none">{isFavorite ? 'מועדף' : 'שמור'}</span>
          </button>
        )}

        {/* Giant Tactile Power Rocker Switch: 84x84px strictly as required */}
        <button
          onClick={onTogglePlay}
          disabled={!currentStation}
          className={`w-[84px] h-[84px] rounded-2xl flex flex-col items-center justify-center gap-1 shadow-2xl transition-all border-3 border-stone-950 select-none ${
            !currentStation
              ? 'bg-stone-800 border-b-[6px] border-b-stone-950 text-stone-500 opacity-60 cursor-not-allowed'
              : isPlaying
              ? 'translate-y-1 bg-gradient-to-b from-red-600 to-red-700 text-white border-b-[2px] border-b-stone-950 ring-4 ring-red-400/50 shadow-inner'
              : isLoading
              ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 border-b-[4px] border-b-stone-950 ring-4 ring-amber-300 animate-pulse'
              : isError
              ? 'bg-gradient-to-b from-red-600 to-red-700 text-white border-b-[5px] border-b-stone-950 ring-4 ring-red-300'
              : 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-stone-950 hover:from-emerald-400 hover:to-emerald-500 border-b-[6px] border-b-stone-950 ring-4 ring-emerald-300 active:translate-y-1 active:border-b-[2px]'
          }`}
          aria-label={isPlaying ? 'עצור שידור' : 'הפעל שידור'}
        >
          {isPlaying ? (
            <>
              <Pause size={38} strokeWidth={3} className="fill-current" />
              <span className="text-xs font-black uppercase font-mono tracking-wider">עצור</span>
            </>
          ) : isLoading ? (
            <>
              <Loader2 size={38} strokeWidth={3} className="animate-spin text-stone-950" />
              <span className="text-xs font-black uppercase font-mono tracking-wider">טוען</span>
            </>
          ) : (
            <>
              <Play size={38} strokeWidth={3} className="fill-current translate-x-[-1px]" />
              <span className="text-xs font-black uppercase font-mono tracking-wider">נגן</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
