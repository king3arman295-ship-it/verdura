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

  // comment form
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
        `Hi, I am interested in buying ${product.name} for ${formatPrice(product.price)}. Is it available?`,
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
    // refresh cached rating from DB
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
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-sage-700 hover:text-sage-900">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div className="flex flex-col">
          {product.description.match(/^\[Category:\s*([^\]]+)\]\s*/) && (
            <span className="inline-flex items-center gap-1 self-start rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-800 mb-2">
              Category: {product.description.match(/^\[Category:\s*([^\]]+)\]\s*/)?.[1]}
            </span>
          )}
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
          <p className="mt-5 leading-relaxed text-ink-600">
            {product.description.replace(/^\[Category:\s*[^\]]+\]\s*/, '')}
          </p>

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
