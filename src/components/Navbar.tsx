import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, ShieldCheck, ShoppingBag, Home, HeartHandshake, Menu, X } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const path = location.pathname
  const [menuOpen, setMenuOpen] = useState(false)

  const isHome = path === '/'
  const isShop = path.startsWith('/shop') || path.startsWith('/product')
  const isAdmin = path.startsWith('/admin')

  function closeMenu() {
    setMenuOpen(false)
  }

  const linkClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:text-sm font-medium transition ${active ? 'text-sage-900 bg-sage-100 font-semibold' : 'text-ink-600 hover:text-sage-900 hover:bg-sage-50'
    }`

  const mobileLinkClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? 'text-sage-900 bg-sage-100 font-semibold' : 'text-ink-600 hover:text-sage-900 hover:bg-sage-50'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/70 bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-600 text-cream-50 shadow-sm transition group-hover:bg-sage-700">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-sage-900">
            Verdura
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
          <Link to="/" className={linkClass(isHome)}>
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link to="/shop" className={linkClass(isShop)}>
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

          {isAdmin && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-300/60 ml-2">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
              Admin Portal
            </span>
          )}
        </nav>

        {/* Mobile controls: admin badge (if applicable) + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          {isAdmin && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900 border border-amber-300/60">
              <ShieldCheck className="h-3 w-3 text-amber-700" />
              Admin
            </span>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-sage-900 hover:bg-sage-100 transition"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`sm:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${menuOpen ? 'max-h-64' : 'max-h-0'
          }`}
      >
        <nav className="flex flex-col gap-1 border-t border-sage-200/70 bg-cream-50 px-4 py-3">
          <Link to="/" className={mobileLinkClass(isHome)} onClick={closeMenu}>
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link to="/shop" className={mobileLinkClass(isShop)} onClick={closeMenu}>
            <ShoppingBag className="h-4 w-4" />
            Shop Remedies
          </Link>

          <a
            href="/#about"
            className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-ink-600 hover:text-sage-900 hover:bg-sage-50 transition"
            onClick={closeMenu}
          >
            <HeartHandshake className="h-4 w-4" />
            About Us
          </a>
        </nav>
      </div>
    </header>
  )
}
