import React, { useMemo, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { Station, PlaybackState } from '../types/radio';

interface BottomPlayerProps {
  currentStation: Station | null;
  playbackState: PlaybackState;
  errorMessage: string | null;
  isFavorite: boolean;
  onTogglePlay: () => void;
  onToggleFavorite: (stationId: string) => void;
  onNextStation: () => void;
  onPrevStation: () => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
  currentStation,
  playbackState,
  errorMessage,
  isFavorite,
  onTogglePlay,
  onToggleFavorite,
  onNextStation,
  onPrevStation
}) => {
  const isPlaying = playbackState === 'playing';
  const isLoading = playbackState === 'loading';
  const isError = playbackState === 'error';

  // State & interaction refs for the live vintage TUNING rotary dial
  const [knobAngle, setKnobAngle] = useState<number>(0);
  const pointerStartXRef = useRef<number | null>(null);
  const hasDraggedRef = useRef<boolean>(false);

  const triggerHaptic = () => {
    try {
      if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        navigator.vibrate(15);
      }
    } catch {
      // Ignore if not supported
    }
  };

  const handleNext = () => {
    triggerHaptic();
    setKnobAngle(prev => prev + 30);
    onNextStation();
  };

  const handlePrev = () => {
    triggerHaptic();
    setKnobAngle(prev => prev - 30);
    onPrevStation();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    pointerStartXRef.current = e.clientX;
    hasDraggedRef.current = false;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (pointerStartXRef.current === null) return;
    const deltaX = e.clientX - pointerStartXRef.current;
    const DRAG_THRESHOLD = 25;

    // Dragging right (> 25px) triggers onNextStation and rotates clockwise (+30deg)
    // Dragging left (< -25px) triggers onPrevStation and rotates counter-clockwise (-30deg)
    if (deltaX > DRAG_THRESHOLD) {
      hasDraggedRef.current = true;
      handleNext();
      pointerStartXRef.current = e.clientX;
    } else if (deltaX < -DRAG_THRESHOLD) {
      hasDraggedRef.current = true;
      handlePrev();
      pointerStartXRef.current = e.clientX;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    pointerStartXRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
    hasDraggedRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasDraggedRef.current) {
      // Drag gesture already triggered station step; suppress duplicate click
      hasDraggedRef.current = false;
      e.preventDefault();
      return;
    }
    handleNext();
  };

  // Compute a realistic frequency indicator position between 10% and 90%
  const needlePositionPercent = useMemo(() => {
    if (!currentStation) return 50;
    const name = currentStation.name + ' ' + (currentStation.originalName || '');
    const match = name.match(/(\d{2,3}(?:\.\d)?)\s*(?:FM|fm)?/);
    if (match) {
      const freq = parseFloat(match[1]);
      if (freq >= 87 && freq <= 108) {
        // Map 87.5-108 MHz to 10% - 90%
        return Math.min(90, Math.max(10, ((freq - 87.5) / (108 - 87.5)) * 80 + 10));
      }
    }
    // Fallback hash
    let hash = 0;
    for (let i = 0; i < currentStation.id.length; i++) {
      hash = (hash * 31 + currentStation.id.charCodeAt(i)) % 80;
    }
    return 10 + hash;
  }, [currentStation]);

  const handleFavoriteClick = () => {
    if (!currentStation) return;
    if (isFavorite) {
      if (window.confirm(`האם להסיר את ${currentStation.name} מרשימת המועדפים?`)) {
        onToggleFavorite(currentStation.id);
      }
    } else {
      onToggleFavorite(currentStation.id);
    }
  };

  return (
    <footer
      className="fixed bottom-0 start-0 end-0 z-50 bg-[#181614] border-t-4 border-[#a68643] shadow-[0_-10px_35px_rgba(0,0,0,0.9)] px-2 sm:px-4 py-2 safe-pb flex justify-center w-full box-border"
      data-purpose="analog-player-dock"
    >
      <div className="w-full max-w-[480px] min-w-[340px] box-border">
        {/* Brass Frame Bezel around Tuner Window */}
        <div className="p-1 rounded-xl bg-gradient-to-r from-[#947437] via-[#f7e3a6] to-[#80632a] shadow-md">
          {/* Recessed Backlit Tungsten Cream/Amber Dial Window */}
          <div className="tuner-window rounded-lg p-2.5 flex flex-col justify-between h-[126px]">
            {/* Analog Horizontal FM Frequency Ruler Scale */}
            <div className="relative w-full border-b border-[#735118]/40 pb-1 pt-0.5">
              {/* Scale Markings and Frequencies (88 to 108 MHz) */}
              <div className="flex justify-between items-end text-[#4a320b] font-dial text-[11px] font-bold px-1 select-none">
                <span>88</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span>92</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span>96</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span className="text-[#8c1d18] font-black scale-110">100</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span className="text-red-700 font-extrabold">102.2</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span>104</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span>108 <span className="text-[9px]">MHz</span></span>
              </div>

              {/* Dial Tick Marks Line */}
              <div className="h-2 w-full mt-1 flex justify-between items-end px-1 opacity-70">
                <div className="h-2 w-0.5 bg-[#4a320b]"></div>
                <div className="h-1 w-0.5 bg-[#4a320b]"></div>
                <div className="h-2 w-0.5 bg-[#4a320b]"></div>
                <div className="h-1 w-0.5 bg-[#4a320b]"></div>
                <div className="h-2 w-0.5 bg-[#4a320b]"></div>
                <div className="h-1 w-0.5 bg-[#4a320b]"></div>
                <div className="h-3 w-0.5 bg-red-700"></div>
                <div className="h-1 w-0.5 bg-[#4a320b]"></div>
                <div className="h-2 w-0.5 bg-[#4a320b]"></div>
                <div className="h-1 w-0.5 bg-[#4a320b]"></div>
                <div className="h-2 w-0.5 bg-[#4a320b]"></div>
              </div>

              {/* Glowing Red Analog Tuning Needle positioned dynamically */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_8px_#ef4444] pointer-events-none transition-all duration-500 ease-out z-10"
                style={{ left: `${needlePositionPercent}%` }}
              >
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full -ml-[3px] shadow-sm"></div>
              </div>
            </div>

            {/* Bottom Control Bar inside Tuner Glass */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {/* Giant Mechanical Power-Play Rocker Switch for Seniors */}
              <button
                onClick={onTogglePlay}
                disabled={!currentStation}
                aria-label={isPlaying ? 'עצור שידור' : 'הפעל שידור'}
                className={`rounded-xl w-[76px] h-[62px] sm:w-[84px] sm:h-[68px] flex flex-col items-center justify-center shrink-0 border select-none transition-transform ${
                  !currentStation
                    ? 'bg-stone-700 opacity-60 cursor-not-allowed border-stone-800'
                    : isPlaying
                    ? 'red-rocker-btn border-[#fca5a5]'
                    : 'green-rocker-btn border-[#86efac]'
                }`}
                data-purpose="master-play-toggle"
              >
                {isLoading ? (
                  <Loader2 size={26} className="text-white animate-spin" />
                ) : (
                  <span className="text-white text-2xl font-black leading-none drop-shadow">
                    {isPlaying ? '⏸' : '▶'}
                  </span>
                )}
                <span className="text-white font-extrabold text-[12px] sm:text-[13px] leading-tight mt-0.5 tracking-wider">
                  {isPlaying ? 'עצור' : isLoading ? 'מכוון' : 'נגן'}
                </span>
              </button>

              {/* Station Information & Volume / Status readout */}
              <div className="flex-1 text-right pr-1 overflow-hidden min-w-0">
                <div className="flex items-center gap-1.5 justify-start">
                  <span
                    className={`w-3 h-3 rounded-full border ${
                      isPlaying
                        ? 'bg-emerald-600 border-emerald-800 animate-pulse'
                        : isLoading
                        ? 'bg-amber-500 border-amber-700 animate-ping'
                        : isError
                        ? 'bg-red-600 border-red-800'
                        : 'bg-stone-500 border-stone-700'
                    }`}
                  ></span>
                  <span className="text-[12px] sm:text-[13px] font-black text-[#5e410e] uppercase tracking-wide truncate">
                    {isPlaying
                      ? 'קליטה מושלמת • FM STEREO'
                      : isLoading
                      ? 'מכוון תדר שידור...'
                      : isError
                      ? errorMessage || 'תחנה לא זמינה'
                      : 'הרדיו מוכן לקליטה'}
                  </span>
                </div>

                <p className="text-[#13110e] text-lg sm:text-[21px] font-black leading-tight truncate">
                  {currentStation ? currentStation.name : 'בחר תחנה מהלחצנים למעלה'}
                </p>

                <p className="text-[#593d0c] text-xs font-bold truncate">
                  {currentStation ? currentStation.subtitle : 'ווליום מוגבר מותאם למכשיר שמיעה'}
                </p>
              </div>

              {/* Favorite Toggle Key & Vintage Tuning Knob */}
              <div className="flex items-center gap-1.5 shrink-0">
                {currentStation && (
                  <button
                    onClick={handleFavoriteClick}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border text-lg shadow-sm transition-transform active:scale-95 ${
                      isFavorite
                        ? 'bg-[#2a241b] border-amber-600 text-amber-500'
                        : 'bg-[#fef3c7] border-[#8e6d2b]/60 text-stone-600 hover:text-amber-600'
                    }`}
                    title={isFavorite ? 'מועדף (לחץ להסרה)' : 'שמור במועדפים'}
                    aria-label={isFavorite ? 'מועדף' : 'שמור במועדפים'}
                  >
                    ★
                  </button>
                )}

                {/* Live Interactive Senior-Accessible Vintage Tuning Rotary Knob */}
                <button
                  type="button"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                  onClick={handleClick}
                  title="TUNING • החלף תחנה"
                  aria-label="כוונון תחנה (TUNING) - לחצו או גררו להחלפת תחנה"
                  className="flex flex-col items-center justify-center p-0.5 select-none touch-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg active:scale-95 transition-transform"
                  data-purpose="tuning-rotary-knob"
                >
                  {/* Rotary Dial Wheel with Metallic Brass Bevel */}
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#2a1d0b] via-[#d4b068] to-[#1a1205] border-2 border-[#120d04] shadow-[0_3px_8px_rgba(0,0,0,0.65)] flex items-center justify-center relative transition-transform duration-300 ease-out"
                    style={{ transform: `rotate(${knobAngle}deg)` }}
                  >
                    {/* Inner knurled dark core */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#18140f] border border-amber-400/70 shadow-inner flex items-center justify-center relative">
                      {/* Visual Indicator Notch / Tuning Line */}
                      <div className="w-1 h-3 sm:h-3.5 bg-amber-300 rounded-full absolute top-0.5 left-1/2 -translate-x-1/2 shadow-[0_0_5px_#f59e0b] border border-amber-500"></div>
                      {/* Center Brass Cap */}
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#fde68a] to-[#785317] border border-stone-900 shadow-sm"></div>
                    </div>
                  </div>

                  {/* Label & Senior Hint */}
                  <div className="flex flex-col items-center mt-0.5 select-none pointer-events-none">
                    <span className="text-[10px] sm:text-[11px] font-black text-[#3a2709] uppercase font-dial tracking-tight leading-none">
                      TUNING
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-[#785317] leading-none mt-0.5 whitespace-nowrap">
                      החלף תחנה ⟳
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
