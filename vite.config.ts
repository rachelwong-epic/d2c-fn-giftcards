import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site: https://<user>.github.io/d2c-fn-giftcards/
  base: '/d2c-fn-giftcards/',
  plugins: [react(), tailwindcss()],
  preview: {
    // Allow Cloudflare Tunnel / other share hosts to hit vite preview
    allowedHosts: true,
  },
})
