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
      className="w-full max-w-[480px] sm:max-w-xl min-h-screen bg-[#171513] border-x-[10px] sm:border-[10px] border-[#382113] shadow-[0_15px_50px_rgba(0,0,0,0.95)] flex flex-col relative pb-36 mx-auto"
      data-purpose="radio-cabinet"
      dir="rtl"
    >
      {/* Top Speaker And Branding Header & Band Selector */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favoriteIds.length}
        isPlaying={playbackState === 'playing'}
      />

      {/* Quick Category Filter Strip */}
      <FilterBar
        activeTab={activeTab}
        currentFilter={activeTab === 'greece' ? greeceFilter : israelFilter}
        onFilterChange={activeTab === 'greece' ? setGreeceFilter : setIsraelFilter}
      />

      {/* Station Presets List */}
      <main className="flex-1 p-3 space-y-3.5 overflow-y-auto" data-purpose="station-list">
        {/* Sub-header status if loading */}
        {isLoadingStations && (
          <div className="text-center py-1">
            <span className="text-xs font-bold text-amber-300/80 bg-stone-900/80 px-3 py-1 rounded-full border border-amber-500/30 font-dial animate-pulse">
              SCANNING FREQUENCIES • סורק תחנות ברקע...
            </span>
          </div>
        )}

        {/* Empty State for Favorites */}
        {activeTab === 'favorites' && displayedStations.length === 0 ? (
          <div className="bg-[#1b1917] border-2 border-dashed border-[#474037] rounded-2xl p-6 text-center my-6 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Radio size={36} />
            </div>
            <h3 className="text-xl font-black text-amber-100">אין תחנות שמורות כרגע</h3>
            <p className="text-sm text-amber-200/80 font-bold max-w-xs">
              סמן תחנות בכוכב מתוך טאב יוון או ישראל, או שחזר את תחנות העוגן בלחיצה אחת:
            </p>
            <button
              onClick={restoreDefaultFavorites}
              className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 font-black text-base flex items-center gap-2 shadow-lg border border-amber-200 active:scale-95"
            >
              <RotateCcw size={20} strokeWidth={2.5} />
              שחזר תחנות עוגן
            </button>
          </div>
        ) : (
          /* Tactile Bakelite Station Preset Keys */
          displayedStations.map((station, idx) => (
            <StationCard
              key={station.id}
              station={station}
              index={idx}
              isPlaying={currentStation?.id === station.id}
              playbackState={playbackState}
              isFavorite={isFavorite(station.id)}
              isFavoritesTab={activeTab === 'favorites'}
              onPlay={playStation}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </main>

      {/* Fixed Bottom Backlit Analog Radio Tuner Dial Player Window */}
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
