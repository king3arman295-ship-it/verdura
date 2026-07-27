import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
      <Leaf className="h-12 w-12 text-sage-500" />
      <h2 className="font-display text-2xl font-semibold text-sage-900">Page not found</h2>
      <p className="text-ink-500">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn-primary">Back to remedies</Link>
    </div>
  )
}
