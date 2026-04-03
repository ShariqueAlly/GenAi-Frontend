import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'node:os'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: path.join(os.tmpdir(), 'genairesumebuilder-vite-cache'),
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
