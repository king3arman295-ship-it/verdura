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
