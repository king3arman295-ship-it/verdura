/**
 * Simple in-memory cache with TTL.
 * Lives at module scope so it persists across React re-renders and route changes.
 * Cache is invalidated after TTL_MS or when invalidateCache() is called explicitly.
 */

const TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  at: number
}

const store = new Map<string, CacheEntry<unknown>>()

export function getCache<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() - entry.at > TTL_MS) {
    store.delete(key)
    return null
  }
  return entry.data
}

export function setCache<T>(key: string, data: T): void {
  store.set(key, { data, at: Date.now() })
}

export function invalidateCache(key: string): void {
  store.delete(key)
}

export function invalidateAll(): void {
  store.clear()
}
