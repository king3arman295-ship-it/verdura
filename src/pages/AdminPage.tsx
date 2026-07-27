import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { LogOut, Lock, Plus, Pencil, Trash2, X, Upload, Image as ImageIcon, Sparkles, Tag, MessageSquare, ChevronDown, ChevronUp, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product, Comment } from '../lib/types'
import { formatPrice } from '../lib/types'
import StarRating from '../components/StarRating'
import Loading from '../components/Loading'

export const CATEGORIES = [
  'Drops',
  'Pellets',
  'Organic',
  'Immunity',
  'Stress & Calm',
  'Skin & Beauty',
  'General',
] as const

type Draft = {
  name: string
  category: string
  description: string
  price: string
  image_url: string
}

const emptyDraft: Draft = {
  name: '',
  category: 'Drops',
  description: '',
  price: '',
  image_url: '',
}

export default function AdminPage() {
  // Auth state — driven by Supabase session (gives `authenticated` role in DB)
  const [authed, setAuthed] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Comments management
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [loadingComments, setLoadingComments] = useState<string | null>(null)
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check existing Supabase session on mount & listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (authed) loadProducts()
  }, [authed])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
    setLoggingIn(false)
    if (error) {
      setLoginError(error.message)
    } else {
      toast.success('Welcome back, admin.')
      setEmail('')
      setPw('')
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setProducts([])
    setComments({})
    setExpandedProductId(null)
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

  function openCreate() {
    setEditing(null)
    setDraft(emptyDraft)
    setImageMode('upload')
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)

    let category = 'General'
    let cleanDesc = p.description

    const match = p.description.match(/^\[Category:\s*([^\]]+)\]\s*/)
    if (match) {
      category = match[1]
      cleanDesc = p.description.replace(/^\[Category:\s*[^\]]+\]\s*/, '')
    } else {
      for (const cat of CATEGORIES) {
        if (p.description.toLowerCase().includes(cat.toLowerCase()) || p.name.toLowerCase().includes(cat.toLowerCase())) {
          category = cat
          break
        }
      }
    }

    setDraft({
      name: p.name,
      category,
      description: cleanDesc,
      price: String(p.price),
      image_url: p.image_url,
    })
    setImageMode(p.image_url.includes('/storage/v1/object/public/') || p.image_url.startsWith('data:') ? 'upload' : 'url')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
    setDraft(emptyDraft)
  }

  function handleDeviceFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_DIM = 800
        let width = img.width
        let height = img.height
        if (width > height) {
          if (width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM }
        } else {
          if (height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        // Upload the compressed image to Supabase Storage instead of
        // embedding it as base64 in the database row. Storing a short
        // public URL (instead of a 100-300KB text blob) keeps product
        // list queries small and lets the browser/CDN cache images
        // properly, instead of re-downloading them as JSON text on
        // every shop visit.
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              toast.error('Could not process image.')
              return
            }
            setUploadingImage(true)
            const path = `${crypto.randomUUID()}.jpg`
            const { error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })

            if (uploadError) {
              setUploadingImage(false)
              toast.error(`Upload failed: ${uploadError.message}`)
              return
            }

            const { data: publicUrlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(path)

            setDraft((d) => ({ ...d, image_url: publicUrlData.publicUrl }))
            setUploadingImage(false)
            toast.success('Image uploaded!')
          },
          'image/jpeg',
          0.85,
        )
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const price = parseFloat(draft.price)
    if (!draft.name.trim() || isNaN(price) || price < 0 || !draft.image_url.trim()) {
      toast.error('Name, a valid price, and an image (file or URL) are required.')
      return
    }
    setSaving(true)

    const categoryTag = `[Category: ${draft.category}]`
    const finalDescription = `${categoryTag} ${draft.description.trim()}`

    const payload = {
      name: draft.name.trim(),
      description: finalDescription,
      price,
      image_url: draft.image_url.trim(),
    }

    let error: { message: string } | null = null
    if (editing) {
      const res = await supabase.from('products').update(payload).eq('id', editing.id).select().single()
      error = res.error
      if (!res.error && res.data) {
        setProducts((ps) => ps.map((p) => (p.id === editing.id ? res.data! : p)))
        toast.success('Remedy updated.')
      }
    } else {
      const res = await supabase.from('products').insert(payload).select().single()
      error = res.error
      if (!res.error && res.data) {
        setProducts((ps) => [res.data!, ...ps])
        toast.success('Remedy added to Shop.')
      }
    }
    setSaving(false)
    if (error) { toast.error(error.message); return }
    closeModal()
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    setDeletingId(p.id)
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    setDeletingId(null)
    if (error) { toast.error(error.message); return }
    setProducts((ps) => ps.filter((x) => x.id !== p.id))
    toast.success('Remedy deleted.')
    setComments((prev) => { const next = { ...prev }; delete next[p.id]; return next })
    if (expandedProductId === p.id) setExpandedProductId(null)
  }

  async function toggleComments(productId: string) {
    if (expandedProductId === productId) {
      setExpandedProductId(null)
      return
    }
    setExpandedProductId(productId)
    if (comments[productId]) return
    setLoadingComments(productId)
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    setLoadingComments(null)
    if (error) { toast.error(error.message); return }
    setComments((prev) => ({ ...prev, [productId]: data ?? [] }))
  }

  async function deleteComment(commentId: string, productId: string) {
    if (!confirm('Delete this comment? This cannot be undone.')) return
    setDeletingCommentId(commentId)
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    setDeletingCommentId(null)
    if (error) {
      toast.error(`Failed to delete: ${error.message}`)
      return
    }
    // Remove from local state immediately
    setComments((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? []).filter((c) => c.id !== commentId),
    }))
    // Refresh product's cached rating
    const { data: refreshed } = await supabase.from('products').select('rating').eq('id', productId).maybeSingle()
    if (refreshed) setProducts((ps) => ps.map((p) => p.id === productId ? { ...p, rating: refreshed.rating } : p))
    toast.success('Comment deleted.')
  }

  // --- Auth loading screen ---
  if (authLoading) {
    return <Loading label="Checking session…" />
  }

  // --- Login screen ---
  if (!authed) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-600 text-cream-50 shadow-pop">
          <Lock className="h-7 w-7" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-sage-900">Admin access</h1>
          <p className="mt-1 text-sm text-ink-500">Sign in with your Supabase admin account.</p>
        </div>
        <form onSubmit={login} className="w-full space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 pointer-events-none" />
            <input
              type="email"
              className="input pl-9"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError('') }}
              autoFocus
              required
            />
          </div>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setLoginError('') }}
            required
          />
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button type="submit" disabled={loggingIn} className="btn-primary mt-2 w-full">
            {loggingIn ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-xs text-ink-400 max-w-xs">
          Use the email &amp; password of the admin account created in your Supabase dashboard → Authentication → Users.
        </p>
      </div>
    )
  }

  // --- Admin Dashboard ---
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-sage-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Add, edit, or upload remedies to the Shop catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openCreate} className="btn-primary">
            <Plus className="h-4 w-4" /> Add New Remedy
          </button>
          <button onClick={logout} className="btn-ghost">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <Loading label="Loading remedies…" />
      ) : products.length === 0 ? (
        <div className="card p-12 text-center text-ink-400">
          No remedies yet. Click "Add New Remedy" to upload your first remedy.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sage-50 text-left text-xs uppercase tracking-wide text-sage-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Remedy</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Rating</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {products.map((p) => {
                  const catMatch = p.description.match(/^\[Category:\s*([^\]]+)\]\s*/)
                  const displayCat = catMatch ? catMatch[1] : 'General'
                  const cleanDesc = p.description.replace(/^\[Category:\s*[^\]]+\]\s*/, '')

                  return (
                    <tr key={p.id} className="hover:bg-sage-50/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image_url} alt="" className="h-12 w-12 rounded-lg object-cover border border-sage-200" />
                          <div>
                            <p className="font-medium text-sage-900">{p.name}</p>
                            <p className="line-clamp-1 max-w-xs text-xs text-ink-400">{cleanDesc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-semibold text-sage-800">
                          <Tag className="h-3 w-3" /> {displayCat}
                        </span>
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
                          <button onClick={() => openEdit(p)} className="btn-ghost px-3 py-1.5 text-xs">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => remove(p)}
                            disabled={deletingId === p.id}
                            className="btn-danger px-3 py-1.5 text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> {deletingId === p.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comments Management Section */}
      {products.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-sage-600" />
            <h2 className="font-display text-xl font-semibold text-sage-900">Manage Comments</h2>
          </div>
          <div className="space-y-3">
            {products.map((p) => {
              const isExpanded = expandedProductId === p.id
              const productComments = comments[p.id] ?? []
              const isLoadingThis = loadingComments === p.id
              return (
                <div key={p.id} className="card overflow-hidden">
                  <button
                    onClick={() => toggleComments(p.id)}
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-sage-50/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-sage-200" />
                      <div>
                        <p className="font-medium text-sage-900">{p.name}</p>
                        <p className="text-xs text-ink-400">
                          {p.rating ? `${p.rating.toFixed(1)} ★ avg` : 'No ratings'}
                          {isExpanded && productComments.length > 0 ? ` · ${productComments.length} review${productComments.length !== 1 ? 's' : ''}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-ink-400">
                      <span className="text-xs font-medium">{isExpanded ? 'Collapse' : 'View reviews'}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-sage-100 p-4">
                      {isLoadingThis ? (
                        <p className="text-center text-sm text-ink-400 py-4">Loading reviews…</p>
                      ) : productComments.length === 0 ? (
                        <p className="text-center text-sm text-ink-400 py-4">No reviews yet for this remedy.</p>
                      ) : (
                        <ul className="divide-y divide-sage-100">
                          {productComments.map((c) => (
                            <li key={c.id} className="flex items-start justify-between gap-4 py-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-semibold text-sm text-sage-900">{c.author_name}</span>
                                  <StarRating value={c.rating} size={12} />
                                  <span className="text-xs text-ink-400 ml-auto">
                                    {new Date(c.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                                <p className="text-sm text-ink-600 break-words">{c.content}</p>
                              </div>
                              <button
                                onClick={() => deleteComment(c.id, p.id)}
                                disabled={deletingCommentId === c.id}
                                className="btn-danger shrink-0 px-3 py-1.5 text-xs"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                {deletingCommentId === c.id ? '…' : 'Delete'}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg p-6 animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-sage-900">
                {editing ? 'Edit remedy details' : 'Upload new remedy'}
              </h2>
              <button onClick={closeModal} className="rounded-lg p-1.5 text-ink-400 hover:bg-sage-100 hover:text-sage-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="label">Remedy Name</label>
                <input
                  className="input"
                  placeholder="e.g. Arnica Montana 30C Pellets"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Category / Form</label>
                  <select
                    className="input"
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Price (PKR / Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    placeholder="499.00"
                    value={draft.price}
                    onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Description &amp; Usage</label>
                <textarea
                  className="input min-h-[90px] resize-y"
                  placeholder="Describe health benefits, dosage, ingredients..."
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>

              {/* Image Upload Selection */}
              <div>
                <label className="label">Product Picture</label>
                <div className="mb-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      imageMode === 'upload'
                        ? 'bg-sage-700 text-cream-50 shadow-sm'
                        : 'bg-sage-100 text-sage-800 hover:bg-sage-200/60'
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload from Device
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      imageMode === 'url'
                        ? 'bg-sage-700 text-cream-50 shadow-sm'
                        : 'bg-sage-100 text-sage-800 hover:bg-sage-200/60'
                    }`}
                  >
                    <ImageIcon className="h-3.5 w-3.5" /> Paste Image URL
                  </button>
                </div>

                {imageMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleDeviceFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full border-2 border-dashed border-sage-300 hover:border-sage-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-sage-50/50 hover:bg-sage-100/50 transition cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                    >
                      <Upload className="h-8 w-8 text-sage-600" />
                      <p className="text-sm font-medium text-sage-900">{uploadingImage ? 'Uploading…' : 'Click to select image from your device'}</p>
                      <p className="text-xs text-ink-400">Supports PNG, JPG, WEBP (Auto-optimized)</p>
                    </button>
                  </div>
                ) : (
                  <input
                    className="input"
                    value={draft.image_url}
                    onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                )}
              </div>

              {draft.image_url && (
                <div className="relative overflow-hidden rounded-xl border border-sage-200">
                  <img src={draft.image_url} alt="preview" className="h-36 w-full object-cover" />
                  <div className="absolute bottom-2 left-2 rounded-md bg-sage-950/70 px-2 py-1 text-xs text-cream-50 backdrop-blur-sm">
                    Picture Preview
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={closeModal} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={saving || uploadingImage} className="btn-primary">
                  <Sparkles className="h-4 w-4" />
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Upload remedy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
