import { useState, useEffect, useMemo } from 'react';
import type { ActiveTab, Station } from './types/radio';
import { CURATED_ISRAEL_STATIONS, CURATED_GREECE_STATIONS, DEFAULT_FAVORITE_IDS } from './data/curatedStations';
import { getStations } from './services/radioApi';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { StationCard } from './components/StationCard';
import { BottomPlayer } from './components/BottomPlayer';
import { RotateCcw, Radio } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('favorites');
  const [greeceFilter, setGreeceFilter] = useState<string>('all');
  const [israelFilter, setIsraelFilter] = useState<string>('all');

  const [israelStations, setIsraelStations] = useState<Station[]>(CURATED_ISRAEL_STATIONS);
  const [greeceStations, setGreeceStations] = useState<Station[]>(CURATED_GREECE_STATIONS);
  const [isLoadingStations, setIsLoadingStations] = useState<boolean>(false);

  const {
    currentStation,
    playbackState,
    errorMessage,
    playStation,
    togglePlay
  } = useAudioPlayer();

  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  // Fetch Top 50 stations for IL and GR on mount
  useEffect(() => {
    let isMounted = true;

    async function loadStations() {
      setIsLoadingStations(true);
      try {
        const [ilList, grList] = await Promise.all([
          getStations('IL'),
          getStations('GR')
        ]);

        if (isMounted) {
          if (ilList && ilList.length > 0) setIsraelStations(ilList);
          if (grList && grList.length > 0) setGreeceStations(grList);
        }
      } catch (e) {
        console.warn('API error, retained curated stations:', e);
      } finally {
        if (isMounted) {
          setIsLoadingStations(false);
        }
      }
    }

    loadStations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Map of all stations by ID for fast lookup
  const allStationsMap = useMemo(() => {
    const map = new Map<string, Station>();
    CURATED_ISRAEL_STATIONS.forEach(s => map.set(s.id, s));
    CURATED_GREECE_STATIONS.forEach(s => map.set(s.id, s));
    israelStations.forEach(s => map.set(s.id, s));
    greeceStations.forEach(s => map.set(s.id, s));
    return map;
  }, [israelStations, greeceStations]);

  // Compute stations to display based on active tab and filters
  const displayedStations = useMemo(() => {
    if (activeTab === 'favorites') {
      const favList: Station[] = [];
      for (const id of favoriteIds) {
        const station = allStationsMap.get(id);
        if (station) {
          favList.push(station);
        }
      }
      return favList;
    }

    if (activeTab === 'greece') {
      if (greeceFilter === 'all') return greeceStations;
      return greeceStations.filter(s => s.category === greeceFilter);
    }

    if (activeTab === 'israel') {
      if (israelFilter === 'all') return israelStations;
      return israelStations.filter(s => s.category === israelFilter);
    }

    return [];
  }, [activeTab, favoriteIds, allStationsMap, greeceStations, greeceFilter, israelStations, israelFilter]);

  // Restore default favorites if user cleared them
  const restoreDefaultFavorites = () => {
    DEFAULT_FAVORITE_IDS.forEach(id => {
      if (!isFavorite(id)) {
        toggleFavorite(id);
      }
    });
  };

  return (
    <div
      className="min-h-screen bg-[#1C1917] text-white flex flex-col font-sans select-none border-x-4 border-stone-800"
      dir="rtl"
    >
      {/* Top 1970s Transistor Header & Speaker Grille */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favoriteIds.length}
      />

      {/* Mechanical Band-Selector Filter Bar */}
      <FilterBar
        activeTab={activeTab}
        currentFilter={activeTab === 'greece' ? greeceFilter : israelFilter}
        onFilterChange={activeTab === 'greece' ? setGreeceFilter : setIsraelFilter}
      />

      {/* Main Preset Tuner Content */}
      <main className="flex-1 px-3 sm:px-6 py-4 pb-[155px] max-w-7xl mx-auto w-full">
        {/* Retro Header Plate */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 flex items-center gap-2">
              {activeTab === 'favorites' && '⭐ לחצני מועדפים שמורים'}
              {activeTab === 'greece' && '🇬🇷 שידורי יוון הפופולריים'}
              {activeTab === 'israel' && '🇮🇱 שידורי ישראל המובילים'}
            </h2>
            <p className="text-base sm:text-lg text-amber-300/80 font-bold mt-0.5">
              {activeTab === 'favorites' && 'לחץ על כל מקש להשמעה מיידית (מוגן מפני מחיקה בשוגג)'}
              {activeTab === 'greece' && 'התחנות הנבחרות מיוון בשמות עבריים ברורים'}
              {activeTab === 'israel' && 'חדשות, אקטואליה ומוזיקה ישראלית באיכות מעולה'}
            </p>
          </div>

          {isLoadingStations && (
            <div className="text-xs text-amber-300 font-black bg-stone-900/90 px-3 py-1.5 rounded-lg border border-amber-500/40 flex items-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              סורק תחנות...
            </div>
          )}
        </div>

        {/* Empty State for Favorites */}
        {activeTab === 'favorites' && displayedStations.length === 0 ? (
          <div className="bg-[#24201D] border-3 border-dashed border-stone-700 rounded-3xl p-8 text-center my-6 flex flex-col items-center justify-center gap-4 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border-2 border-amber-500/40">
              <Radio size={44} />
            </div>
            <h3 className="text-2xl font-black text-amber-100">אין תחנות שמורות כרגע</h3>
            <p className="text-lg text-stone-300 font-bold max-w-md">
              תוכל לסמן תחנות בכוכב מתוך טאב יוון או ישראל, או לשחזר את תחנות העוגן בלחיצה אחת:
            </p>
            <button
              onClick={restoreDefaultFavorites}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xl flex items-center gap-2 shadow-xl border-2 border-amber-200 border-b-[5px] border-b-stone-950 active:translate-y-1 active:border-b-[2px]"
            >
              <RotateCcw size={26} strokeWidth={2.5} />
              שחזר תחנות עוגן
            </button>
          </div>
        ) : (
          /* Bakelite Preset Key Grid: 1 column on mobile, 2 columns on tablet/desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {displayedStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                isPlaying={currentStation?.id === station.id}
                playbackState={playbackState}
                isFavorite={isFavorite(station.id)}
                isFavoritesTab={activeTab === 'favorites'}
                onPlay={playStation}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      {/* Persistent Backlit Analog Tuner Dial & Power Rocker Switch (Height 125px) */}
      <BottomPlayer
        currentStation={currentStation}
        playbackState={playbackState}
        errorMessage={errorMessage}
        isFavorite={currentStation ? isFavorite(currentStation.id) : false}
        onTogglePlay={togglePlay}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default App;
