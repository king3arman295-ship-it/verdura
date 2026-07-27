import { Link } from 'react-router-dom'
import { Star, MessageCircle, ArrowRight, Tag } from 'lucide-react'
import type { Product } from '../lib/types'
import { formatPrice } from '../lib/types'
import { WHATSAPP_NUMBER } from '../lib/env'

interface ProductCardProps {
  product: Product
  /** Set true for the first ~4 above-fold cards to load their images with high priority */
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const rating = product.rating ?? 0

  const buyUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I am interested in buying ${product.name} for ${formatPrice(product.price)}. Is it available?`,
  )}`

  // Extract category tag if present
  const catMatch = product.description.match(/^\[Category:\s*([^\]]+)\]\s*/)
  const categoryTag = catMatch ? catMatch[1] : null
  const cleanDescription = product.description.replace(/^\[Category:\s*[^\]]+\]\s*/, '')

  return (
    <div className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-pop border border-sage-200/80">
      <Link to={`/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-sage-100 block">
        <img
          src={product.image_url}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'low'}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full bg-cream-50/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-sage-900 shadow-sm">
          {formatPrice(product.price)}
        </div>
        {categoryTag && (
          <div className="absolute top-3 left-3 rounded-full bg-sage-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-cream-50 shadow-sm flex items-center gap-1">
            <Tag className="h-3 w-3 text-amber-400" />
            {categoryTag}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/product/${product.id}`} className="group-hover:text-sage-700 transition">
          <h3 className="font-display text-lg font-semibold text-sage-900 line-clamp-1">{product.name}</h3>
        </Link>

        <p className="mt-1 text-xs text-ink-500 line-clamp-2 leading-relaxed">
          {cleanDescription}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-sage-100 pt-3">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-medium text-ink-600">
              {rating > 0 ? `${rating.toFixed(1)} / 5.0` : 'No ratings yet'}
            </span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="text-xs font-semibold text-sage-700 hover:text-sage-900 flex items-center gap-0.5"
          >
            Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 pt-1">
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
