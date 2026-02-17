import React, { createContext, useReducer, useEffect } from 'react'
import { cartReducer, initialCartState, cartActions } from './cartReducer'

const CartContext = createContext()

/**
 * Cart Context for managing shopping cart state
 *
 * Design decisions:
 * - Uses useReducer for complex state management
 * - Persists cart to localStorage
 * - Supports quantity updates and item removal
 * - Calculates totals automatically
 * - Validates stock at VARIANT level (not product level)
 * - Each variant has independent stock tracking
 *
 * Features:
 * - Prevents adding more items than available variant stock
 * - Persists cart across sessions
 * - Automatic calculation of totals
 * - Maximum quantity validation against variant stock
 * - Works with variant-level inventory system
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
   * Add item to cart with variant-level stock validation
   * Each variant has independent stock tracking
   * Prevents adding more than available variant stock
   */
  const addItem = (product, variant, quantity = 1) => {
    // Validate against variant stock (not product stock)
    const availableStock = variant.stock || 0
    
    // Check if we already have this exact variant in cart
    const existingItem = cart.items.find(
      item => item.product.id === product.id && item.variant.id === variant.id
    )
    
    const totalQuantityInCart = existingItem ? existingItem.quantity + quantity : quantity
    
    if (totalQuantityInCart > availableStock) {
      const remaining = availableStock - (existingItem?.quantity || 0)
      console.warn(
        `Cannot add ${quantity} items. Only ${remaining} available for this variant.`
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
   * Update quantity with variant-level stock validation
   */
  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
      return
    }

    // Get the item to access its variant stock
    const item = cart.items.find(
      item => item.product.id === productId && item.variant.id === variantId
    )
    
    if (!item) {
      console.error('Item not found in cart')
      return
    }

    // Validate against variant stock (not product stock)
    const availableStock = item.variant.stock || 0
    if (quantity > availableStock) {
      console.warn(`Cannot set quantity to ${quantity}. Only ${availableStock} available for this variant.`)
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
