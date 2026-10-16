import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev serves the SAME handlers as Vercel functions (api/*.js) at /api/*,
// so `npm run dev` works with zero extra processes. Anything unmatched falls
// through to Vite. Dynamic segments ([id].js) are mapped explicitly below.
const ROUTES = [
  ['/api/health', './api/health.js'],
  ['/api/auth/signup', './api/auth/signup.js'],
  ['/api/auth/login', './api/auth/login.js'],
  ['/api/auth/logout', './api/auth/logout.js'],
  ['/api/auth/me', './api/auth/me.js'],
  ['/api/auth/reset-request', './api/auth/reset-request.js'],
  ['/api/auth/reset-confirm', './api/auth/reset-confirm.js'],
  ['/api/auth/password', './api/auth/password.js'],
  ['/api/profile', './api/profile.js'],
  ['/api/preferences', './api/preferences.js'],
  ['/api/exercises', './api/exercises.js'],
  ['/api/splits', './api/splits.js'],
  ['/api/splits/', './api/splits/[id].js'],
  ['/api/days', './api/days.js'],
  ['/api/selections', './api/selections.js'],
  ['/api/logs', './api/logs.js'],
  ['/api/logs/', './api/logs/[id].js'],
  ['/api/sessions', './api/sessions.js'],
  ['/api/leaderboard', './api/leaderboard.js'],
  ['/api/account', './api/account.js']
  ,['/api/admin/auth/login', './api/admin/auth/login.js']
  ,['/api/admin/auth/logout', './api/admin/auth/logout.js']
  ,['/api/admin/auth/session', './api/admin/auth/session.js']
  ,['/api/admin/dashboard', './api/admin/dashboard.js']
  ,['/api/admin/users', './api/admin/users.js']
  ,['/api/admin/users/', './api/admin/users/[id].js']
  ,['/api/admin/workouts', './api/admin/workouts.js']
  ,['/api/admin/muscles', './api/admin/muscles.js']
  ,['/api/admin/database', './api/admin/database.js']
  ,['/api/admin/audit-logs', './api/admin/audit-logs.js']
  ,['/api/admin/roles', './api/admin/roles.js']
]

function dynamisApi() {
  const cache = new Map()
  async function load(file) {
    if (!cache.has(file)) {
      const mod = await import(new URL(file, import.meta.url).href + `?t=${Date.now()}`);
      cache.set(file, mod.default)
      // Bust on file change (dev only).
      const { watch } = await import('node:fs')
      try {
        watch(file, () => cache.delete(file))
      } catch { /* ignore */ }
    }
    return cache.get(file)
  }
  return {
    name: 'dynamis-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = req.url || '/'
          const route = ROUTES.find(([prefix]) =>
            prefix.endsWith('/') ? url === prefix.slice(0, -1) || url.startsWith(prefix) : (url === prefix || url.startsWith(prefix + '?'))
          )
          if (!route) return next()
          const handler = await load(route[1])
          await handler(req, res)
          if (!res.writableEnded) next()
        } catch (e) {
          console.error('[dynamis-api]', req.url, e?.message || e)
          if (!res.writableEnded) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'API error. Try again.' }))
          }
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), dynamisApi()],
  server: { port: 5173 },
  build: { outDir: 'dist' }
})
