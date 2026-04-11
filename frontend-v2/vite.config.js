import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/dermato-triage-cdss/',
  plugins: [react()],
  test: {
    environment: 'node',
    pool: 'threads',
    maxWorkers: 1,
    minWorkers: 1
  }
})
