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
    // Curated first
    CURATED_ISRAEL_STATIONS.forEach(s => map.set(s.id, s));
    CURATED_GREECE_STATIONS.forEach(s => map.set(s.id, s));
    // Supplemental
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
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans select-none" dir="rtl">
      {/* Top Header with 3 Giant Navigation Tabs */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favoriteIds.length}
      />

      {/* Sub-Filter Bar (for Greece and Israel tabs) */}
      <FilterBar
        activeTab={activeTab}
        currentFilter={activeTab === 'greece' ? greeceFilter : israelFilter}
        onFilterChange={activeTab === 'greece' ? setGreeceFilter : setIsraelFilter}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-3 sm:px-6 py-4 pb-[150px] max-w-7xl mx-auto w-full">
        {/* Tab Header Banner */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              {activeTab === 'favorites' && '⭐ התחנות המועדפות שלך'}
              {activeTab === 'greece' && '🇬🇷 מיטב תחנות הרדיו מיוון'}
              {activeTab === 'israel' && '🇮🇱 תחנות הרדיו המובילות בישראל'}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium mt-0.5">
              {activeTab === 'favorites' && 'לחץ על כל תחנה להאזנה מיידית ללא המתנה'}
              {activeTab === 'greece' && 'התחנות האהובות מיוון עם שמות ברורים בעברית'}
              {activeTab === 'israel' && 'חדשות, אקטואליה ומוזיקה ישראלית איכותית'}
            </p>
          </div>

          {isLoadingStations && (
            <div className="text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-400/30 flex items-center gap-1.5 animate-pulse">
              מעדכן תחנות...
            </div>
          )}
        </div>

        {/* Empty State for Favorites */}
        {activeTab === 'favorites' && displayedStations.length === 0 ? (
          <div className="bg-[#1E293B] border-2 border-dashed border-slate-600 rounded-3xl p-8 text-center my-6 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Radio size={44} />
            </div>
            <h3 className="text-2xl font-bold text-white">אין תחנות ברשימת המועדפים</h3>
            <p className="text-lg text-slate-300 max-w-md">
              תוכל לסמן כל תחנה באמצעות הכוכב כדי שתוצג כאן, או לשחזר את התחנות המובילות בלחיצה אחת:
            </p>
            <button
              onClick={restoreDefaultFavorites}
              className="min-h-[64px] px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw size={26} strokeWidth={2.5} />
              שחזר תחנות נבחרות
            </button>
          </div>
        ) : (
          /* Station Grid: 1 column on mobile, 2 columns on tablet/desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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

      {/* Persistent Giant Bottom Player (Height 125px) */}
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
