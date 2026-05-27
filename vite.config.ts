import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

const appVersion = readFileSync('./VERSION', 'utf-8').trim()

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_APP_BASE ?? './',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
})
