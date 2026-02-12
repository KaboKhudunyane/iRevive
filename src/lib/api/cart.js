// Placeholder API functions for cart
// In a real app, these would make HTTP requests to backend

const CART_STORAGE_KEY = 'irevive_cart'

export const getCart = async () => {
  const cart = localStorage.getItem(CART_STORAGE_KEY)
  return cart ? JSON.parse(cart) : { items: [], total: 0 }
}

export const addToCart = async (productId, variantId, quantity = 1) => {
  const cart = await getCart()
  const existingItem = cart.items.find(item =>
    item.productId === productId && item.variantId === variantId
  )

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.items.push({
      productId,
      variantId,
      quantity,
      addedAt: new Date().toISOString(),
    })
  }

  // Recalculate total (placeholder)
  cart.total = cart.items.length * 10000 // Placeholder total

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  return cart
}

export const updateCartItem = async (productId, variantId, quantity) => {
  const cart = await getCart()
  const item = cart.items.find(item =>
    item.productId === productId && item.variantId === variantId
  )

  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(i =>
        !(i.productId === productId && i.variantId === variantId)
      )
    }
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  return cart
}

export const removeFromCart = async (productId, variantId) => {
  const cart = await getCart()
  cart.items = cart.items.filter(item =>
    !(item.productId === productId && item.variantId === variantId)
  )

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  return cart
}

export const clearCart = async () => {
  localStorage.removeItem(CART_STORAGE_KEY)
  return { items: [], total: 0 }
}
