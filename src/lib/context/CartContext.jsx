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
 *
 * Next steps:
 * - Add cart persistence across sessions
 * - Implement cart validation
 * - Add maximum quantity limits
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

  // Cart actions
  const addItem = (product, variant, quantity = 1) => {
    dispatch({
      type: cartActions.ADD_ITEM,
      payload: { product, variant, quantity }
    })
  }

  const removeItem = (productId, variantId) => {
    dispatch({
      type: cartActions.REMOVE_ITEM,
      payload: { productId, variantId }
    })
  }

  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, variantId)
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
