import { useState, useEffect } from 'react'
import { marketService } from '../services/marketService'
import { Product, ProductCategory } from '../types/market'
import { supabase } from '../lib/supabase'

interface MarketSection {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [marketSections, setMarketSections] = useState<MarketSection[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Admin functionality states
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null)
  const [productsToReassign, setProductsToReassign] = useState<Product[]>([])
  const [reassignToCategoryId, setReassignToCategoryId] = useState<string>('')

  // Bulk transfer states
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showBulkTransferModal, setShowBulkTransferModal] = useState(false)
  const [bulkTransferCategoryId, setBulkTransferCategoryId] = useState<string>('')
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', market_section_id: '' })
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: '',
    base_price: '',
    uom: 'piece'
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [language, setLanguage] = useState<'en' | 'tl'>('en')
  const [selectedCategoryForTable, setSelectedCategoryForTable] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Translation object
  const translations = {
    en: {
      products: 'Products',
      addCategory: 'Add Category',
      addProduct: 'Add Product',
      searchProducts: 'Search products...',
      allCategories: 'All Categories',
      manageCategories: 'Manage Categories',
      edit: 'Edit',
      delete: 'Delete',
      basePrice: 'Base Price',
      unit: 'Unit',
      variations: 'Variations',
      viewDetails: 'View Details',
      editCategory: 'Edit Category',
      addNewCategory: 'Add New Category',
      name: 'Name',
      description: 'Description',
      categoryName: 'Category name',
      categoryDescription: 'Category description (optional)',
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update',
      editProduct: 'Edit Product',
      addNewProduct: 'Add New Product',
      productName: 'Product name',
      productDescription: 'Product description (optional)',
      category: 'Category',
      selectCategory: 'Select a category',
      basePriceLabel: 'Base Price',
      unitLabel: 'Unit',
      piece: 'Piece',
      kilogram: 'Kilogram',
      gram: 'Gram',
      dozen: 'Dozen',
      pack: 'Pack',
      bundle: 'Bundle',
      sack: 'Sack',
      liter: 'Liter',
      milliliter: 'Milliliter',
      cup: 'Cup',
      serving: 'Serving',
      noCategory: 'No category'
    },
    tl: {
      products: 'Mga Produkto',
      addCategory: 'Magdagdag ng Kategorya',
      addProduct: 'Magdagdag ng Produkto',
      searchProducts: 'Maghanap ng mga produkto...',
      allCategories: 'Lahat ng Kategorya',
      manageCategories: 'Pamahalaan ang mga Kategorya',
      edit: 'I-edit',
      delete: 'Tanggalin',
      basePrice: 'Batayang Presyo',
      unit: 'Yunit',
      variations: 'Mga Pagkakaiba',
      viewDetails: 'Tingnan ang Detalye',
      editCategory: 'I-edit ang Kategorya',
      addNewCategory: 'Magdagdag ng Bagong Kategorya',
      name: 'Pangalan',
      description: 'Paglalarawan',
      categoryName: 'Pangalan ng kategorya',
      categoryDescription: 'Paglalarawan ng kategorya (opsyonal)',
      cancel: 'Kanselahin',
      create: 'Lumikha',
      update: 'I-update',
      editProduct: 'I-edit ang Produkto',
      addNewProduct: 'Magdagdag ng Bagong Produkto',
      productName: 'Pangalan ng produkto',
      productDescription: 'Paglalarawan ng produkto (opsyonal)',
      category: 'Kategorya',
      selectCategory: 'Pumili ng kategorya',
      basePriceLabel: 'Batayang Presyo',
      unitLabel: 'Yunit',
      piece: 'Piraso',
      kilogram: 'Kilogramo',
      gram: 'Gramo',
      dozen: 'Dosena',
      pack: 'Pakete',
      bundle: 'Bigkis',
      sack: 'Sako',
      liter: 'Litro',
      milliliter: 'Mililitro',
      cup: 'Tasa',
      serving: 'Pagkain',
      noCategory: 'Walang kategorya'
    }
  }

  const t = translations[language]

  useEffect(() => {
    checkAdminStatus()
    loadCategories()
    loadMarketSections()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      searchProducts()
    } else {
      loadAllProducts()
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when sort order changes
  }, [sortOrder])

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('role')
          .eq('auth_user_id', user.id)
          .single()

        setIsAdmin((adminProfile as any)?.role === 'admin')
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await marketService.getAllCategories()
      setCategories(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadMarketSections = async () => {
    try {
      const { data, error } = await supabase
        .from('market_sections')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true })

      if (error) throw error
      setMarketSections(data || [])
    } catch (err: any) {
      console.error('Error loading market sections:', err)
      setError(err.message)
    }
  }

  const loadAllProducts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('products')
        .select(`
          *,
          variations:product_variations(*),
          category:product_categories(*)
        `)

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      const { data, error } = await query
      if (error) throw error

      setProducts(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = async () => {
    try {
      setLoading(true)
      const data = await marketService.searchProducts(searchQuery)
      setProducts(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Category management functions
  const handleCreateCategory = async () => {
    try {
      // Check if category name already exists
      const existingCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryForm.name.toLowerCase()
      )

      if (existingCategory) {
        setError('A category with this name already exists. Please choose a different name.')
        return
      }

      if (!categoryForm.name.trim()) {
        setError('Category name is required.')
        return
      }

      if (!categoryForm.market_section_id.trim()) {
        setError('Market section is required.')
        return
      }

      const { data, error } = await supabase
        .from('product_categories')
        .insert([categoryForm] as any)
        .select()
        .single()

      if (error) throw error

      setCategories([...categories, data])
      setShowCategoryModal(false)
      setCategoryForm({ name: '', description: '', market_section_id: '' })
      setError(null) // Clear any previous errors
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return

    try {
      // Check if category name already exists (excluding the current category being edited)
      const existingCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryForm.name.toLowerCase() && cat.id !== editingCategory.id
      )

      if (existingCategory) {
        setError('A category with this name already exists. Please choose a different name.')
        return
      }

      if (!categoryForm.name.trim()) {
        setError('Category name is required.')
        return
      }

      if (!categoryForm.market_section_id.trim()) {
        setError('Market section is required.')
        return
      }

      const { data, error } = await (supabase as any)
        .from('product_categories')
        .update(categoryForm)
        .eq('id', editingCategory.id)
        .select()
        .single()

      if (error) throw error

      setCategories(categories.map(cat => cat.id === editingCategory.id ? (data as any) : cat))
      setShowCategoryModal(false)
      setEditingCategory(null)
      setCategoryForm({ name: '', description: '', market_section_id: '' })
      setError(null) // Clear any previous errors
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    // Find the category to delete
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) return

    // Check if category has products
    const categoryProducts = products.filter(product => product.category_id === categoryId)

    if (categoryProducts.length > 0) {
      // Show reassignment modal
      setCategoryToDelete(category)
      setProductsToReassign(categoryProducts)
      setReassignToCategoryId('')
      setShowDeleteCategoryModal(true)
    } else {
      // No products, safe to delete directly
      if (!confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
        return
      }

      try {
        const { error } = await supabase
          .from('product_categories')
          .delete()
          .eq('id', categoryId)

        if (error) throw error

        setCategories(categories.filter(cat => cat.id !== categoryId))
        setError(null)
      } catch (err: any) {
        setError(err.message)
      }
    }
  }

  const handleConfirmDeleteWithReassignment = async () => {
    if (!categoryToDelete) return

    try {
      setError(null)

      // Step 1: Reassign products to new category (or set to null for "Uncategorized")
      if (productsToReassign.length > 0) {
        const updatePromises = productsToReassign.map(product =>
          (supabase as any)
            .from('products')
            .update({ category_id: reassignToCategoryId || null })
            .eq('id', product.id)
        )

        const results = await Promise.all(updatePromises)
        const errors = results.filter(result => result.error)

        if (errors.length > 0) {
          throw new Error(`Failed to reassign ${errors.length} products`)
        }
      }

      // Step 2: Delete the category
      const { error: deleteError } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', categoryToDelete.id)

      if (deleteError) throw deleteError

      // Step 3: Update local state
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id))

      // Update products in local state
      const updatedProducts = products.map(product => {
        if (product.category_id === categoryToDelete.id) {
          return { ...product, category_id: reassignToCategoryId || 'null' as any }
        }
        return product
      })
      setProducts(updatedProducts as any)

      // Close modal and reset state
      setShowDeleteCategoryModal(false)
      setCategoryToDelete(null)
      setProductsToReassign([])
      setReassignToCategoryId('')

      const targetCategoryName = reassignToCategoryId
        ? categories.find(cat => cat.id === reassignToCategoryId)?.name || 'Unknown'
        : 'Uncategorized'

      alert(`Category "${categoryToDelete.name}" deleted successfully. ${productsToReassign.length} products moved to "${targetCategoryName}".`)

    } catch (err: any) {
      setError(err.message)
    }
  }

  // Bulk transfer functions
  const handleSelectProduct = (productId: string) => {
    const newSelection = new Set(selectedProducts)
    if (newSelection.has(productId)) {
      newSelection.delete(productId)
    } else {
      newSelection.add(productId)
    }
    setSelectedProducts(newSelection)
  }

  const handleSelectAllProducts = () => {
    const currentPageProductIds = getPaginatedProducts().map(p => p.id)
    const allSelected = currentPageProductIds.every(id => selectedProducts.has(id))

    const newSelection = new Set(selectedProducts)
    if (allSelected) {
      // Unselect all on current page
      currentPageProductIds.forEach(id => newSelection.delete(id))
    } else {
      // Select all on current page
      currentPageProductIds.forEach(id => newSelection.add(id))
    }
    setSelectedProducts(newSelection)
  }

  const handleBulkTransfer = async () => {
    if (selectedProducts.size === 0) {
      setError('Please select products to transfer.')
      return
    }

    if (!bulkTransferCategoryId) {
      setError('Please select a destination category.')
      return
    }

    try {
      setError(null)

      // Update all selected products
      const updatePromises = Array.from(selectedProducts).map(productId =>
        (supabase as any)
          .from('products')
          .update({ category_id: bulkTransferCategoryId })
          .eq('id', productId)
      )

      const results = await Promise.all(updatePromises)
      const errors = results.filter(result => result.error)

      if (errors.length > 0) {
        throw new Error(`Failed to transfer ${errors.length} products`)
      }

      // Update local state
      const updatedProducts = products.map(product => {
        if (selectedProducts.has(product.id)) {
          return { ...product, category_id: bulkTransferCategoryId }
        }
        return product
      })
      setProducts(updatedProducts as any)

      // Reset selection and close modal
      setSelectedProducts(new Set())
      setShowBulkTransferModal(false)
      setBulkTransferCategoryId('')

      const targetCategory = categories.find(cat => cat.id === bulkTransferCategoryId)
      alert(`Successfully transferred ${selectedProducts.size} products to "${targetCategory?.name || 'Unknown'}" category.`)

    } catch (err: any) {
      setError(err.message)
    }
  }

  // Product management functions
  const handleCreateProduct = async () => {
    try {
      // Validation
      if (!productForm.name.trim()) {
        setError('Product name is required.')
        return
      }

      if (!productForm.base_price || parseFloat(productForm.base_price) < 0) {
        setError('Please enter a valid price.')
        return
      }

      // Check if product name already exists
      const existingProduct = products.find(
        prod => prod.name.toLowerCase() === productForm.name.toLowerCase()
      )

      if (existingProduct) {
        setError('A product with this name already exists. Please choose a different name.')
        return
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productForm.name,
          category_id: productForm.category_id,
          base_price: parseFloat(productForm.base_price),
          uom: productForm.uom
        }] as any)
        .select(`
          *,
          variations:product_variations(*),
          category:category_id(*)
        `)
        .single()

      if (error) throw error

      setProducts([...products, data])
      setShowProductModal(false)
      setProductForm({
        name: '',
        category_id: '',
        base_price: '',
        uom: 'piece'
      })
      setError(null) // Clear any previous errors
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      // Validation
      if (!productForm.name.trim()) {
        setError('Product name is required.')
        return
      }

      if (!productForm.base_price || parseFloat(productForm.base_price) < 0) {
        setError('Please enter a valid price.')
        return
      }

      // Check if product name already exists (excluding the current product being edited)
      const existingProduct = products.find(
        prod => prod.name.toLowerCase() === productForm.name.toLowerCase() && prod.id !== editingProduct.id
      )

      if (existingProduct) {
        setError('A product with this name already exists. Please choose a different name.')
        return
      }

      const { data, error } = await (supabase as any)
        .from('products')
        .update({
          name: productForm.name,
          category_id: productForm.category_id,
          base_price: parseFloat(productForm.base_price),
          uom: productForm.uom
        })
        .eq('id', editingProduct.id)
        .select(`
          *,
          variations:product_variations(*),
          category:category_id(*)
        `)
        .single()

      if (error) throw error

      setProducts(products.map(prod => prod.id === editingProduct.id ? (data as any) : prod))
      setShowProductModal(false)
      setEditingProduct(null)
      setProductForm({
        name: '',
        category_id: '',
        base_price: '',
        uom: 'piece'
      })
      setError(null) // Clear any previous errors
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      setProducts(products.filter(prod => prod.id !== productId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const openCategoryModal = (category?: ProductCategory) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        description: category.description || '',
        market_section_id: (category as any).market_section_id || ''
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({ name: '', description: '', market_section_id: '' })
    }
    setError(null) // Clear any previous errors when opening modal
    setShowCategoryModal(true)
  }

  const openProductModal = (product?: Product, categoryId?: string) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        category_id: product.category_id,
        base_price: product.base_price.toString(),
        uom: product.uom
      })
    } else {
      setEditingProduct(null)
      setProductForm({
        name: '',
        category_id: categoryId || '',
        base_price: '',
        uom: 'piece'
      })
    }
    setError(null) // Clear any previous errors when opening modal
    setShowProductModal(true)
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedCategoryForTable(categoryId)
    setCurrentPage(1) // Reset to first page when filtering
    setSearchQuery('') // Clear search when filtering by category
  }

  const getFilteredProducts = () => {
    let filtered = products
    if (selectedCategoryForTable) {
      filtered = products.filter(product => product.category_id === selectedCategoryForTable)
    }

    // Sort alphabetically
    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    })

    return filtered
  }

  const getPaginatedProducts = () => {
    const filtered = getFilteredProducts()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filtered = getFilteredProducts()
    return Math.ceil(filtered.length / itemsPerPage)
  }

  const getSelectedCategoryName = () => {
    if (selectedCategoryForTable) {
      const category = categories.find(cat => cat.id === selectedCategoryForTable)
      return category?.name || 'Unknown Category'
    }
    return 'All Products'
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{t.products}</h1>

          <div className="flex gap-2 items-center">
            {/* Language Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'en'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('tl')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === 'tl'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                TL
              </button>
            </div>

            {isAdmin && (
              <>
                <button
                  onClick={() => openCategoryModal()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {t.addCategory}
                </button>
                <button
                  onClick={() => openProductModal()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t.addProduct}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t.searchProducts}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">{t.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

        </div>

        {/* Categories Management Section (Admin only) */}
        {isAdmin && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">{t.manageCategories}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-md p-3 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600"
                          onClick={() => handleCategoryClick(category.id)}>
                          {category.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {products.filter(p => p.category_id === category.id).length} products
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openCategoryModal(category)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        {t.edit}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900 text-sm ml-2"
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons for this category */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Products
                    </button>
                    <button
                      onClick={() => openProductModal(undefined, category.id)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      + Add Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 text-red-600">Error: {error}</div>
      )}

      {/* Products Table Display */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            {getSelectedCategoryName()} - Products List
          </h2>

          {/* Alphabetical Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSortOrder('asc')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${sortOrder === 'asc'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                A-Z
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${sortOrder === 'desc'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Z-A
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {/* Bulk Actions Bar */}
          {selectedProducts.size > 0 && (
            <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                  <span className="font-medium">{selectedProducts.size}</span> product(s) selected
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBulkTransferModal(true)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-200 hover:bg-blue-300"
                  >
                    Transfer to Category
                  </button>
                  <button
                    onClick={() => setSelectedProducts(new Set())}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={getPaginatedProducts().length > 0 && getPaginatedProducts().every(p => selectedProducts.has(p.id))}
                      onChange={handleSelectAllProducts}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedProducts().map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50 ${selectedProducts.has(product.id) ? 'bg-blue-50' : ''
                    }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category?.name || t.noCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₱{product.base_price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.uom}</div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openProductModal(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {t.edit}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t.delete}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {getFilteredProducts().length === 0 && (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">No products found in this category.</div>
              {isAdmin && (
                <button
                  onClick={() => openProductModal(undefined, selectedCategoryForTable)}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  + Add First Product
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {getFilteredProducts().length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                disabled={currentPage === getTotalPages()}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, getFilteredProducts().length)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{getFilteredProducts().length}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                    disabled={currentPage === getTotalPages()}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? t.editCategory : t.addNewCategory}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.name}</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder={t.categoryName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Market Section *</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={categoryForm.market_section_id}
                  onChange={(e) => setCategoryForm({ ...categoryForm, market_section_id: e.target.value })}
                >
                  <option value="">Select a market section</option>
                  {marketSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">{t.description}</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder={t.categoryDescription}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {editingCategory ? t.update : t.create}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingProduct ? t.editProduct : t.addNewProduct}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.name}</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder={t.productName}
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700">{t.category}</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                >
                  <option value="">{t.selectCategory}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t.basePriceLabel}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={productForm.base_price}
                    onChange={(e) => setProductForm({ ...productForm, base_price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t.unitLabel}</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={productForm.uom}
                    onChange={(e) => setProductForm({ ...productForm, uom: e.target.value })}
                  >
                    <option value="piece">{t.piece}</option>
                    <option value="kg">{t.kilogram}</option>
                    <option value="g">{t.gram}</option>
                    <option value="dozen">{t.dozen}</option>
                    <option value="pack">{t.pack}</option>
                    <option value="bundle">{t.bundle}</option>
                    <option value="sack">{t.sack}</option>
                    <option value="liter">{t.liter}</option>
                    <option value="ml">{t.milliliter}</option>
                    <option value="cup">{t.cup}</option>
                    <option value="serving">{t.serving}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {editingProduct ? t.update : t.create}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteCategoryModal && categoryToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Category "{categoryToDelete.name}"
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This category has <strong>{productsToReassign.length} product(s)</strong>.
                  Choose where to move them before deletion:
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Move products to:
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    value={reassignToCategoryId}
                    onChange={(e) => setReassignToCategoryId(e.target.value)}
                  >
                    <option value="">Uncategorized (no category)</option>
                    {categories
                      .filter(cat => cat.id !== categoryToDelete.id)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Products to be moved:</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {productsToReassign.map((product) => (
                      <div key={product.id} className="text-sm text-gray-600 py-1">
                        • {product.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 text-red-600 text-sm">
                  Error: {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteCategoryModal(false)
                    setCategoryToDelete(null)
                    setProductsToReassign([])
                    setReassignToCategoryId('')
                    setError(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteWithReassignment}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Transfer Modal */}
      {showBulkTransferModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Transfer Products
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Transfer <strong>{selectedProducts.size} product(s)</strong> to a different category:
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer to category:
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={bulkTransferCategoryId}
                    onChange={(e) => setBulkTransferCategoryId(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected products:</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {Array.from(selectedProducts).map((productId) => {
                      const product = products.find(p => p.id === productId)
                      return product ? (
                        <div key={product.id} className="text-sm text-gray-600 py-1">
                          • {product.name}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 text-red-600 text-sm">
                  Error: {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowBulkTransferModal(false)
                    setBulkTransferCategoryId('')
                    setError(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkTransfer}
                  disabled={!bulkTransferCategoryId}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Transfer Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
