import React from 'react';
import type { Station, PlaybackState } from '../types/radio';

interface StationCardProps {
  station: Station;
  index: number;
  isPlaying: boolean;
  playbackState: PlaybackState;
  isFavorite: boolean;
  isFavoritesTab?: boolean;
  onPlay: (station: Station) => void;
  onToggleFavorite: (stationId: string) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  index,
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
    <article
      id={`station-${station.id}`}
      onClick={() => onPlay(station)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay(station);
        }
      }}
      className={`relative rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-all min-h-[115px] ${
        isPlayingThis
          ? 'bg-gradient-to-b from-[#241e17] via-[#1a1713] to-[#12110f] border-2 border-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.25)]'
          : isLoadingThis
          ? 'bg-gradient-to-b from-[#241e17] via-[#1a1713] to-[#12110f] border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
          : 'bg-[#1b1917] border-2 border-[#38332c] hover:border-amber-500/60 shadow-[0_4px_8px_rgba(0,0,0,0.6)] active:bg-[#151312]'
      }`}
      aria-label={`תחנת ${station.name}, ${isPlayingThis ? 'מנגנת כעת' : 'לחץ להאזנה'}`}
      data-purpose={isPlayingThis ? 'station-card-active' : 'station-card'}
    >
      {/* Mechanical Pressed Indicator Strip on edge (Visible when playing/loading) */}
      {isPlayingThis && (
        <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-amber-500 rounded-r-xl shadow-[0_0_10px_#f59e0b]"></div>
      )}
      {isLoadingThis && (
        <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-amber-400 rounded-r-xl animate-pulse"></div>
      )}

      {/* Star Favorite & Play Rocker Cluster (in RTL, situated on the left) */}
      <div className="flex items-center gap-2.5 z-10 shrink-0">
        {/* Favorite Star Button */}
        {isFavoritesTab ? (
          <div
            className="w-13 h-13 min-w-[50px] min-h-[50px] bg-[#2a241b] rounded-lg border-2 border-amber-500/70 flex items-center justify-center text-amber-400 text-2xl shadow-inner pointer-events-none"
            title="מועדף שמור במסך הבית"
          >
            ★
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(station.id);
            }}
            aria-label={isFavorite ? `הסר את ${station.name} מהמועדפים` : `שמור את ${station.name} במועדפים`}
            className={`w-12 h-12 min-w-[48px] min-h-[48px] rounded-lg border flex items-center justify-center text-2xl shadow-inner active:scale-95 transition-transform ${
              isFavorite
                ? 'bg-[#2a241b] border-amber-500 text-amber-400'
                : 'bg-[#221f1c] border-[#474037] text-stone-400 hover:text-amber-300'
            }`}
          >
            ★
          </button>
        )}

        {/* Play/Speaker State Indicator */}
        {isPlayingThis ? (
          <div className="w-13 h-13 min-w-[50px] min-h-[50px] bg-gradient-to-b from-amber-600 to-amber-700 rounded-lg border border-amber-300 flex flex-col items-center justify-center shadow-lg">
            <span className="text-black text-2xl font-black">🔊</span>
          </div>
        ) : isLoadingThis ? (
          <div className="w-13 h-13 min-w-[50px] min-h-[50px] bg-gradient-to-b from-amber-500 to-amber-600 rounded-lg border border-amber-300 flex flex-col items-center justify-center shadow-lg animate-pulse">
            <span className="text-black text-xl font-black font-dial">⏳</span>
          </div>
        ) : (
          <div
            className="w-12 h-12 min-w-[48px] min-h-[48px] bg-[#2c2824] rounded-lg border border-[#4f483d] flex items-center justify-center text-amber-200 text-2xl shadow active:scale-95 transition-transform group-hover:border-amber-400/60"
            aria-hidden="true"
          >
            ▶
          </div>
        )}
      </div>

      {/* Station Information (Huge Senior-Friendly Typography) */}
      <div className="flex-1 pr-1 text-right min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {isPlayingThis ? (
            <>
              <span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded font-dial tracking-wider">
                PRESET {index + 1} • מנגן
              </span>
              <div className="jewel-lamp-green w-2.5 h-2.5 rounded-full inline-block animate-ping"></div>
            </>
          ) : isLoadingThis ? (
            <>
              <span className="bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded font-dial tracking-wider animate-pulse">
                PRESET {index + 1} • טוען...
              </span>
              <div className="jewel-lamp-amber w-2.5 h-2.5 rounded-full inline-block animate-ping"></div>
            </>
          ) : (
            <span className="bg-[#2c2823] text-amber-200/80 text-xs font-bold px-2 py-0.5 rounded font-dial">
              PRESET {index + 1}
            </span>
          )}

          {station.isCurated && !isPlayingThis && !isLoadingThis && (
            <span className="text-[11px] text-amber-300/80 bg-stone-800/80 px-1.5 py-0.2 rounded border border-amber-500/30">
              מומלץ
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-[26px] font-black text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate">
          {station.name}
        </h2>

        <p className="text-amber-300 text-base sm:text-lg font-bold leading-tight mt-0.5 truncate">
          {station.subtitle}
        </p>

        {station.originalName && station.originalName !== station.name && (
          <span className="text-xs text-amber-200/60 font-semibold font-dial truncate block mt-0.5">
            {station.originalName}
          </span>
        )}
      </div>
    </article>
  );
};
