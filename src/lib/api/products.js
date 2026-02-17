/**
 * Products API Bridge
 * 
 * This file bridges the API layer with the new product management service
 * It converts between formats for backwards compatibility
 * 
 * In production, this would call a real backend API
 */

import {
  getAllProducts,
  getProductBySlug,
  getProductById,
  getProductVariants
} from '../services/products'

/**
 * Get all products with variants
 * Returns products with variant data attached
 */
export const getProducts = async (filters = {}) => {
  try {
    const products = getAllProducts()

    // Map products to include variant data
    return products.map(product => {
      const variants = getProductVariants(product.id)
      return {
        ...product,
        variants: variants,
        inventory: variants.reduce((sum, v) => sum + v.stock, 0) // Total stock across all variants
      }
    })
  } catch (error) {
    console.error('Error getting products:', error)
    return []
  }
}

/**
 * Get single product by slug
 * Returns product with all variants attached
 */
export const getProduct = async (slug) => {
  try {
    const product = getProductBySlug(slug)
    if (!product) return null

    const variants = getProductVariants(product.id)
    return {
      ...product,
      variants: variants,
      inventory: variants.reduce((sum, v) => sum + v.stock, 0)
    }
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

/**
 * Get product by ID
 */
export const getProductById_API = async (productId) => {
  try {
    const product = getProductById(productId)
    if (!product) return null

    const variants = getProductVariants(productId)
    return {
      ...product,
      variants: variants,
      inventory: variants.reduce((sum, v) => sum + v.stock, 0)
    }
  } catch (error) {
    console.error('Error getting product by ID:', error)
    return null
  }
}

/**
 * Legacy: Get products by category
 */
export const getProductsByCategory = async (category) => {
  try {
    const products = await getProducts()
    return products.filter(p => p.category === category)
  } catch (error) {
    console.error('Error getting products by category:', error)
    return []
  }
}

/**
 * Legacy: Search products
 */
export const searchProducts = async (searchTerm) => {
  try {
    const products = await getProducts()
    const term = searchTerm.toLowerCase()
    return products.filter(
      p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term)
    )
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}
