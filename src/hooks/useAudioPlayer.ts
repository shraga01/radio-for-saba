import { useState, useRef, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { MediaSession } from '@capgo/capacitor-media-session';
import type { Station, PlaybackState } from '../types/radio';

const MAX_AUTO_RETRIES = 2;
const STALL_TIMEOUT_MS = 7000;
const LAST_PLAYED_KEY = 'PAPAS_RADIO_LAST_PLAYED';

export function useAudioPlayer() {
  // Initialize from localStorage cleanly during first render
  const [currentStation, setCurrentStation] = useState<Station | null>(() => {
    try {
      const saved = localStorage.getItem(LAST_PLAYED_KEY);
      if (saved) {
        const parsed: Station = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const stallTimeoutRef = useRef<number | null>(null);
  const retryCountRef = useRef<number>(0);
  const currentStationRef = useRef<Station | null>(currentStation);

  useEffect(() => {
    currentStationRef.current = currentStation;
  }, [currentStation]);

  const clearStallTimer = useCallback(() => {
    if (stallTimeoutRef.current !== null) {
      window.clearTimeout(stallTimeoutRef.current);
      stallTimeoutRef.current = null;
    }
  }, []);

  const syncMediaSessionMetadata = useCallback(async (station: Station) => {
    const meta = {
      title: station.name,
      artist: station.subtitle,
      album: 'הרדיו של אבא'
    };

    if ('mediaSession' in navigator && window.MediaMetadata) {
      try {
        navigator.mediaSession.metadata = new window.MediaMetadata(meta);
      } catch {
        // Ignore
      }
    }

    try {
      await MediaSession.setMetadata(meta);
    } catch {
      // Not on native device or plugin not ready
    }
  }, []);

  const syncMediaSessionState = useCallback(async (state: 'playing' | 'paused' | 'none') => {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = state;
      } catch {
        // Ignore
      }
    }

    try {
      await MediaSession.setPlaybackState({ playbackState: state });
    } catch {
      // Ignore
    }
  }, []);

  const cleanupStreams = useCallback(() => {
    clearStallTimer();
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
  }, [clearStallTimer]);

  const handleStreamError = useCallback(() => {
    clearStallTimer();
    const station = currentStationRef.current;

    if (!station) {
      setPlaybackState('idle');
      return;
    }

    if (retryCountRef.current < MAX_AUTO_RETRIES) {
      retryCountRef.current += 1;
      setPlaybackState('loading');
      setErrorMessage(`טוען מחדש (ניסיון ${retryCountRef.current} מתוך ${MAX_AUTO_RETRIES})...`);

      const tryBackup = retryCountRef.current === 1 && !!station.backupStreamUrl;
      setTimeout(() => {
        startStream(station, tryBackup);
      }, 1000);
    } else {
      cleanupStreams();
      setPlaybackState('error');
      setErrorMessage('התחנה לא זמינה כרגע, בחר תחנה אחרת');
      syncMediaSessionState('none');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearStallTimer, cleanupStreams, syncMediaSessionState]);

  const startStallTimer = useCallback(() => {
    clearStallTimer();
    stallTimeoutRef.current = window.setTimeout(() => {
      handleStreamError();
    }, STALL_TIMEOUT_MS);
  }, [clearStallTimer, handleStreamError]);

  const startStream = useCallback(
    (station: Station, useBackup = false) => {
      cleanupStreams();
      const audio = audioRef.current;
      if (!audio) return;

      setPlaybackState('loading');
      setErrorMessage(null);
      startStallTimer();
      syncMediaSessionMetadata(station);

      const streamToPlay =
        useBackup && station.backupStreamUrl ? station.backupStreamUrl : station.streamUrl;
      const isHlsStream = station.isHls || streamToPlay.includes('.m3u8');

      if (isHlsStream && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60
        });
        hlsRef.current = hls;

        hls.loadSource(streamToPlay);
        hls.attachMedia(audio);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play().catch(handleStreamError);
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                handleStreamError();
                break;
            }
          }
        });
      } else {
        audio.src = streamToPlay;
        audio.load();
        audio.play().catch(handleStreamError);
      }
    },
    [cleanupStreams, startStallTimer, syncMediaSessionMetadata, handleStreamError]
  );

  const resume = useCallback(() => {
    if (audioRef.current && currentStationRef.current) {
      setPlaybackState('loading');
      audioRef.current.play().catch(handleStreamError);
    }
  }, [handleStreamError]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaybackState('paused');
      syncMediaSessionState('paused');
    }
  }, [syncMediaSessionState]);

  const stop = useCallback(() => {
    cleanupStreams();
    setPlaybackState('idle');
    setErrorMessage(null);
    syncMediaSessionState('none');
  }, [cleanupStreams, syncMediaSessionState]);

  const playStation = useCallback(
    (station: Station) => {
      if (currentStation?.id === station.id) {
        if (playbackState === 'playing') {
          pause();
        } else if (playbackState === 'paused') {
          resume();
        } else if (playbackState === 'error') {
          retryCountRef.current = 0;
          startStream(station);
        }
        return;
      }

      setCurrentStation(station);
      retryCountRef.current = 0;

      try {
        localStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(station));
      } catch {
        // Ignore
      }

      startStream(station);
    },
    [currentStation, playbackState, pause, resume, startStream]
  );

  const togglePlay = useCallback(() => {
    if (playbackState === 'playing') {
      pause();
    } else if (playbackState === 'paused') {
      resume();
    } else if (currentStation) {
      retryCountRef.current = 0;
      startStream(currentStation);
    }
  }, [playbackState, currentStation, pause, resume, startStream]);

  // Audio element setup and listener registration
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const onPlaying = () => {
      clearStallTimer();
      retryCountRef.current = 0;
      setPlaybackState('playing');
      setErrorMessage(null);
      syncMediaSessionState('playing');
    };

    const onPause = () => {
      if (audio.currentTime === 0 && audio.paused) {
        // Idle/stopped
      } else {
        setPlaybackState('paused');
        syncMediaSessionState('paused');
      }
    };

    const onWaiting = () => {
      setPlaybackState(prev => (prev === 'playing' ? 'loading' : prev));
      startStallTimer();
    };

    const onError = () => {
      handleStreamError();
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);

    // MediaSession action registrations
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', () => resume());
        navigator.mediaSession.setActionHandler('pause', () => pause());
        navigator.mediaSession.setActionHandler('stop', () => stop());
      } catch {
        // Ignore
      }
    }

    try {
      MediaSession.setActionHandler({ action: 'play' }, () => resume());
      MediaSession.setActionHandler({ action: 'pause' }, () => pause());
      MediaSession.setActionHandler({ action: 'stop' }, () => stop());
    } catch {
      // Ignore
    }

    return () => {
      clearStallTimer();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('error', onError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      audio.pause();
      audio.src = '';
    };
  }, [
    clearStallTimer,
    startStallTimer,
    syncMediaSessionState,
    handleStreamError,
    resume,
    pause,
    stop
  ]);

  return {
    currentStation,
    playbackState,
    errorMessage,
    playStation,
    togglePlay,
    stop,
    setCurrentStation
  };
}
