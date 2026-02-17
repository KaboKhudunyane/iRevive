import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../lib/context/useCart'
import { Link } from 'react-router-dom'

/**
 * Cart Page - Mobile Optimized
 * 
 * Features:
 * - Responsive card-based layout (no tables)
 * - Touch-friendly controls
 * - Clear price breakdown
 * - Mobile-first design
 */
const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  const handleQuantityChange = (productId, variantId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, variantId, newQuantity)
    }
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const totalPrice = cart.items.reduce(
    (total, item) => total + (item.product.basePrice + (item.variant.priceAdjust || 0)) * item.quantity,
    0
  )

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8 min-h-screen">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map(({ product, variant, quantity }) => (
                <div
                  key={`${product.id}-${variant.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  {/* Mobile Layout */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Color: <span className="font-medium text-gray-900">{variant.color}</span>
                        <br />
                        Storage: <span className="font-medium text-gray-900">{variant.storage}GB</span>
                        <br />
                        Condition: <span className="font-medium text-gray-900">{variant.condition}</span>
                      </p>

                      {/* Price Info */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatPrice(product.basePrice + (variant.priceAdjust || 0))}
                        </span>
                        {variant.priceAdjust !== 0 && (
                          <span className="text-xs text-gray-500">
                            ({variant.priceAdjust > 0 ? '+' : ''}{formatPrice(variant.priceAdjust)})
                          </span>
                        )}
                      </div>

                      {/* Quantity and Remove */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2">
                          <label htmlFor={`qty-${product.id}-${variant.id}`} className="text-sm text-gray-600">
                            Qty:
                          </label>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(product.id, variant.id, quantity - 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <input
                              id={`qty-${product.id}-${variant.id}`}
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value)
                                if (!isNaN(val) && val > 0) {
                                  handleQuantityChange(product.id, variant.id, val)
                                }
                              }}
                              className="w-12 text-center py-1 border-none focus:outline-none"
                            />
                            <button
                              onClick={() => handleQuantityChange(product.id, variant.id, quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(product.id, variant.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="sm:text-right">
                      <p className="text-gray-600 text-sm mb-1">Subtotal</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        {formatPrice((product.basePrice + (variant.priceAdjust || 0)) * quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
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
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full block text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold mb-3 active:scale-95"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="w-full block text-center px-4 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 transition-colors font-semibold mb-4"
              >
                Continue Shopping
              </Link>

              {/* Clear Cart */}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart()
                  }
                }}
                className="w-full px-4 py-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CartPage
