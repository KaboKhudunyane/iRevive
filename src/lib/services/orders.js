/**
 * Order Management Service
 * 
 * Handles:
 * - Order creation
 * - Order status updates
 * - Order persistence (localStorage)
 * - Inventory management after purchase
 * 
 * In production:
 * - Replace localStorage with database
 * - Add payment processing
 * - Add webhook handling
 */

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}

/**
 * Generate unique order ID
 */
const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a new order from cart items
 * Returns order object with id, items, total, status, etc.
 */
export const createOrder = async (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cannot create order with empty cart')
  }

  // Calculate total (in cents)
  const total = cartItems.reduce(
    (sum, item) => sum + (item.variant.priceCents * item.quantity),
    0
  )

  const order = {
    id: generateOrderId(),
    items: cartItems.map(item => ({
      productId: item.product.id,
      productTitle: item.product.title,
      variantId: item.variant.id,
      variantColor: item.variant.color,
      variantStorage: item.variant.storageGB,
      variantCondition: item.variant.condition,
      priceCents: item.variant.priceCents,
      quantity: item.quantity,
      subtotalCents: item.variant.priceCents * item.quantity
    })),
    totalCents: total,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Payment info will be added after payment processing
    payment: null,
    // Shipping info placeholder
    shipping: null
  }

  // Save to localStorage (development)
  await saveOrder(order)

  return order
}

/**
 * Save order to localStorage
 */
export const saveOrder = async (order) => {
  try {
    const orders = getAllOrders()
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))
    return true
  } catch (error) {
    console.error('Error saving order:', error)
    throw error
  }
}

/**
 * Get all orders from localStorage
 */
export const getAllOrders = () => {
  try {
    const orders = localStorage.getItem('orders')
    return orders ? JSON.parse(orders) : []
  } catch (error) {
    console.error('Error retrieving orders:', error)
    return []
  }
}

/**
 * Get order by ID
 */
export const getOrderById = (orderId) => {
  const orders = getAllOrders()
  return orders.find(order => order.id === orderId)
}

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const orders = getAllOrders()
  const orderIndex = orders.findIndex(order => order.id === orderId)

  if (orderIndex === -1) {
    throw new Error('Order not found')
  }

  orders[orderIndex].status = newStatus
  orders[orderIndex].updatedAt = new Date().toISOString()

  localStorage.setItem('orders', JSON.stringify(orders))
  return orders[orderIndex]
}

/**
 * Add payment info to order
 * Called after successful payment
 */
export const addPaymentToOrder = async (orderId, paymentInfo) => {
  const orders = getAllOrders()
  const order = orders.find(o => o.id === orderId)

  if (!order) {
    throw new Error('Order not found')
  }

  order.payment = {
    ...paymentInfo,
    processedAt: new Date().toISOString()
  }

  order.status = ORDER_STATUS.PROCESSING
  order.updatedAt = new Date().toISOString()

  localStorage.setItem('orders', JSON.stringify(orders))
  return order
}

/**
 * Cancel an order
 * Can only cancel pending or processing orders
 */
export const cancelOrder = async (orderId) => {
  const order = getOrderById(orderId)

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.DELIVERED) {
    throw new Error('Cannot cancel shipped or delivered orders')
  }

  return updateOrderStatus(orderId, ORDER_STATUS.CANCELLED)
}

/**
 * Get order summary for display
 */
export const getOrderSummary = (order) => {
  return {
    id: order.id,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total: (order.totalCents / 100).toFixed(2),
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  }
}
