import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      injectRegister: 'auto',
      manifest: {
        name: 'Petrock',
        short_name: 'Petrock',
        description: 'AI supports your pet life.',
        theme_color: '#34DBFF',
        icons: [
          {
            src: '/petrock-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/petrock-512-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/petrock-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/petrock-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    tsconfigPaths(),
  ],
});
