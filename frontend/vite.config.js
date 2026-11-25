import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const API_PROXY_PATHS = [
  '/api',
  '/simulate',
  '/simulate-grid',
  '/compare',
  '/undercut-analysis',
  '/fastf1',
  '/tracks',
  '/optimize',
  '/drivers',
  '/optimize-mcts',
  '/weather',
  '/replay',
  '/health',
]

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://127.0.0.1:8005'
  const port = Number(env.VITE_DEV_PORT || 3000)

  const proxy = Object.fromEntries(
    API_PROXY_PATHS.map((routePrefix) => [routePrefix, apiTarget])
  )

  return {
    plugins: [react()],
    server: {
      port,
      proxy,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            charts: ['recharts'],
            icons: ['lucide-react'],
          },
        },
      },
    },
  }
})
