export interface Product {
  _id: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  name: string
  description: string
  category: {
    _id: string
    name: string
  }
  image: string
  createdAt: string
  updatedAt: string
}

export interface ProductList {
  message: string
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductConfig {
  page?: number | string
  limit?: number | string
  order?: 'asc' | 'desc'
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  exclude?: string
  rating_filter?: string
  price_max?: number | string
  price_min?: number | string
  name?: string | string
  category?: string
}
