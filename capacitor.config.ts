import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.papasradio.app',
  appName: 'הרדיו של אבא',
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
