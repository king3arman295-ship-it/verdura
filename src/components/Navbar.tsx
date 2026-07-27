import { Link, useLocation } from 'react-router-dom'
import { Leaf, ShieldCheck, ShoppingBag, Home, HeartHandshake } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const path = location.pathname

  const isHome = path === '/'
  const isShop = path.startsWith('/shop') || path.startsWith('/product')
  const isAdmin = path.startsWith('/admin')

  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/70 bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-600 text-cream-50 shadow-sm transition group-hover:bg-sage-700">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-sage-900">
            Verdura
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:text-sm font-medium transition ${
              isHome ? 'text-sage-900 bg-sage-100 font-semibold' : 'text-ink-600 hover:text-sage-900 hover:bg-sage-50'
            }`}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            to="/shop"
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:text-sm font-medium transition ${
              isShop ? 'text-sage-900 bg-sage-100 font-semibold' : 'text-ink-600 hover:text-sage-900 hover:bg-sage-50'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Shop Remedies
          </Link>

          <a
            href="/#about"
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:text-sm font-medium text-ink-600 hover:text-sage-900 hover:bg-sage-50 transition"
          >
            <HeartHandshake className="h-4 w-4" />
            About Us
          </a>

          {/* Only shown when user is explicitly on /admin route */}
          {isAdmin && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-300/60 ml-2">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
              Admin Portal
            </span>
          )}
        </nav>
      </div>
    </header>
  )
}
