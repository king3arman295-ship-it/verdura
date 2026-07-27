import { useEffect, useState, useMemo } from 'react'
import { Leaf, Search, X, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getCache, setCache } from '../lib/cache'
import type { Product } from '../lib/types'
import ProductCard from '../components/ProductCard'
import { ShopGridSkeleton } from '../components/Skeletons'

const CACHE_KEY = 'products_list'

const categories = [
  'All',
  'Drops',
  'Pellets',
  'Organic',
  'Immunity',
  'Stress & Calm',
  'Skin & Beauty',
  'Highest Rated',
]

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, rating, created_at, updated_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export default function ShopPage() {
  // Initialise with cached data immediately — zero perceived delay on revisit
  const [products, setProducts] = useState<Product[]>(() => getCache<Product[]>(CACHE_KEY) ?? [])
  // Only show skeleton on first load (no cache hit)
  const [loading, setLoading] = useState(() => !getCache<Product[]>(CACHE_KEY))
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    let cancelled = false

    async function load(isBackground: boolean) {
      try {
        const data = await fetchProducts()
        if (cancelled) return
        setProducts(data)
        setCache(CACHE_KEY, data)
      } catch (err: unknown) {
        if (cancelled) return
        // Only surface error if we have nothing to show
        if (!isBackground) setError((err as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const cached = getCache<Product[]>(CACHE_KEY)
    if (cached) {
      // Show stale data immediately, refresh silently in the background
      setProducts(cached)
      setLoading(false)
      load(true)
    } else {
      load(false)
    }

    return () => { cancelled = true }
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const textToSearch = `${p.name} ${p.description}`.toLowerCase()
      const matchesSearch = textToSearch.includes(searchQuery.toLowerCase())
      if (selectedCategory === 'All') return matchesSearch
      if (selectedCategory === 'Highest Rated') return matchesSearch && (p.rating ?? 0) >= 4
      return matchesSearch && textToSearch.includes(selectedCategory.toLowerCase())
    })
  }, [products, searchQuery, selectedCategory])

  return (
    <div className="animate-fade-up">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sage-100/70 via-sage-50 to-cream-50 py-12 border-b border-sage-200/60">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sage-200/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sage-800">
            <Leaf className="h-3.5 w-3.5" /> Verdura Organic Store
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-sage-950 sm:text-4xl">
            Explore Pure Homeopathic Remedies
          </h1>
          <p className="mt-2 max-w-2xl text-base text-ink-600">
            Browse our complete selection of potentized remedies. Search by symptom or name, select categories, check reviews, and order directly on WhatsApp.
          </p>

          {/* Search Bar & Category Filters */}
          <div className="mt-8 space-y-4">
            <div className="relative max-w-2xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search remedies by name, category (Drops, Pellets), or health need…"
                className="w-full rounded-full border border-sage-300/80 bg-cream-50 pl-11 pr-10 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 focus:outline-none shadow-sm transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-400 hover:text-ink-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-sage-800 mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter by:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-sage-800 text-cream-50 shadow-sm font-semibold'
                      : 'bg-cream-100 text-sage-800 hover:bg-sage-100 border border-sage-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Remedies Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold text-sage-900">
              Available Remedies
            </h2>
            {(searchQuery || selectedCategory !== 'All') && (
              <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-800">
                Filtered
              </span>
            )}
          </div>
          {!loading && (
            <span className="text-sm font-medium text-ink-500">
              Showing {filteredProducts.length} of {products.length} items
            </span>
          )}
        </div>

        {loading ? (
          <ShopGridSkeleton count={8} />
        ) : error ? (
          <div className="card p-8 text-center text-red-600">
            Couldn't load products: {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-12 text-center text-ink-400">
            <Leaf className="h-10 w-10 text-sage-400" />
            <p className="text-base font-medium text-sage-900">No remedies found</p>
            <p className="text-sm max-w-md text-ink-500">
              {searchQuery
                ? `We couldn't find any remedies matching "${searchQuery}".`
                : `No remedies currently listed under "${selectedCategory}".`}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}
                className="mt-2 btn-ghost text-xs py-2 px-4"
              >
                Clear Filters & Reset
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
