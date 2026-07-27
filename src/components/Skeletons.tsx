/**
 * Skeleton placeholder components for loading states.
 * Using CSS pulse animation instead of a spinner gives dramatically better
 * perceived performance — users see the shape of content immediately.
 */

/** Single product card skeleton */
export function ProductCardSkeleton() {
  return (
    <div className="card flex flex-col overflow-hidden border border-sage-200/80 animate-pulse">
      {/* Image area */}
      <div className="aspect-[4/3] bg-sage-100" />
      {/* Content area */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <div className="h-5 w-3/4 rounded-full bg-sage-100" />
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full bg-sage-100" />
          <div className="h-3 w-5/6 rounded-full bg-sage-100" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-sage-100 pt-3">
          <div className="h-3 w-20 rounded-full bg-sage-100" />
          <div className="h-3 w-14 rounded-full bg-sage-100" />
        </div>
        <div className="h-9 w-full rounded-xl bg-sage-100 mt-1" />
      </div>
    </div>
  )
}

/** Grid of skeleton cards for the shop page */
export function ShopGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

/** Skeleton for the product detail page */
export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse">
      {/* Back link */}
      <div className="mb-6 h-4 w-28 rounded-full bg-sage-100" />
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="card aspect-square w-full bg-sage-100" />
        {/* Details */}
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 rounded-full bg-sage-100" />
          <div className="h-8 w-3/4 rounded-full bg-sage-100" />
          <div className="flex gap-2 mt-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 w-5 rounded bg-sage-100" />
            ))}
            <div className="h-4 w-24 rounded-full bg-sage-100" />
          </div>
          <div className="h-9 w-32 rounded-full bg-sage-100" />
          <div className="space-y-2 mt-2">
            <div className="h-3 w-full rounded-full bg-sage-100" />
            <div className="h-3 w-full rounded-full bg-sage-100" />
            <div className="h-3 w-4/5 rounded-full bg-sage-100" />
          </div>
          <div className="h-14 w-full rounded-2xl bg-sage-100 mt-4" />
        </div>
      </div>
    </div>
  )
}
