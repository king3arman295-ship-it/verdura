export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  rating: number | null
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  product_id: string
  author_name: string
  content: string
  rating: number
  created_at: string
}

export type ProductWithStats = Product & {
  comment_count: number
}

export const formatPrice = (n: number): string =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 2 }).format(n)
