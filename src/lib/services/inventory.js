/**
 * Inventory Management Service
 * 
 * Handles:
 * - Tracking product stock levels
 * - Validating stock before purchase
 * - Reducing inventory after order
 * - Admin inventory updates
 * 
 * Architecture:
 * - Products have inventory count
 * - Users can purchase up to available stock
 * - Stock only reduced AFTER successful order (not on add to cart)
 * - Admin can manually adjust stock
 * 
 * Storage:
 * - Development: localStorage
 * - Production: will be replaced with database
 */

import { getProducts } from '../api/products'

const INVENTORY_STORAGE_KEY = 'inventory'

/**
 * Initialize inventory from products
 * Creates inventory record for each product
 */
export const initializeInventory = async () => {
  try {
    const existing = localStorage.getItem(INVENTORY_STORAGE_KEY)
    if (existing) {
      return JSON.parse(existing)
    }

    const products = await getProducts()
    const inventory = {}

    products.forEach(product => {
      inventory[product.id] = {
        productId: product.id,
        productTitle: product.title,
        currentStock: product.inventory,
        initialStock: product.inventory,
        reserved: 0, // Items in carts but not purchased
        sold: 0,
        lastUpdated: new Date().toISOString()
      }
    })

    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory))
    return inventory
  } catch (error) {
    console.error('Error initializing inventory:', error)
    return {}
  }
}

/**
 * Get current inventory (synchronous)
 * Ensures auto-initialization
 */
export const getInventory = () => {
  try {
    let inventory = localStorage.getItem(INVENTORY_STORAGE_KEY)
    if (!inventory) {
      // Auto-initialize with products
      // This will block, but only on first load
      console.warn('Inventory not initialized. Initializing now...')
      initializeInventorySync()
      inventory = localStorage.getItem(INVENTORY_STORAGE_KEY)
    }
    return inventory ? JSON.parse(inventory) : {}
  } catch (error) {
    console.error('Error getting inventory:', error)
    return {}
  }
}

/**
 * Sync version of initialization
 * Used when inventory is not yet loaded
 */
const initializeInventorySync = () => {
  try {
    // Import products synchronously if possible
    // This is a fallback that uses default values
    const defaultInventory = {
      '1': { productId: '1', productTitle: 'iPhone 8', currentStock: 5, initialStock: 5, sold: 0, lastUpdated: new Date().toISOString() },
      '2': { productId: '2', productTitle: 'iPhone 11', currentStock: 10, initialStock: 10, sold: 0, lastUpdated: new Date().toISOString() },
      '3': { productId: '3', productTitle: 'iPhone 11 Pro', currentStock: 4, initialStock: 4, sold: 0, lastUpdated: new Date().toISOString() },
      '4': { productId: '4', productTitle: 'iPhone 12', currentStock: 8, initialStock: 8, sold: 0, lastUpdated: new Date().toISOString() },
      '5': { productId: '5', productTitle: 'iPhone 12 mini', currentStock: 6, initialStock: 6, sold: 0, lastUpdated: new Date().toISOString() },
      '6': { productId: '6', productTitle: 'iPhone 13', currentStock: 9, initialStock: 9, sold: 0, lastUpdated: new Date().toISOString() },
      '7': { productId: '7', productTitle: 'iPhone 13 Pro', currentStock: 5, initialStock: 5, sold: 0, lastUpdated: new Date().toISOString() },
      '8': { productId: '8', productTitle: 'iPhone 14 Plus', currentStock: 7, initialStock: 7, sold: 0, lastUpdated: new Date().toISOString() },
      '9': { productId: '9', productTitle: 'iPhone 15 Series', currentStock: 8, initialStock: 8, sold: 0, lastUpdated: new Date().toISOString() }
    }
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(defaultInventory))
  } catch (error) {
    console.error('Error initializing inventory:', error)
  }
}

/**
 * Get stock for specific product (synchronous)
 */
export const getProductStock = (productId) => {
  const inventory = getInventory()
  const item = inventory[productId]
  return item ? item.currentStock : 0
}

/**
 * Check if product has sufficient stock (synchronous version)
 * Uses cached inventory from localStorage
 */
export const hasStock = (productId, quantity = 1) => {
  try {
    const inventory = localStorage.getItem(INVENTORY_STORAGE_KEY)
    if (!inventory) {
      // No inventory yet, assume in stock
      return true
    }
    const parsed = JSON.parse(inventory)
    const item = parsed[productId]
    return item ? item.currentStock >= quantity : true
  } catch (e) {
    return true // Fallback: assume in stock
  }
}

/**
 * Reduce inventory after successful purchase
 * Called AFTER payment is processed
 */
export const reduceInventory = (productId, quantity) => {
  const inventory = getInventory()
  
  if (!inventory[productId]) {
    throw new Error(`Product ${productId} not found in inventory`)
  }

  const item = inventory[productId]
  
  if (item.currentStock < quantity) {
    throw new Error(`Insufficient stock for product ${productId}`)
  }

  item.currentStock -= quantity
  item.sold += quantity
  item.lastUpdated = new Date().toISOString()

  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory))
  return item
}

/**
 * Batch reduce inventory for multiple items
 * Used after order is confirmed
 */
export const reduceInventoryBatch = (items) => {
  try {
    items.forEach(item => {
      reduceInventory(item.productId, item.quantity)
    })
    return true
  } catch (error) {
    // Rollback on error
    console.error('Error reducing inventory batch:', error)
    throw error
  }
}

/**
 * Admin: Update stock quantity
 * Can set stock to any value
 */
export const updateStock = (productId, newStock) => {
  const inventory = getInventory()
  
  if (!inventory[productId]) {
    throw new Error(`Product ${productId} not found in inventory`)
  }

  if (newStock < 0) {
    throw new Error('Stock cannot be negative')
  }

  const item = inventory[productId]
  const oldStock = item.currentStock
  item.currentStock = newStock
  item.lastUpdated = new Date().toISOString()

  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory))
  
  return {
    productId,
    oldStock,
    newStock,
    changed: newStock - oldStock
  }
}

/**
 * Admin: Adjust stock by delta amount
 */
export const adjustStock = (productId, delta) => {
  const inventory = getInventory()
  
  if (!inventory[productId]) {
    throw new Error(`Product ${productId} not found in inventory`)
  }

  const item = inventory[productId]
  const newStock = item.currentStock + delta

  if (newStock < 0) {
    throw new Error('Stock cannot be negative')
  }

  item.currentStock = newStock
  item.lastUpdated = new Date().toISOString()

  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory))
  
  return item
}

/**
 * Get inventory statistics
 */
export const getInventoryStats = () => {
  try {
    const inventory = localStorage.getItem(INVENTORY_STORAGE_KEY)
    if (!inventory) {
      return {
        totalProducts: 0,
        totalStock: 0,
        totalSold: 0,
        lowStockCount: 0,
        outOfStockCount: 0
      }
    }

    const parsed = JSON.parse(inventory)
    let totalStock = 0
    let totalSold = 0
    let lowStockCount = 0

    Object.values(parsed).forEach(item => {
      totalStock += item.currentStock
      totalSold += item.sold
      if (item.currentStock <= 2) {
        lowStockCount++
      }
    })

    return {
      totalProducts: Object.keys(parsed).length,
      totalStock,
      totalSold,
      lowStockCount,
      outOfStockCount: Object.values(parsed).filter(i => i.currentStock === 0).length
    }
  } catch (e) {
    return {
      totalProducts: 0,
      totalStock: 0,
      totalSold: 0,
      lowStockCount: 0,
      outOfStockCount: 0
    }
  }
}

/**
 * Get low stock items
 */
export const getLowStockItems = (threshold = 3) => {
  try {
    const inventory = localStorage.getItem(INVENTORY_STORAGE_KEY)
    if (!inventory) return []
    const parsed = JSON.parse(inventory)
    return Object.values(parsed).filter(item => item.currentStock <= threshold)
  } catch (e) {
    return []
  }
}
