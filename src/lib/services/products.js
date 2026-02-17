/**
 * Product Management Service
 * 
 * Handles:
 * - Creating new products with variants
 * - Editing product details
 * - Managing variant inventory at SKU level
 * - Deleting products
 * 
 * Architecture:
 * - Products are stored separately from variants
 * - Each variant has individual stock tracking
 * - Admin can add/remove colors, storage, conditions per product
 * - Only variants with stock > 0 show as available on site
 * 
 * Storage:
 * - Development: localStorage
 * - Production: PostgreSQL with Prisma
 */

const PRODUCTS_STORAGE_KEY = 'products'
const VARIANT_INVENTORY_KEY = 'variant_inventory'

/**
 * Initialize products from localStorage or defaults
 */
export const initializeProducts = () => {
  try {
    const existing = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (existing) {
      return JSON.parse(existing)
    }

    // Default products - seeded from original data
    const defaultProducts = [
      {
        id: '1',
        title: 'iPhone 8',
        slug: 'iphone-8',
        description: 'Refurbished iPhone 8 with excellent condition and Home button',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone8 Black.jpg', '/assets/iPhone8 White.jpg', '/assets/iPhone8 Red.jpg'],
        basePrice: 420000, // Base price in cents
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'iPhone 11',
        slug: 'iphone-11',
        description: 'Refurbished iPhone 11 with dual camera system and Liquid Retina display',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone 11 2.jpg', '/assets/iPhone 11 3.jpg', '/assets/iPhone 11 white.jpg'],
        basePrice: 550000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'iPhone 11 Pro',
        slug: 'iphone-11-pro',
        description: 'Refurbished iPhone 11 Pro with triple camera and ProMotion display',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone 11 Pro 2.jpg'],
        basePrice: 650000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'iPhone 12',
        slug: 'iphone-12',
        description: 'Refurbished iPhone 12 with 5G and Ceramic Shield',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone 12.jpg'],
        basePrice: 700000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        title: 'iPhone 12 mini',
        slug: 'iphone-12-mini',
        description: 'Refurbished iPhone 12 mini - compact powerhouse',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone 12 mini.jpg'],
        basePrice: 650000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        title: 'iPhone 13',
        slug: 'iphone-13',
        description: 'Refurbished iPhone 13 with improved battery and camera',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone 13.jpg'],
        basePrice: 800000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        title: 'iPhone 13 Pro',
        slug: 'iphone-13-pro',
        description: 'Refurbished iPhone 13 Pro with ProMotion and ProCamera',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone 13 Pro.jpg'],
        basePrice: 900000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '8',
        title: 'iPhone 14 Plus',
        slug: 'iphone-14-plus',
        description: 'Refurbished iPhone 14 Plus with larger display',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone 14 plus.jpg'],
        basePrice: 950000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '9',
        title: 'iPhone 15 Series',
        slug: 'iphone-15-series',
        description: 'Refurbished iPhone 15 with latest A17 processor',
        brand: 'Apple',
        category: 'Smartphones',
        currency: 'ZAR',
        images: ['/assets/iPhone 15.jpg'],
        basePrice: 1100000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts))
    return defaultProducts
  } catch (error) {
    console.error('Error initializing products:', error)
    return []
  }
}

/**
 * Get all products
 */
export const getAllProducts = () => {
  try {
    let products = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (!products) {
      products = initializeProducts()
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    }
    return products ? JSON.parse(products) : []
  } catch (error) {
    console.error('Error getting products:', error)
    return []
  }
}

/**
 * Get single product by ID
 */
export const getProductById = (productId) => {
  const products = getAllProducts()
  return products.find(p => p.id === productId) || null
}

/**
 * Get product by slug
 */
export const getProductBySlug = (slug) => {
  const products = getAllProducts()
  return products.find(p => p.slug === slug) || null
}

/**
 * Create new product
 */
export const createProduct = (productData) => {
  try {
    const newId = String(Date.now())
    const newProduct = {
      id: newId,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const products = getAllProducts()
    products.push(newProduct)
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))

    return newProduct
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

/**
 * Update product
 */
export const updateProduct = (productId, updates) => {
  try {
    const products = getAllProducts()
    const index = products.findIndex(p => p.id === productId)

    if (index === -1) {
      throw new Error('Product not found')
    }

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    return products[index]
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

/**
 * Delete product
 */
export const deleteProduct = (productId) => {
  try {
    const products = getAllProducts()
    const filtered = products.filter(p => p.id !== productId)
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered))

    // Also remove all variants for this product
    deleteVariantsByProductId(productId)

    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

/**
 * ============================================
 * VARIANT MANAGEMENT (SKU-level inventory)
 * ============================================
 */

/**
 * Initialize variant inventory
 */
const initializeVariantInventory = () => {
  try {
    const existing = localStorage.getItem(VARIANT_INVENTORY_KEY)
    if (existing) {
      return JSON.parse(existing)
    }

    // Default variants with stock levels
    const defaultVariants = {
      // iPhone 8
      '1-1': { id: '1-1', productId: '1', color: 'Black', storage: 64, condition: 'Excellent', stock: 3, priceAdjust: 0, image: '/assets/iPhone8 Black.jpg' },
      '1-2': { id: '1-2', productId: '1', color: 'White', storage: 64, condition: 'Good', stock: 2, priceAdjust: -20000, image: '/assets/iPhone8 White.jpg' },
      '1-3': { id: '1-3', productId: '1', color: 'Red', storage: 256, condition: 'Excellent', stock: 1, priceAdjust: 30000, image: '/assets/iPhone8 Red.jpg' },

      // iPhone 11
      '2-1': { id: '2-1', productId: '2', color: 'Black', storage: 64, condition: 'Excellent', stock: 4, priceAdjust: 0, image: '/assets/iPhone 11 2.jpg' },
      '2-2': { id: '2-2', productId: '2', color: 'White', storage: 128, condition: 'Good', stock: 3, priceAdjust: 20000, image: '/assets/iPhone 11 white.jpg' },
      '2-3': { id: '2-3', productId: '2', color: 'Purple', storage: 256, condition: 'Like New', stock: 2, priceAdjust: 50000, image: '/assets/iPhone 11 3.jpg' },

      // iPhone 11 Pro
      '3-1': { id: '3-1', productId: '3', color: 'Space Gray', storage: 64, condition: 'Excellent', stock: 0, priceAdjust: 0, image: '/assets/iPhone 11 Pro 2.jpg' },
      '3-2': { id: '3-2', productId: '3', color: 'Silver', storage: 256, condition: 'Like New', stock: 2, priceAdjust: 50000, image: '/assets/iPhone 11 Pro 2.jpg' },
      '3-3': { id: '3-3', productId: '3', color: 'Gold', storage: 512, condition: 'Excellent', stock: 1, priceAdjust: 80000, image: '/assets/iPhone 11 Pro 2.jpg' },

      // iPhone 12
      '4-1': { id: '4-1', productId: '4', color: 'Black', storage: 64, condition: 'Excellent', stock: 3, priceAdjust: 0, image: '/assets/iPhone 12.jpg' },
      '4-2': { id: '4-2', productId: '4', color: 'Blue', storage: 128, condition: 'Good', stock: 2, priceAdjust: 20000, image: '/assets/iPhone 12.jpg' },
      '4-3': { id: '4-3', productId: '4', color: 'Green', storage: 256, condition: 'Like New', stock: 1, priceAdjust: 50000, image: '/assets/iPhone 12.jpg' },

      // iPhone 12 mini
      '5-1': { id: '5-1', productId: '5', color: 'Black', storage: 64, condition: 'Good', stock: 2, priceAdjust: 0, image: '/assets/iPhone 12 mini.jpg' },
      '5-2': { id: '5-2', productId: '5', color: 'White', storage: 128, condition: 'Excellent', stock: 3, priceAdjust: 20000, image: '/assets/iPhone 12 mini.jpg' },
      '5-3': { id: '5-3', productId: '5', color: 'Red', storage: 256, condition: 'Like New', stock: 0, priceAdjust: 50000, image: '/assets/iPhone 12 mini.jpg' },

      // iPhone 13
      '6-1': { id: '6-1', productId: '6', color: 'Midnight', storage: 128, condition: 'Excellent', stock: 4, priceAdjust: 0, image: '/assets/iPhone 13.jpg' },
      '6-2': { id: '6-2', productId: '6', color: 'Starlight', storage: 256, condition: 'Good', stock: 2, priceAdjust: 20000, image: '/assets/iPhone 13.jpg' },
      '6-3': { id: '6-3', productId: '6', color: 'Pink', storage: 512, condition: 'Like New', stock: 1, priceAdjust: 50000, image: '/assets/iPhone 13.jpg' },

      // iPhone 13 Pro
      '7-1': { id: '7-1', productId: '7', color: 'Graphite', storage: 128, condition: 'Excellent', stock: 2, priceAdjust: 0, image: '/assets/iPhone 13 Pro.jpg' },
      '7-2': { id: '7-2', productId: '7', color: 'Gold', storage: 256, condition: 'Like New', stock: 2, priceAdjust: 30000, image: '/assets/iPhone 13 Pro.jpg' },
      '7-3': { id: '7-3', productId: '7', color: 'Sierra Blue', storage: 512, condition: 'Excellent', stock: 0, priceAdjust: 60000, image: '/assets/iPhone 13 Pro.jpg' },

      // iPhone 14 Plus
      '8-1': { id: '8-1', productId: '8', color: 'Midnight', storage: 128, condition: 'Good', stock: 1, priceAdjust: 0, image: '/assets/iPhone 14 plus.jpg' },
      '8-2': { id: '8-2', productId: '8', color: 'Purple', storage: 256, condition: 'Excellent', stock: 2, priceAdjust: 20000, image: '/assets/iPhone 14 plus.jpg' },
      '8-3': { id: '8-3', productId: '8', color: 'Yellow', storage: 512, condition: 'Like New', stock: 1, priceAdjust: 50000, image: '/assets/iPhone 14 plus.jpg' },

      // iPhone 15
      '9-1': { id: '9-1', productId: '9', color: 'Black', storage: 128, condition: 'Excellent', stock: 3, priceAdjust: 0, image: '/assets/iPhone 15.jpg' },
      '9-2': { id: '9-2', productId: '9', color: 'White', storage: 256, condition: 'Good', stock: 2, priceAdjust: 30000, image: '/assets/iPhone 15.jpg' },
      '9-3': { id: '9-3', productId: '9', color: 'Blue', storage: 512, condition: 'Like New', stock: 1, priceAdjust: 60000, image: '/assets/iPhone 15.jpg' }
    }

    localStorage.setItem(VARIANT_INVENTORY_KEY, JSON.stringify(defaultVariants))
    return defaultVariants
  } catch (error) {
    console.error('Error initializing variant inventory:', error)
    return {}
  }
}

/**
 * Get all variants for a product
 */
export const getProductVariants = (productId) => {
  try {
    let variants = localStorage.getItem(VARIANT_INVENTORY_KEY)
    if (!variants) {
      variants = initializeVariantInventory()
      localStorage.setItem(VARIANT_INVENTORY_KEY, JSON.stringify(variants))
    }

    const allVariants = JSON.parse(variants)
    return Object.values(allVariants).filter(v => v.productId === productId)
  } catch (error) {
    console.error('Error getting variants:', error)
    return []
  }
}

/**
 * Get available variants (stock > 0) for a product
 */
export const getAvailableVariants = (productId) => {
  const variants = getProductVariants(productId)
  return variants.filter(v => v.stock > 0)
}

/**
 * Get single variant
 */
export const getVariant = (variantId) => {
  try {
    let variants = localStorage.getItem(VARIANT_INVENTORY_KEY)
    if (!variants) {
      variants = initializeVariantInventory()
    }
    const allVariants = JSON.parse(variants)
    return allVariants[variantId] || null
  } catch (error) {
    console.error('Error getting variant:', error)
    return null
  }
}

/**
 * Create new variant
 */
export const createVariant = (productId, variantData) => {
  try {
    const variantId = `${productId}-${Date.now()}`
    const newVariant = {
      id: variantId,
      productId,
      ...variantData,
      stock: variantData.stock || 0
    }

    let variants = localStorage.getItem(VARIANT_INVENTORY_KEY)
    if (!variants) {
      variants = initializeVariantInventory()
    }

    const allVariants = JSON.parse(variants)
    allVariants[variantId] = newVariant
    localStorage.setItem(VARIANT_INVENTORY_KEY, JSON.stringify(allVariants))

    return newVariant
  } catch (error) {
    console.error('Error creating variant:', error)
    throw error
  }
}

/**
 * Update variant (including stock)
 */
export const updateVariant = (variantId, updates) => {
  try {
    let variants = localStorage.getItem(VARIANT_INVENTORY_KEY)
    if (!variants) {
      variants = initializeVariantInventory()
    }

    const allVariants = JSON.parse(variants)
    if (!allVariants[variantId]) {
      throw new Error('Variant not found')
    }

    allVariants[variantId] = {
      ...allVariants[variantId],
      ...updates
    }

    localStorage.setItem(VARIANT_INVENTORY_KEY, JSON.stringify(allVariants))
    return allVariants[variantId]
  } catch (error) {
    console.error('Error updating variant:', error)
    throw error
  }
}

/**
 * Delete variant
 */
export const deleteVariant = (variantId) => {
  try {
    let variants = localStorage.getItem(VARIANT_INVENTORY_KEY)
    if (!variants) {
      return true
    }

    const allVariants = JSON.parse(variants)
    delete allVariants[variantId]
    localStorage.setItem(VARIANT_INVENTORY_KEY, JSON.stringify(allVariants))
    return true
  } catch (error) {
    console.error('Error deleting variant:', error)
    throw error
  }
}

/**
 * Delete all variants for a product
 */
export const deleteVariantsByProductId = (productId) => {
  try {
    let variants = localStorage.getItem(VARIANT_INVENTORY_KEY)
    if (!variants) {
      return true
    }

    const allVariants = JSON.parse(variants)
    Object.keys(allVariants).forEach(key => {
      if (allVariants[key].productId === productId) {
        delete allVariants[key]
      }
    })
    localStorage.setItem(VARIANT_INVENTORY_KEY, JSON.stringify(allVariants))
    return true
  } catch (error) {
    console.error('Error deleting variants:', error)
    throw error
  }
}

/**
 * Reduce variant stock after order
 */
export const reduceVariantStock = (variantId, quantity = 1) => {
  try {
    const variant = getVariant(variantId)
    if (!variant) {
      throw new Error('Variant not found')
    }

    if (variant.stock < quantity) {
      throw new Error('Insufficient stock')
    }

    return updateVariant(variantId, {
      stock: variant.stock - quantity
    })
  } catch (error) {
    console.error('Error reducing variant stock:', error)
    throw error
  }
}

/**
 * Get variant total price (base price + adjustment)
 */
export const getVariantPrice = (variantId, basePrice) => {
  const variant = getVariant(variantId)
  if (!variant) {
    return basePrice
  }
  return basePrice + (variant.priceAdjust || 0)
}

/**
 * Get all available colors for a product
 */
export const getAvailableColorsForProduct = (productId) => {
  const variants = getAvailableVariants(productId)
  return [...new Set(variants.map(v => v.color))]
}

/**
 * Get available storages for product + color
 */
export const getAvailableStoragesForColor = (productId, color) => {
  const variants = getAvailableVariants(productId)
  const filtered = variants.filter(v => v.color === color)
  return [...new Set(filtered.map(v => v.storage))].sort((a, b) => a - b)
}

/**
 * Get available conditions for product + color + storage
 */
export const getAvailableConditionsForStorage = (productId, color, storage) => {
  const variants = getAvailableVariants(productId)
  const filtered = variants.filter(v => v.color === color && v.storage === storage)
  return [...new Set(filtered.map(v => v.condition))]
}

/**
 * Find variant by product, color, storage, condition
 */
export const findVariant = (productId, color, storage, condition) => {
  const variants = getProductVariants(productId)
  return variants.find(
    v => v.color === color && v.storage === storage && v.condition === condition
  ) || null
}
