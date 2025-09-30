export type MarketSection = {
  id: string
  name: string
  description?: string
  total_stalls: number
  available_stalls?: number
  created_at?: string
  updated_at?: string
}

export type Stall = {
  id: string
  section_id: string
  stall_number: string
  location_description?: string
  status: 'occupied' | 'vacant' | 'maintenance'
  vendor_id?: string
  created_at?: string
  updated_at?: string
}

export type Product = {
  id: string
  name: string
  description?: string
  category_id: string
  base_price: number
  vendor_id?: string | null
  stall_id?: string | null
  variations?: ProductVariation[]
  category?: ProductCategory
  uom: string
  created_at?: string
  updated_at?: string
}

export type ProductVariation = {
  id: string
  product_id: string
  name: string
  price: number
  size?: string
  color?: string
  uom?: string
  created_at?: string
  updated_at?: string
}

export type ProductCategory = {
  id: string
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

// Initial market sections data
export const INITIAL_MARKET_SECTIONS: Omit<MarketSection, 'id' | 'created_at' | 'updated_at'>[] = [
  { name: 'Eatery', total_stalls: 12, description: 'Food stalls and small restaurants' },
  { name: 'Fruits and Vegetables', total_stalls: 36, description: 'Fresh produce section' },
  { name: 'Dried Fish', total_stalls: 4, description: 'Dried and preserved fish products' },
  { name: 'Grocery', total_stalls: 14, description: 'General grocery items' },
  { name: 'Rice and Grains', total_stalls: 20, description: 'Rice, grains, and cereals' },
  { name: 'Variety', total_stalls: 14, description: 'Mixed goods and miscellaneous items' },
  { name: 'Fish', total_stalls: 72, description: 'Fresh fish and seafood' },
  { name: 'Meat', total_stalls: 72, description: 'Fresh meat products' }
]

// Common units of measurement
export const UNITS_OF_MEASUREMENT = [
  'kg', // Kilogram
  'g', // Gram
  'piece',
  'dozen',
  'pack',
  'bundle',
  'sack',
  'liter',
  'ml', // Milliliter
  'cup',
  'serving'
]
