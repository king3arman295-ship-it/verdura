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
