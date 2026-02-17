import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../lib/context/useCart'
import { createOrder, ORDER_STATUS } from '../lib/services/orders'
import { reduceVariantStock, getVariantPrice } from '../lib/services/products'

/**
 * Checkout Page
 * 
 * Handles:
 * 1. Order review
 * 2. Order creation
 * 3. Variant stock reduction (after successful order)
 * 4. Cart clearing
 * 5. Redirect to confirmation
 * 
 * Features:
 * - Mobile-first responsive design
 * - Clear order review
 * - Error handling
 * - Stock validation
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
        <main className="container mx-auto px-4 py-8 sm:py-12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">Checkout</h1>
            <p className="text-gray-600 mb-8">Your cart is empty. Add items before checking out.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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
      if (item.variant.stock < item.quantity) {
        throw new Error(`Not enough stock for ${item.product.title} (${item.variant.color}, ${item.variant.storage}GB)`)
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
      // 1. Validate stock at variant level
      validateStock()

      // 2. Create order
      const order = await createOrder(cart.items)
      console.log('Order created:', order)

      // 3. Reduce variant stock for each item
      for (const item of cart.items) {
        if (item.variant && item.variant.id) {
          reduceVariantStock(item.variant.id, item.quantity)
        }
      }

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
        <main className="container mx-auto px-4 py-8 sm:py-12 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md w-full">
            <div className="mb-6">
              <div className="text-6xl mb-4">✓</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">Your order has been successfully created.</p>
            </div>
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6 text-left border border-gray-200">
              <div className="space-y-3">
                <p className="text-sm">
                  <strong className="text-gray-900">Order ID:</strong>{' '}
                  <span className="text-gray-600 break-all text-xs">{orderCreated.id}</span>
                </p>
                <p className="text-sm">
                  <strong className="text-gray-900">Total:</strong>{' '}
                  <span className="text-gray-600 font-semibold">{formatPrice(orderCreated.totalCents)}</span>
                </p>
                <p className="text-sm">
                  <strong className="text-gray-900">Status:</strong>{' '}
                  <span className="text-blue-600 font-semibold">{orderCreated.status}</span>
                </p>
              </div>
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

  const totalPrice = cart.items.reduce((total, item) => {
    const variantPrice = getVariantPrice(item.variant.id, item.product.basePrice)
    return total + variantPrice * item.quantity
  }, 0)

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl min-h-screen">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Review</h1>
          <p className="text-gray-600 text-sm mt-2">Review and confirm your order before completing purchase</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            <p className="font-semibold text-sm sm:text-base mb-1">Order Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {cart.items.map(({ product, variant, quantity }) => {
                const variantPrice = getVariantPrice(variant.id, product.basePrice)
                return (
                  <div
                    key={`${product.id}-${variant.id}`}
                    className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {product.title}
                        </h3>
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium text-gray-900">{variant.color}</span>
                            {' • '}
                            <span className="font-medium text-gray-900">{variant.storage}GB</span>
                            {' • '}
                            <span className="font-medium text-gray-900">{variant.condition}</span>
                          </p>
                          <p>Quantity: <span className="font-semibold text-gray-900">{quantity}</span></p>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="sm:text-right">
                        <p className="text-gray-600 text-sm mb-1">Subtotal</p>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          {formatPrice(variantPrice * quantity)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatPrice(variantPrice)} each
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            {/* Summary Card */}
            <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-200 p-5 sm:p-6 sticky top-20 sm:top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Summary Lines */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Information Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6">
                <p className="text-xs sm:text-sm text-blue-800">
                  <strong>Note:</strong> Payment processing will be added in the next phase. Click "Place Order" to confirm.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⌛</span>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CheckoutPage
