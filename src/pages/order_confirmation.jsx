import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getOrderById } from '../lib/services/orders'

/**
 * Order Confirmation Page
 * Shows order details and next steps
 */
const OrderConfirmation = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = getOrderById(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading order details...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 max-w-2xl my-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Here's your order confirmation.</p>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Order ID</p>
              <p className="font-mono text-lg font-bold text-black">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Order Date</p>
              <p className="text-lg font-semibold text-black">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <p className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-black mb-4">Order Items</h2>
          <div className="divide-y">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-black">{item.productTitle}</h3>
                  <p className="text-sm text-gray-600">
                    {item.variantColor}, {item.variantStorage}GB, {item.variantCondition}
                  </p>
                  <p className="text-sm text-gray-600">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">{formatPrice(item.subtotalCents)}</p>
                  <p className="text-sm text-gray-600">{formatPrice(item.priceCents)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">Subtotal:</span>
            <span className="font-semibold text-black">{formatPrice(order.totalCents)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">Shipping:</span>
            <span className="font-semibold text-black">FREE</span>
          </div>
          <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-black">Total:</span>
            <span className="text-2xl font-bold text-blue-600">{formatPrice(order.totalCents)}</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-3">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Order received and confirmed</li>
            <li>⏳ Your order will be processed shortly</li>
            <li>📦 We'll notify you when it's shipped</li>
            <li>📍 Track your package from the confirmation email</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/products"
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-bold rounded-lg text-center hover:bg-gray-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default OrderConfirmation
