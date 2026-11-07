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

  return (
    <aside
      className="fixed bottom-0 start-0 end-0 z-40 h-[125px] bg-[#0B1120] border-t-4 border-slate-700 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.6)] px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none safe-pb"
      aria-label="נגן שידור ראשי"
    >
      {/* Right side in RTL: Station details and status */}
      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
        {currentStation ? (
          <>
            {/* Station Title */}
            <h2 className="text-[22px] sm:text-[26px] font-black text-white leading-tight truncate tracking-tight">
              {currentStation.name}
            </h2>

            {/* Status Line */}
            <div className="flex items-center gap-2 mt-1">
              {isPlaying && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-base sm:text-lg animate-pulse">
                  <Volume2 size={22} strokeWidth={3} />
                  מנגן כעת
                </span>
              )}

              {isLoading && (
                <span className="flex items-center gap-1.5 text-amber-300 font-extrabold text-base sm:text-lg">
                  <Loader2 size={22} className="animate-spin text-amber-400" />
                  {errorMessage || 'טוען שידור...'}
                </span>
              )}

              {playbackState === 'paused' && (
                <span className="flex items-center gap-1.5 text-slate-300 font-bold text-base sm:text-lg">
                  <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                  מושהה (לחץ על נגן להמשך)
                </span>
              )}

              {isError && (
                <span className="flex items-center gap-1.5 text-rose-400 font-black text-sm sm:text-base">
                  <AlertCircle size={22} className="text-rose-400 flex-shrink-0" />
                  <span className="line-clamp-1">{errorMessage || 'התחנה לא זמינה כרגע, בחר תחנה אחרת'}</span>
                </span>
              )}

              {playbackState === 'idle' && (
                <span className="text-slate-400 font-semibold text-base sm:text-lg">
                  לחץ על כפתור הניגון להאזנה
                </span>
              )}
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-300">
              הרדיו מוכן להשמעה
            </h2>
            <p className="text-base text-amber-300 font-medium">
              בחר תחנה מהרשימה למעלה להאזנה מיידית
            </p>
          </div>
        )}
      </div>

      {/* Left side in RTL: Huge Buttons (Favorite + Play/Stop) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Favorite Button */}
        {currentStation && (
          <button
            onClick={() => onToggleFavorite(currentStation.id)}
            className={`h-[84px] px-3 sm:px-4 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold text-xs sm:text-sm border-2 transition-all active:scale-95 ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:text-white'
            }`}
            aria-label={isFavorite ? 'מועדף (לחץ להסרה)' : 'הוסף למועדפים'}
          >
            <Star
              size={34}
              strokeWidth={2.5}
              className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
            />
            <span className="font-extrabold leading-none">
              {isFavorite ? 'מועדף' : 'שמור'}
            </span>
          </button>
        )}

        {/* Huge Play/Stop Button: 84x84px strictly as required */}
        <button
          onClick={onTogglePlay}
          disabled={!currentStation}
          className={`w-[84px] h-[84px] rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90 select-none ${
            !currentStation
              ? 'bg-slate-800 border-2 border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
              : isPlaying
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 ring-4 ring-emerald-300 shadow-emerald-500/40'
              : isLoading
              ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 shadow-amber-400/40 animate-pulse'
              : isError
              ? 'bg-rose-500 text-white ring-4 ring-rose-300 shadow-rose-500/40'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 ring-4 ring-emerald-300 shadow-emerald-500/40'
          }`}
          aria-label={isPlaying ? 'עצור שידור' : 'הפעל שידור'}
        >
          {isPlaying ? (
            <Pause size={44} strokeWidth={3} className="fill-current" />
          ) : isLoading ? (
            <Loader2 size={44} strokeWidth={3} className="animate-spin text-slate-950" />
          ) : (
            <Play size={44} strokeWidth={3} className="fill-current translate-x-[-2px]" />
          )}
        </button>
      </div>
    </aside>
  );
};
