import React, { createContext, useReducer, useEffect } from 'react'
import { cartReducer, initialCartState, cartActions } from './cartReducer'
import { getProductStock } from '../services/inventory'

const CartContext = createContext()

/**
 * Cart Context for managing shopping cart state
 *
 * Design decisions:
 * - Uses useReducer for complex state management
 * - Persists cart to localStorage
 * - Supports quantity updates and item removal
 * - Calculates totals automatically
 * - Validates stock before adding items
 *
 * Features:
 * - Prevents adding more items than available stock
 * - Persists cart across sessions
 * - Automatic calculation of totals
 * - Maximum quantity validation
 *
 * Next steps:
 * - Add cart item forecasting for reserved inventory
 * - Implement cart expiration (keep items for 30 mins)
 */
const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: cartActions.LOAD_CART, payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  /**
   * Add item to cart with stock validation
   * Prevents adding more than available stock
   */
  const addItem = (product, variant, quantity = 1) => {
    // Validate stock
    const availableStock = getProductStock(product.id)
    
    // Check if we already have this item in cart
    const existingItem = cart.items.find(
      item => item.product.id === product.id && item.variant.id === variant.id
    )
    
    const totalQuantityInCart = existingItem ? existingItem.quantity + quantity : quantity
    
    if (totalQuantityInCart > availableStock) {
      console.warn(
        `Cannot add ${quantity} items. Only ${availableStock - (existingItem?.quantity || 0)} available.`
      )
      return false
    }

    dispatch({
      type: cartActions.ADD_ITEM,
      payload: { product, variant, quantity }
    })
    return true
  }

  const removeItem = (productId, variantId) => {
    dispatch({
      type: cartActions.REMOVE_ITEM,
      payload: { productId, variantId }
    })
  }

  /**
   * Update quantity with stock validation
   */
  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
      return
    }

    // Validate against stock
    const availableStock = getProductStock(productId)
    if (quantity > availableStock) {
      console.warn(`Cannot set quantity to ${quantity}. Only ${availableStock} available.`)
      return
    }

    dispatch({
      type: cartActions.UPDATE_QUANTITY,
      payload: { productId, variantId, quantity }
    })
  }

  const clearCart = () => {
    dispatch({ type: cartActions.CLEAR_CART })
  }

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export { CartProvider, CartContext }
