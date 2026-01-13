// Supabase Real-Time Client helper
// This module attempts to dynamically initialize Supabase clients when
// environment variables are present and the `@supabase/supabase-js` package
// is installed. If not configured, it exports safe placeholders so the app
// can still build and run locally.

import type { SupabaseClient } from '@supabase/supabase-js'
import { notifyContentCreated, notifyContentUpdated, notifyContentDeleted } from './realtime'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

let browserSupabase: SupabaseClient | null = null
let serverSupabase: SupabaseClient | null = null
let realtimeInitialized = false
const activeChannels: Array<{ name: string; unsubscribe: () => Promise<void> | void }> = []

// Try to lazily create clients. We use dynamic import so the project can
// compile even if the package isn't installed yet.
async function createClientsIfPossible() {
  if (!supabaseUrl) return

  if (browserSupabase && serverSupabase) return

  try {
    const mod = await import('@supabase/supabase-js')
    const { createClient } = mod

    if (!browserSupabase && supabaseAnonKey) {
      browserSupabase = createClient(supabaseUrl, supabaseAnonKey)
      console.info('ℹ️  Supabase browser client initialized')
    }

    if (!serverSupabase && supabaseServiceKey) {
      serverSupabase = createClient(supabaseUrl, supabaseServiceKey)
      console.info('ℹ️  Supabase server client initialized')
    }
  } catch (err) {
    // Package not installed or initialization failed; keep placeholders.
    console.info('ℹ️  Supabase client not initialized. Install @supabase/supabase-js to enable realtime forwarding.')
  }
}

// Lightweight helpers
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey))
}

// Public (browser) supabase client — may be null in server-only contexts
export async function getSupabaseBrowser(): Promise<SupabaseClient | null> {
  await createClientsIfPossible()
  return browserSupabase
}

// Server-side client for API routes. Throws if not configured.
export async function getSupabaseServer(): Promise<SupabaseClient> {
  await createClientsIfPossible()
  if (!serverSupabase) {
    throw new Error('Supabase server client not configured. Set SUPABASE_SERVICE_ROLE_KEY in env')
  }
  return serverSupabase
}

// Initialize realtime forwarding from Supabase to the local SSE broadcaster.
// The list of tables to monitor can be provided via SUPABASE_MONITORED_TABLES as
// a comma-separated list (e.g. "lessons,courses,projects"). If not set, no
// subscriptions are created.
export async function initRealtimeForwarding() {
  if (realtimeInitialized) return
  realtimeInitialized = true

  if (!supabaseUrl || !supabaseServiceKey) {
    console.info('ℹ️  Supabase realtime forwarding disabled (missing env vars)')
    return
  }

  await createClientsIfPossible()
  if (!serverSupabase) {
    console.info('ℹ️  Supabase server client not available; cannot init realtime forwarding')
    return
  }

  const tablesEnv = process.env.SUPABASE_MONITORED_TABLES || ''
  if (!tablesEnv) {
    console.info('ℹ️  SUPABASE_MONITORED_TABLES not set — skipping realtime table subscriptions')
    return
  }

  const tables = tablesEnv.split(',').map(t => t.trim()).filter(Boolean)
  if (tables.length === 0) return

  try {
    // Subscribe to each table for inserts/updates/deletes and forward events
    tables.forEach((table) => {
      // Supabase Realtime (postgres_changes) requires specifying schema and table
      // We'll subscribe to the public schema by default.
      const channel = (serverSupabase as any).channel(`realtime-forward-${table}`)

      channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload: any) => {
        notifyContentCreated(table, payload?.new?.title ?? `${table} created`, payload?.new?.id?.toString())
      })

      channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table }, (payload: any) => {
        notifyContentUpdated(table, payload?.new?.title ?? `${table} updated`, payload?.new?.id?.toString())
      })

      channel.on('postgres_changes', { event: 'DELETE', schema: 'public', table }, (payload: any) => {
        notifyContentDeleted(table, payload?.old?.title ?? `${table} deleted`, payload?.old?.id?.toString())
      })

      channel.subscribe()

      // Track channel for future cleanup
      activeChannels.push({
        name: `realtime-forward-${table}`,
        unsubscribe: async () => {
          try {
            await channel.unsubscribe?.()
          } catch {
            // ignore
          }
        }
      })

      console.info(`ℹ️  Subscribed to Supabase realtime for table: ${table}`)
    })
  } catch (err) {
    console.error('Failed to initialize Supabase realtime forwarding:', err)
  }
}

// Allow manual teardown of realtime channels (useful in dev HMR or server restarts)
export async function teardownRealtimeForwarding() {
  const tasks = activeChannels.splice(0).map(c => Promise.resolve(c.unsubscribe()))
  await Promise.allSettled(tasks)
  realtimeInitialized = false
  console.info('ℹ️  Supabase realtime forwarding torn down')
}

// Export a safe placeholder for modules that import `supabase` directly.
// Consumers should prefer `getSupabaseBrowser` / `getSupabaseServer`.
export const supabase = {
  // minimal stubs to avoid runtime errors in parts of the code that call `.from` etc.
  from: () => ({ select: async () => ({}), insert: async () => ({}), update: async () => ({}), delete: async () => ({}) }),
  auth: { getUser: async () => ({}) }
} as unknown as SupabaseClient
