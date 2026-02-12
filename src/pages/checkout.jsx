import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../lib/context/useCart'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

const CheckoutPage = () => {
  const { cart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.items })
      })

      const data = await response.json()

      if (data.sessionId) {
        const stripe = await stripePromise
        const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
        if (error) {
          setError(error.message)
          setLoading(false)
        }
      } else {
        setError('Failed to create checkout session.')
        setLoading(false)
      }
    } catch {
      setError('An error occurred during checkout.')
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <p className="text-gray-600">Your cart is empty. Add items before checking out.</p>
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
      <main className="container mx-auto p-4 max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <ul className="mb-4">
            {cart.items.map(({ product, variant, quantity }) => (
              <li key={`${product.id}-${variant.id}`} className="mb-2">
                {product.title} ({variant.color}, {variant.storageGB}GB, {variant.condition}) x {quantity} - {formatPrice(variant.priceCents * quantity)}
              </li>
            ))}
          </ul>
          <div className="text-lg font-bold">Total: {formatPrice(totalPrice)}</div>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </main>
      <Footer />
    </>
  )
}

export default CheckoutPage
