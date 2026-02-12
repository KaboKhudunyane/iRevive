import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../lib/context/useCart'

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  const handleQuantityChange = (productId, variantId, e) => {
    const quantity = parseInt(e.target.value)
    if (!isNaN(quantity)) {
      updateQuantity(productId, variantId, quantity)
    }
  }

  if (cart.items.length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          <p className="text-gray-600">Your cart is empty. Start shopping to add items!</p>
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
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2">Product</th>
              <th className="text-left py-2">Variant</th>
              <th className="text-left py-2">Price</th>
              <th className="text-left py-2">Quantity</th>
              <th className="text-left py-2">Subtotal</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map(({ product, variant, quantity }) => (
              <tr key={`${product.id}-${variant.id}`} className="border-b border-gray-200">
                <td className="py-2">{product.title}</td>
                <td className="py-2">
                  {variant.color}, {variant.storageGB}GB, {variant.condition}
                </td>
                <td className="py-2">{formatPrice(variant.priceCents)}</td>
                <td className="py-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(product.id, variant.id, e)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="py-2">{formatPrice(variant.priceCents * quantity)}</td>
                <td className="py-2">
                  <button
                    onClick={() => removeItem(product.id, variant.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Clear Cart
          </button>
          <div className="text-xl font-bold">Total: {formatPrice(totalPrice)}</div>
        </div>
        <div className="mt-6 text-right">
          <a
            href="/checkout"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CartPage
