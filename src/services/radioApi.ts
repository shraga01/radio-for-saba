import type { Station, StationCountry } from '../types/radio';
import { CURATED_ISRAEL_STATIONS, CURATED_GREECE_STATIONS } from '../data/curatedStations';

const API_SERVERS = [
  'https://de1.api.radio-browser.info',
  'https://fi1.api.radio-browser.info',
  'https://at1.api.radio-browser.info'
];

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

interface CacheEnvelope {
  timestamp: number;
  data: Station[];
}

interface RadioBrowserStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  countrycode: string;
  codec: string;
  bitrate: number;
  hls: number;
  clickcount: number;
}

// Map tags or name to relevant category
function determineCategory(tags: string, name: string, country: StationCountry): string {
  const text = (tags + ' ' + name).toLowerCase();
  
  if (country === 'IL') {
    if (text.includes('news') || text.includes('חדשות') || text.includes('talk') || text.includes('אקטואליה')) {
      return 'news';
    }
    if (text.includes('oriental') || text.includes('mizrahi') || text.includes('ים תיכוני') || text.includes('מזרחית') || text.includes('greek')) {
      return 'mediterranean';
    }
    return 'israeli_music';
  } else {
    // GR
    if (text.includes('laika') || text.includes('laiko') || text.includes('λαϊκά') || text.includes('folk') || text.includes('rebetiko') || text.includes('ρεμπέτικα')) {
      return 'laika';
    }
    if (text.includes('pop') || text.includes('hits') || text.includes('top 40') || text.includes('dance') || text.includes('mainstream')) {
      return 'hits';
    }
    if (text.includes('entechno') || text.includes('έντεχνο') || text.includes('classic') || text.includes('oldies') || text.includes('retro') || text.includes('ballads')) {
      return 'classics';
    }
    return 'hits';
  }
}

// Generate friendly subtitle for dynamic API stations
function generateSubtitle(station: RadioBrowserStation, country: StationCountry): string {
  const tags = station.tags
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0 && !t.includes('http') && t !== 'ilstations');

  if (tags.length > 0) {
    return tags.slice(0, 3).join(', ');
  }

  if (country === 'IL') {
    return 'תחנת רדיו ישראלית פופולרית';
  }
  return 'רדיו יווני פופולרי';
}

// Check if a station is already present in curated list to prevent duplicates
function isDuplicate(apiStation: RadioBrowserStation, curatedList: Station[]): boolean {
  const normApiName = apiStation.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const apiUrl = (apiStation.url_resolved || apiStation.url || '').toLowerCase();

  for (const c of curatedList) {
    const cUrl = c.streamUrl.toLowerCase();
    if (apiUrl && cUrl && (apiUrl === cUrl || (cUrl.length > 15 && apiUrl.includes(cUrl.slice(-15))))) {
      return true;
    }
    const normCuratedName = (c.originalName || c.name).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normApiName && normCuratedName && (normApiName === normCuratedName || normApiName.includes(normCuratedName) || normCuratedName.includes(normApiName))) {
      return true;
    }
  }
  return false;
}

// Fetch with mirror fallback
async function fetchStationsFromMirrors(countryCode: StationCountry): Promise<RadioBrowserStation[]> {
  for (const server of API_SERVERS) {
    try {
      const url = `${server}/json/stations/search?countrycode=${countryCode}&hidebroken=true&order=clickcount&reverse=true&limit=50`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data: RadioBrowserStation[] = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Try next mirror server silently
      continue;
    }
  }
  throw new Error(`Could not fetch stations for ${countryCode} from any mirror.`);
}

export async function getStations(country: StationCountry): Promise<Station[]> {
  const cacheKey = `PAPAS_RADIO_STATIONS_${country}_V2`;
  const curated = country === 'IL' ? CURATED_ISRAEL_STATIONS : CURATED_GREECE_STATIONS;

  // 1. Check local storage cache
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cache: CacheEnvelope = JSON.parse(cachedStr);
      const isFresh = Date.now() - cache.timestamp < CACHE_TTL_MS;
      if (isFresh && Array.isArray(cache.data) && cache.data.length > 0) {
        return cache.data;
      }
    }
  } catch {
    // Ignore cache read errors
  }

  // 2. Fetch fresh stations from API
  try {
    const apiStations = await fetchStationsFromMirrors(country);

    // Transform API stations, filtering out duplicates of curated ones
    const supplementalStations: Station[] = [];

    for (const s of apiStations) {
      const streamUrl = s.url_resolved || s.url;
      if (!streamUrl) continue;
      if (isDuplicate(s, curated)) continue;

      const isHls = s.hls === 1 || streamUrl.includes('.m3u8');

      supplementalStations.push({
        id: `rb-${s.stationuuid}`,
        name: s.name.trim(),
        originalName: s.name.trim(),
        subtitle: generateSubtitle(s, country),
        streamUrl: streamUrl,
        country: country,
        category: determineCategory(s.tags, s.name, country),
        favicon: s.favicon || undefined,
        isCurated: false,
        clickcount: s.clickcount,
        isHls
      });
    }

    // Curated stations always lead the list
    const combinedStations = [...curated, ...supplementalStations];

    // Cache to localStorage
    try {
      const envelope: CacheEnvelope = {
        timestamp: Date.now(),
        data: combinedStations
      };
      localStorage.setItem(cacheKey, JSON.stringify(envelope));
    } catch {
      // Storage quota or private mode
    }

    return combinedStations;
  } catch (error) {
    console.warn(`Fallback to curated stations for ${country}:`, error);

    // If cache has older data, use it as offline fallback
    try {
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        const cache: CacheEnvelope = JSON.parse(cachedStr);
        if (Array.isArray(cache.data) && cache.data.length > 0) {
          return cache.data;
        }
      }
    } catch {
      // Ignore
    }

    // Default guaranteed offline fallback: Return Curated list
    return curated;
  }
}
