import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'AyuDee AI',
        short_name: 'AyuDee',
        description: 'AI-Powered Cognitive Care Platform',

        theme_color: '#0b3b63',
        background_color: '#ffffff',

        display: 'standalone',
        orientation: 'portrait',

        start_url: '/',
        scope: '/',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  server: {
    watch: {
      ignored: ['**/Ayudee-reference.jpg..jpeg']
    }
  }
})