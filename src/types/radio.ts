export type StationCountry = 'IL' | 'GR';

export type IsraelCategory = 'all' | 'news' | 'mediterranean' | 'israeli_music';
export type GreeceCategory = 'all' | 'laika' | 'hits' | 'classics';

export type ActiveTab = 'favorites' | 'greece' | 'israel';

export interface Station {
  id: string;
  name: string;
  originalName?: string;
  subtitle: string;
  streamUrl: string;
  backupStreamUrl?: string;
  country: StationCountry;
  category: string;
  favicon?: string;
  isCurated?: boolean;
  clickcount?: number;
  isHls?: boolean;
}

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
