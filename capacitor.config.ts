import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.papasradio.app',
  appName: 'הרדיו של סבא יצחק',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  },
  server: {
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;
