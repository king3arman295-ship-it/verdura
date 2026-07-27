# Verdura — Homeopathic Remedies storefront
# Run this script in PowerShell to recreate the complete project folder structure.
# Usage:  powershell -ExecutionPolicy Bypass -File create-verdura.ps1
# Then:   npm install  ;  npm run dev

$ErrorActionPreference = 'Stop'
$root = Read-Host "Output folder path (e.g. .\verdura)"
if ([string]::IsNullOrWhiteSpace($root)) { $root = ".\verdura" }
New-Item -ItemType Directory -Force -Path $root | Out-Null
Set-Location $root

function Write-File($path, $content) {
  $dir = Split-Path -Parent $path
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Set-Content -Path $path -Value $content -NoNewline -Encoding UTF8
}

# ---------------------------------------------------------------------------
# package.json
# ---------------------------------------------------------------------------
Write-File "package.json" @'
{
  "name": "shopwave",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.4",
    "lucide-react": "^0.451.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.2",
    "vite": "^5.4.8"
  }
}
'@

# ---------------------------------------------------------------------------
# vite.config.ts
# ---------------------------------------------------------------------------
Write-File "vite.config.ts" @'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
})
'@

# ---------------------------------------------------------------------------
# tsconfig.json
# ---------------------------------------------------------------------------
Write-File "tsconfig.json" @'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "vite-env.d.ts"]
}
'@

# ---------------------------------------------------------------------------
# postcss.config.js
# ---------------------------------------------------------------------------
Write-File "postcss.config.js" @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@

# ---------------------------------------------------------------------------
# tailwind.config.js
# ---------------------------------------------------------------------------
Write-File "tailwind.config.js" @'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', '"Source Sans 3"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        sage: {
          50: '#f4f8f4', 100: '#e6f0e4', 200: '#cfe0cb', 300: '#adc7a6',
          400: '#84a87b', 500: '#658d5e', 600: '#4e7149', 700: '#3f5a3b',
          800: '#344931', 900: '#2c3d2a', 950: '#16221a',
        },
        clay: {
          50: '#fbf6f0', 100: '#f4e8d8', 200: '#e9d0b3', 300: '#dab285',
          400: '#c8905a', 500: '#b5763f', 600: '#9c5d33', 700: '#7e492b',
          800: '#673c27', 900: '#563322', 950: '#2e1a12',
        },
        cream: {
          50: '#fdfbf6', 100: '#f8f3e9', 200: '#f1e8d4', 300: '#e6d7b8',
          400: '#d6c094', 500: '#c4a873',
        },
        ink: {
          50: '#f6f6f4', 100: '#ececea', 200: '#d5d5d0', 300: '#b1b1a9',
          400: '#86867c', 500: '#64645b', 600: '#4e4e47', 700: '#40403a',
          800: '#373732', 900: '#1f1f1c', 950: '#131310',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(40,50,30,0.04), 0 8px 24px rgba(40,50,30,0.06)',
        pop: '0 10px 40px rgba(40,50,30,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { 'fade-up': 'fade-up 0.4s ease-out both' },
    },
  },
  plugins: [],
}
'@

# ---------------------------------------------------------------------------
# vite-env.d.ts
# ---------------------------------------------------------------------------
Write-File "vite-env.d.ts" @'
/// <reference types="vite/client" />
'@

# ---------------------------------------------------------------------------
# index.html
# ---------------------------------------------------------------------------
Write-File "index.html" @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <title>Verdura — Homeopathic Remedies</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@

# ---------------------------------------------------------------------------
# public/favicon.svg
# ---------------------------------------------------------------------------
Write-File "public/favicon.svg" @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#3f5a3b"/><path d="M16 7c-4 4-6 7-6 11a6 6 0 0 0 12 0c0-4-2-7-6-11z" fill="none" stroke="#adc7a6" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 13v8M13 17h6" stroke="#adc7a6" stroke-width="1.4" stroke-linecap="round"/></svg>
'@

# ---------------------------------------------------------------------------
# .gitkeep
# ---------------------------------------------------------------------------
Write-File ".gitkeep" @'

'@

# ---------------------------------------------------------------------------
# .env.example  (fill in your own Supabase credentials and copy to .env)
# ---------------------------------------------------------------------------
Write-File ".env.example" @'
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WHATSAPP_NUMBER=1234567890
VITE_ADMIN_PASSWORD=admin123
'@

# ---------------------------------------------------------------------------
# src/index.css
# ---------------------------------------------------------------------------
Write-File "src/index.css" @'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { -webkit-font-smoothing: antialiased; }
  body { @apply bg-cream-50 text-ink-900 font-sans; }
  ::selection { @apply bg-sage-200 text-sage-900; }
}

@layer components {
  .btn { @apply inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none; }
  .btn-primary { @apply btn bg-sage-600 text-cream-50 hover:bg-sage-700 active:scale-[0.98] shadow-sm; }
  .btn-ghost { @apply btn bg-cream-50 text-sage-800 border border-sage-200 hover:bg-sage-50; }
  .btn-danger { @apply btn bg-red-50 text-red-600 border border-red-200 hover:bg-red-100; }
  .input { @apply w-full rounded-xl border border-sage-200 bg-cream-50 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-sage-400 focus:ring-2 focus:ring-sage-100 focus:outline-none transition; }
  .label { @apply block text-sm font-medium text-sage-800 mb-1.5; }
  .card { @apply rounded-2xl bg-cream-50 border border-sage-100 shadow-card; }
}
'@

# ---------------------------------------------------------------------------
# src/main.tsx
# ---------------------------------------------------------------------------
Write-File "src/main.tsx" @'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2600,
          style: {
            borderRadius: '9999px',
            background: '#2c3d2a',
            color: '#fdfbf6',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#adc7a6', secondary: '#fdfbf6' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fdfbf6' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
'@

# ---------------------------------------------------------------------------
# src/App.tsx
# ---------------------------------------------------------------------------
Write-File "src/App.tsx" @'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="border-t border-sage-100 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-ink-500">
          Verdura &copy; {new Date().getFullYear()} — Mindfully prepared homeopathic remedies.
        </div>
      </footer>
    </div>
  )
}
'@

# ---------------------------------------------------------------------------
# src/lib/supabase.ts
# ---------------------------------------------------------------------------
Write-File "src/lib/supabase.ts" @'
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
})

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '1234567890'
'@

# ---------------------------------------------------------------------------
# src/lib/types.ts
# ---------------------------------------------------------------------------
Write-File "src/lib/types.ts" @'
export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  rating: number | null
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  product_id: string
  author_name: string
  content: string
  rating: number
  created_at: string
}

export type ProductWithStats = Product & {
  comment_count: number
}

export const formatPrice = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
'@

# ---------------------------------------------------------------------------
# src/components/Navbar.tsx
# ---------------------------------------------------------------------------
Write-File "src/components/Navbar.tsx" @'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <header className="sticky top-0 z-40 border-b border-sage-100 bg-cream-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-600 text-cream-50 shadow-sm transition group-hover:bg-sage-700">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-sage-900">
            Verdura
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              !isAdmin ? 'text-sage-800 bg-sage-100' : 'text-ink-500 hover:text-sage-800 hover:bg-sage-50'
            }`}
          >
            Remedies
          </Link>
          <Link
            to="/admin"
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
              isAdmin ? 'text-sage-800 bg-sage-100' : 'text-ink-500 hover:text-sage-800 hover:bg-sage-50'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
'@

# ---------------------------------------------------------------------------
# src/components/ProductCard.tsx
# ---------------------------------------------------------------------------
Write-File "src/components/ProductCard.tsx" @'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { Product } from '../lib/types'
import { formatPrice } from '../lib/types'

export default function ProductCard({ product }: { product: Product }) {
  const rating = product.rating ?? 0
  return (
    <Link
      to={`/product/${product.id}`}
      className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
    >
      <div className="aspect-[4/3] overflow-hidden bg-sage-100">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-sage-900 line-clamp-1">{product.name}</h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="text-sm text-ink-500">
            {rating > 0 ? rating.toFixed(1) : 'No ratings'}
          </span>
        </div>
        <p className="mt-2 font-display text-lg font-semibold text-clay-600">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
'@

# ---------------------------------------------------------------------------
# src/components/StarRating.tsx
# ---------------------------------------------------------------------------
Write-File "src/components/StarRating.tsx" @'
import { useState } from 'react'
import { Star } from 'lucide-react'

type Props = {
  value: number | null | undefined
  size?: number
  className?: string
}

export default function StarRating({ value, size = 16, className = '' }: Props) {
  const v = value ?? 0
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`Rated ${v} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(v)
        return (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={filled ? 'fill-amber-500 text-amber-500' : 'fill-stone-200 text-stone-300'}
          />
        )
      })}
    </div>
  )
}

type SelectorProps = {
  value: number
  onChange: (v: number) => void
  size?: number
  className?: string
}

export function StarRatingSelector({ value, onChange, size = 28, className = '' }: SelectorProps) {
  const [hover, setHover] = useState<number | null>(null)
  const active = hover ?? value
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= active
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
          >
            <Star
              style={{ width: size, height: size }}
              className={filled ? 'fill-amber-500 text-amber-500' : 'fill-stone-200 text-stone-300'}
            />
          </button>
        )
      })}
      <span className="ml-2 text-sm text-stone-500">{value}/5</span>
    </div>
  )
}
'@

# ---------------------------------------------------------------------------
# src/components/Loading.tsx
# ---------------------------------------------------------------------------
Write-File "src/components/Loading.tsx" @'
export default function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-sage-500" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
'@

# ---------------------------------------------------------------------------
# src/components/ErrorState.tsx
# ---------------------------------------------------------------------------
Write-File "src/components/ErrorState.tsx" @'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ErrorState({
  title = 'Something went wrong',
  message,
}: {
  title?: string
  message?: string
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
      <h2 className="font-display text-2xl font-semibold text-sage-900">{title}</h2>
      {message && <p className="text-ink-500">{message}</p>}
      <Link to="/" className="btn-primary">
        <ArrowLeft className="h-4 w-4" /> Back to remedies
      </Link>
    </div>
  )
}
'@

# ---------------------------------------------------------------------------
# src/pages/ShopPage.tsx
# ---------------------------------------------------------------------------
Write-File "src/pages/ShopPage.tsx" @'
import { useEffect, useState } from 'react'
import { Leaf } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (error) {
        setError(error.message)
      } else {
        setProducts(data ?? [])
      }
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-sage-50 to-cream-50">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sage-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-20 h-56 w-56 rounded-full bg-cream-200/70 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sage-700">
            <Leaf className="h-3.5 w-3.5" /> Pure & natural remedies
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-sage-900 sm:text-5xl">
            Gentle homeopathic care, mindfully prepared.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-600">
            Explore our curated range of homeopathic remedies and wellness
            essentials. Read what others experienced, and reach out to order
            in one tap via WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-sage-900">Our remedies</h2>
          <span className="text-sm text-ink-400">{products.length} items</span>
        </div>

        {loading ? (
          <Loading label="Loading remedies…" />
        ) : error ? (
          <div className="card p-8 text-center text-red-600">
            Couldn't load products: {error}
          </div>
        ) : products.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-12 text-center text-ink-400">
            <Leaf className="h-10 w-10" />
            <p>No remedies listed yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
'@

# ---------------------------------------------------------------------------
# src/pages/ProductDetailPage.tsx
# ---------------------------------------------------------------------------
Write-File "src/pages/ProductDetailPage.tsx" @'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, MessageSquare, Send, MessageCircle } from 'lucide-react'
import { supabase, WHATSAPP_NUMBER } from '../lib/supabase'
import type { Comment, Product } from '../lib/types'
import { formatPrice } from '../lib/types'
import StarRating, { StarRatingSelector } from '../components/StarRating'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const [prodRes, comRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).maybeSingle(),
        supabase
          .from('comments')
          .select('*')
          .eq('product_id', id)
          .order('created_at', { ascending: false }),
      ])
      if (cancelled) return
      if (prodRes.error) {
        setError(prodRes.error.message)
      } else if (!prodRes.data) {
        setError('Product not found.')
      } else {
        setProduct(prodRes.data)
      }
      if (!comRes.error) setComments(comRes.data ?? [])
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [id])

  const buyUrl = product
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hi, I am interested in buying ${product.name} for $${product.price.toFixed(2)}. Is it available?`,
      )}`
    : '#'

  async function submitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    if (!author.trim() || !content.trim()) {
      toast.error('Please add your name and a comment.')
      return
    }
    setSubmitting(true)
    const { data, error } = await supabase
      .from('comments')
      .insert({
        product_id: product.id,
        author_name: author.trim(),
        content: content.trim(),
        rating,
      })
      .select()
      .single()
    setSubmitting(false)
    if (error || !data) {
      toast.error(error?.message ?? 'Could not submit comment.')
      return
    }
    setComments((c) => [data, ...c])
    const { data: refreshed } = await supabase
      .from('products')
      .select('rating')
      .eq('id', product.id)
      .maybeSingle()
    if (refreshed) setProduct({ ...product, rating: refreshed.rating })
    setAuthor('')
    setContent('')
    setRating(5)
    toast.success('Comment submitted!')
  }

  if (loading) return <Loading label="Loading product…" />
  if (error || !product) return <ErrorState message={error ?? undefined} />

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-up">
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-sage-700 hover:text-sage-900">
        <ArrowLeft className="h-4 w-4" /> Back to remedies
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-semibold text-sage-900">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.rating} size={20} />
            <span className="text-sm text-ink-500">
              {product.rating ? `${product.rating.toFixed(1)} average` : 'No ratings yet'}
            </span>
          </div>
          <p className="mt-5 font-display text-3xl font-semibold text-clay-600">
            {formatPrice(product.price)}
          </p>
          <p className="mt-5 leading-relaxed text-ink-600">{product.description}</p>

          <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="mt-8 btn-primary w-full py-3.5 text-base">
            <MessageCircle className="h-5 w-5" /> Order on WhatsApp
          </a>
          <p className="mt-2 text-center text-xs text-ink-400">
            Opens WhatsApp with a pre-filled message for the practitioner.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-semibold text-sage-900">
          <MessageSquare className="h-6 w-6 text-sage-600" /> Experiences ({comments.length})
        </h2>

        <form onSubmit={submitComment} className="card mb-8 p-6">
          <h3 className="mb-4 font-display font-semibold text-sage-900">Share your experience</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Your name</label>
              <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="label">Rating</label>
              <StarRatingSelector value={rating} onChange={setRating} className="py-2.5" />
            </div>
          </div>
          <div className="mt-4">
            <label className="label">Comment</label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this remedy…"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-4">
            <Send className="h-4 w-4" /> {submitting ? 'Submitting…' : 'Submit experience'}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-ink-400">No reviews yet. Be the first to share your thoughts.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-sage-900">{c.author_name}</span>
                  <StarRating value={c.rating} size={14} />
                </div>
                <p className="mt-2 text-ink-600">{c.content}</p>
                <p className="mt-2 text-xs text-ink-400">
                  {new Date(c.created_at).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
'@

# ---------------------------------------------------------------------------
# src/pages/AdminPage.tsx
# ---------------------------------------------------------------------------
Write-File "src/pages/AdminPage.tsx" @'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LogOut, Lock, Plus, Pencil, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { formatPrice } from '../lib/types'
import StarRating from '../components/StarRating'
import Loading from '../components/Loading'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin123'
const SESSION_KEY = 'shopwave_admin_session'

type Draft = {
  name: string
  description: string
  price: string
  image_url: string
}

const emptyDraft: Draft = { name: '', description: '', price: '', image_url: '' }

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthed(true)
      setPw('')
      setPwError(false)
      toast.success('Welcome back, admin.')
    } else {
      setPwError(true)
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) toast.error(error.message)
    else setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (authed) loadProducts()
  }, [authed])

  function openCreate() {
    setEditing(null)
    setDraft(emptyDraft)
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setDraft({
      name: p.name,
      description: p.description,
      price: String(p.price),
      image_url: p.image_url,
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
    setDraft(emptyDraft)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const price = parseFloat(draft.price)
    if (!draft.name.trim() || isNaN(price) || price < 0 || !draft.image_url.trim()) {
      toast.error('Name, a valid price, and image URL are required.')
      return
    }
    setSaving(true)
    const payload = {
      name: draft.name.trim(),
      description: draft.description.trim(),
      price,
      image_url: draft.image_url.trim(),
    }
    let error: { message: string } | null = null
    if (editing) {
      const res = await supabase.from('products').update(payload).eq('id', editing.id).select().single()
      error = res.error
      if (!res.error && res.data) {
        setProducts((ps) => ps.map((p) => (p.id === editing.id ? res.data! : p)))
        toast.success('Product updated.')
      }
    } else {
      const res = await supabase.from('products').insert(payload).select().single()
      error = res.error
      if (!res.error && res.data) {
        setProducts((ps) => [res.data!, ...ps])
        toast.success('Product added.')
      }
    }
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    closeModal()
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    setDeletingId(p.id)
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    setDeletingId(null)
    if (error) {
      toast.error(error.message)
      return
    }
    setProducts((ps) => ps.filter((x) => x.id !== p.id))
    toast.success('Product deleted.')
  }

  if (!authed) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-600 text-cream-50 shadow-pop">
          <Lock className="h-7 w-7" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-sage-900">Admin access</h1>
          <p className="mt-1 text-sm text-ink-500">Enter the admin password to manage your remedies.</p>
        </div>
        <form onSubmit={login} className="w-full">
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(false) }}
            autoFocus
          />
          {pwError && <p className="mt-2 text-sm text-red-600">Incorrect password. Try again.</p>}
          <button type="submit" className="btn-primary mt-4 w-full">Unlock</button>
        </form>
        <p className="text-xs text-ink-400">
          Tip: set <code className="rounded bg-ink-100 px-1.5 py-0.5">VITE_ADMIN_PASSWORD</code> in your .env to change this.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-sage-900">Admin dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Manage your remedy catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openCreate} className="btn-primary">
            <Plus className="h-4 w-4" /> Add remedy
          </button>
          <button onClick={logout} className="btn-ghost">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {loading ? (
        <Loading label="Loading remedies…" />
      ) : products.length === 0 ? (
        <div className="card p-12 text-center text-ink-400">
          No remedies yet. Click "Add remedy" to create your first one.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sage-50 text-left text-xs uppercase tracking-wide text-sage-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Remedy</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-sage-50/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-sage-900">{p.name}</p>
                          <p className="line-clamp-1 max-w-xs text-ink-400">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-clay-600">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <StarRating value={p.rating} size={13} />
                        <span className="text-ink-400">{p.rating ? p.rating.toFixed(1) : '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-500">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="btn-ghost px-3 py-1.5">
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => remove(p)}
                          disabled={deletingId === p.id}
                          className="btn-danger px-3 py-1.5"
                        >
                          <Trash2 className="h-4 w-4" /> {deletingId === p.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg p-6 animate-fade-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-sage-900">
                {editing ? 'Edit remedy' : 'Add remedy'}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-1.5 text-ink-400 hover:bg-sage-100 hover:text-sage-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input min-h-[90px] resize-y"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Price (USD)</label>
                  <input
                    type="number" step="0.01" min="0" className="input"
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Image URL</label>
                  <input
                    className="input"
                    value={draft.image_url}
                    onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                    placeholder="https://…"
                  />
                </div>
              </div>
              {draft.image_url && (
                <img src={draft.image_url} alt="preview" className="h-32 w-full rounded-lg object-cover" />
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Create remedy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
'@

# ---------------------------------------------------------------------------
# src/pages/NotFoundPage.tsx
# ---------------------------------------------------------------------------
Write-File "src/pages/NotFoundPage.tsx" @'
import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
      <Leaf className="h-12 w-12 text-sage-500" />
      <h2 className="font-display text-2xl font-semibold text-sage-900">Page not found</h2>
      <p className="text-ink-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to remedies</Link>
    </div>
  )
}
'@

# ---------------------------------------------------------------------------
# supabase/migrations/20260725093551_create_products_and_comments.sql
# ---------------------------------------------------------------------------
Write-File "supabase/migrations/20260725093551_create_products_and_comments.sql" @'
/*
# Create products and comments tables for ShopWave storefront

## Overview
This migration sets up the core data model for a public e-commerce storefront
where any visitor can browse products and leave comments/ratings, and a store
owner manages inventory through a protected admin panel. There is no customer
sign-in, so the schema is single-tenant: the anon-key frontend reads and writes
directly, and admin access is gated by a hardcoded password in the app layer
(not by per-row ownership).

## 1. New Tables

### products
- id (uuid, primary key, auto-generated)
- name (text, not null) — product title
- description (text, not null) — long-form product details
- price (numeric(10,2), not null) — USD price, must be >= 0
- image_url (text, not null) — publicly accessible product image
- rating (numeric(2,1), nullable) — cached average rating (1 decimal),
  maintained by a trigger when comments are inserted/deleted. NULL means
  no ratings yet.
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now(), auto-updated by trigger)

### comments
- id (uuid, primary key, auto-generated)
- product_id (uuid, foreign key -> products.id ON DELETE CASCADE)
- author_name (text, not null) — name supplied by the commenter
- content (text, not null) — comment body
- rating (int, not null, CHECK 1..5) — star rating from 1 to 5
- created_at (timestamptz, default now())

## 2. Indexes
- comments_product_id_idx on comments(product_id) for fast per-product lookups
- products_created_at_desc_idx on products(created_at DESC) for shop listing

## 3. Triggers
- products_set_updated_at — sets updated_at = now() on every products UPDATE
- products_recompute_rating_on_comment — after INSERT/DELETE on comments,
  recomputes products.rating as the average of all comment ratings for that
  product (NULL if none remain). Keeps the storefront's average rating live
  without an extra query per product.

## 4. Security (RLS)
Both tables enable Row Level Security. Because this is a no-sign-in public
storefront, policies are scoped to TO anon, authenticated so the anon-key
client can operate:

- products: public SELECT; public INSERT/UPDATE/DELETE (admin edits via the
  same anon key — admin gating is enforced in the app UI by a password).
- comments: public SELECT (anyone can read); public INSERT (anyone can post);
  UPDATE/DELETE restricted to authenticated (admin moderation only).

The wide-open products policies are intentional for this MVP: the admin panel
is protected by a client-side password gate, and there is no per-user auth to
key ownership checks on. Documented here so the choice is explicit.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL DEFAULT '',
  rating numeric(2,1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_product_id_idx ON comments(product_id);
CREATE INDEX IF NOT EXISTS products_created_at_desc_idx ON products(created_at DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- products: public read, open write (admin via anon key + app-level password gate)
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_products" ON products;
CREATE POLICY "public_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_products" ON products;
CREATE POLICY "public_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_products" ON products;
CREATE POLICY "public_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

-- comments: public read + insert; admin (authenticated) can moderate
DROP POLICY IF EXISTS "public_read_comments" ON comments;
CREATE POLICY "public_read_comments" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_comments" ON comments;
CREATE POLICY "public_insert_comments" ON comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_comments" ON comments;
CREATE POLICY "auth_update_comments" ON comments FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_comments" ON comments;
CREATE POLICY "auth_delete_comments" ON comments FOR DELETE
  TO authenticated USING (true);

-- updated_at trigger for products
CREATE OR REPLACE FUNCTION products_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_set_updated_at ON products;
CREATE TRIGGER trg_products_set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_set_updated_at();

-- recompute products.rating when comments change
CREATE OR REPLACE FUNCTION recompute_product_rating()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  pid uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    pid := NEW.product_id;
  ELSE
    pid := OLD.product_id;
  END IF;

  UPDATE products
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1) FROM comments WHERE product_id = pid
  )
  WHERE id = pid;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_recompute_rating_insert ON comments;
CREATE TRIGGER trg_recompute_rating_insert
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION recompute_product_rating();

DROP TRIGGER IF EXISTS trg_recompute_rating_delete ON comments;
CREATE TRIGGER trg_recompute_rating_delete
  AFTER DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION recompute_product_rating();
'@

# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "Verdura project created at: $root" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Copy .env.example to .env and fill in your Supabase credentials"
Write-Host "  2. Run the SQL migration in supabase/migrations/ on your Supabase project"
Write-Host "  3. npm install"
Write-Host "  4. npm run dev"
Write-Host ""
