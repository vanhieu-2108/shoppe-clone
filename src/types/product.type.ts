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
  category: {
    _id: string
    name: string
  }
  image: string
  createdAt: string
  updatedAt: string
  description: string
}

export interface ProductList {
  products: Product[]
  pagination: {
    page: number | string
    limit: number | string
    page_size: number
  }
}

export interface ProductListConfig {
  page?: string | number
  limit?: string | number
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  category?: string
  rating_filter?: string | number
  price_max?: string | number
  price_min?: string | number
  name?: string
}
