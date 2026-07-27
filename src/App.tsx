import { Suspense, lazy } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import Navbar from './components/Navbar'
import Loading from './components/Loading'

const HomePage = lazy(() => import('./pages/HomePage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loading label="Loading…" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t border-sage-100 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-500">
          <div>
            Verdura &copy; {new Date().getFullYear()} — Mindfully prepared organic homeopathic remedies.
          </div>
          <Link
            to="/admin"
            className="text-ink-400 hover:text-sage-700 transition flex items-center gap-1 text-xs opacity-60 hover:opacity-100"
            title="Admin Portal"
          >
            <Lock className="h-3 w-3" />
            <span>Staff Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
