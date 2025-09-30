import { supabase } from '../lib/supabase'
import { MarketSection, Stall, Product, ProductVariation, ProductCategory } from '../types/market'

export const marketService = {
  // Market Sections
  async getAllSections() {
    const { data, error } = await supabase
      .from('market_sections')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data as MarketSection[]
  },

  async getSectionById(id: string) {
    const { data, error } = await supabase
      .from('market_sections')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as MarketSection
  },

  // Stalls
  async getStallsBySection(sectionId: string) {
    const { data, error } = await supabase
      .from('stalls')
      .select(`
        *,
        vendor:vendor_id(id, first_name, last_name, business_name)
      `)
      .eq('section_id', sectionId)
      .order('stall_number')
    
    if (error) throw error
    return data as (Stall & { vendor: any })[]
  },

  // Products
  async getProductsByVendor(vendorId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variations:product_variations(*),
        category:category_id(*)
      `)
      .eq('vendor_id', vendorId)
    
    if (error) throw error
    return data as (Product & { variations: ProductVariation[], category: ProductCategory })[]
  },

  async searchProducts(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variations:product_variations(*),
        category:category_id(*),
        vendor:vendor_id(id, first_name, last_name, business_name),
        stall:stall_id(stall_number, section_id)
      `)
      .ilike('name', `%${query}%`)
    
    if (error) throw error
    return data
  },

  // Product Categories
  async getAllCategories() {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data as ProductCategory[]
  },

  // Product Variations
  async getProductVariations(productId: string) {
    const { data, error } = await supabase
      .from('product_variations')
      .select('*')
      .eq('product_id', productId)
    
    if (error) throw error
    return data as ProductVariation[]
  }
}
