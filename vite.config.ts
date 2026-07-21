import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site: https://<user>.github.io/fortnite-gift-cards/
  base: '/fortnite-gift-cards/',
  plugins: [react(), tailwindcss()],
  preview: {
    // Allow Cloudflare Tunnel / other share hosts to hit vite preview
    allowedHosts: true,
  },
})
