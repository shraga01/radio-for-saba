import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_FAVORITE_IDS } from '../data/curatedStations';

const FAVORITES_KEY = 'PAPAS_RADIO_FAVORITES_V2';
const OLD_FAVORITES_KEY = 'PAPAS_RADIO_FAVORITES_V1';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      // Check V2
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Check V1 migration
      const oldStored = localStorage.getItem(OLD_FAVORITES_KEY);
      if (oldStored) {
        const parsedOld = JSON.parse(oldStored);
        if (Array.isArray(parsedOld)) {
          // Replace skai with mousikos
          return parsedOld.map(id => (id === 'gr-skai' ? 'gr-mousikos' : id));
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_FAVORITE_IDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Storage quota or private mode
    }
  }, [favoriteIds]);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite
  };
}
