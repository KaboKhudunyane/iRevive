import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../lib/context/useCart'
import { createOrder, ORDER_STATUS } from '../lib/services/orders'
import { reduceInventoryBatch, hasStock } from '../lib/services/inventory'

/**
 * Checkout Page
 * 
 * Handles:
 * 1. Order review
 * 2. Order creation
 * 3. Inventory reduction (after successful order)
 * 4. Cart clearing
 * 5. Redirect to confirmation
 * 
 * Current: Mock checkout (no real payment processing)
 * Future: Integrate Stripe or other payment provider
 */
const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderCreated, setOrderCreated] = useState(null)

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  if (cart.items.length === 0 && !orderCreated) {
    return (
      <>
        <Header />
        <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>
            <p className="text-gray-600 mb-6">Your cart is empty. Add items before checking out.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  /**
   * Validate stock before creating order
   */
  const validateStock = () => {
    for (const item of cart.items) {
      if (!hasStock(item.product.id, item.quantity)) {
        throw new Error(`Not enough stock for ${item.product.title}`)
      }
    }
    return true
  }

  /**
   * Handle order creation and checkout
   */
  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Validate stock
      validateStock()

      // 2. Create order
      const order = await createOrder(cart.items)
      console.log('Order created:', order)

      // 3. Reduce inventory for each item
      const inventoryItems = cart.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
      reduceInventoryBatch(inventoryItems)

      // 4. Clear cart
      clearCart()

      // 5. Set order as created
      setOrderCreated(order)

      // 6. Redirect to confirmation after 2 seconds
      setTimeout(() => {
        navigate(`/order-confirmation/${order.id}`)
      }, 2000)

    } catch (err) {
      setError(err.message || 'Failed to process order. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Show order confirmation
  if (orderCreated) {
    return (
      <>
        <Header />
        <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="text-6xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">Your order has been successfully created.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-gray-600">
                <strong>Order ID:</strong> {orderCreated.id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total:</strong> {formatPrice(orderCreated.totalCents)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> <span className="text-blue-600 font-semibold">{orderCreated.status}</span>
              </p>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Redirecting to order details page...
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.variant.priceCents * item.quantity,
    0
  )

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 max-w-2xl my-8">
        <h1 className="text-4xl font-bold mb-8 text-black">Order Review</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded border border-red-300">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Order Items</h2>
          <div className="bg-white rounded-lg shadow-md divide-y">
            {cart.items.map(({ product, variant, quantity }) => (
              <div key={`${product.id}-${variant.id}`} className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-black">{product.title}</h3>
                  <p className="text-sm text-gray-600">
                    {variant.color}, {variant.storageGB}GB, {variant.condition}
                  </p>
                  <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">{formatPrice(variant.priceCents * quantity)}</p>
                  <p className="text-sm text-gray-600">{formatPrice(variant.priceCents)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-black">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-semibold text-black">FREE</span>
            </div>
            <div className="border-t border-gray-300 pt-4 flex justify-between">
              <span className="text-lg font-bold text-black">Total:</span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Payment Notice */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Payment processing will be added in the next phase. 
            For now, click "Place Order" to confirm your order.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/cart')}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back to Cart
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CheckoutPage
