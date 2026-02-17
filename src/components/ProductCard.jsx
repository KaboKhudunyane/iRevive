import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../lib/context/useCart'

const ProductCard = ({ product }) => {
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = React.useState(false)

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  /**
   * Check if product is in stock
   * Stock is considered 0 when inventory is 0
   */
  const isInStock = () => {
    return product.inventory > 0
  }

  /**
   * Handle add to cart
   * Adds first available variant to cart
   */
  const handleAddToCart = () => {
    if (!product.variants || product.variants.length === 0) {
      return
    }
    
    // Add the first variant to cart
    const variant = product.variants[0]
    addItem(product, variant, 1)
    
    // Show feedback
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = '/assets/placeholder.jpg'
          }}
        />
        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2">
          {isInStock() ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              In Stock
            </span>
          ) : (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-black">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <p className="text-xl font-bold text-black mb-2">{formatPrice(product.priceCents)}</p>
        
        {/* Available Variants Info */}
        {product.variants && product.variants.length > 0 && (
          <p className="text-gray-500 text-xs mb-3">
            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} available
          </p>
        )}

        <div className="flex gap-2">
          <Link
            to={`/product/${product.slug}`}
            className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-center"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock()}
            className={`flex-1 px-4 py-2 rounded transition-colors font-semibold ${
              isInStock()
                ? addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {addedToCart ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
