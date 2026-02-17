import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../lib/context/useCart'

/**
 * Product Card Component - Mobile Optimized
 * 
 * Features:
 * - Responsive design (works on mobile, tablet, desktop)
 * - Touch-friendly buttons (48px minimum height)
 * - Better visual hierarchy
 * - Loading states
 * - Improved spacing and contrast
 */
const ProductCard = ({ product }) => {
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  /**
   * Check if product has in-stock variants
   */
  const isInStock = () => {
    if (!product.variants || product.variants.length === 0) {
      return false
    }
    return product.variants.some(v => v.stock > 0)
  }

  const inStockCount = product.variants?.filter(v => v.stock > 0).length || 0

  /**
   * Handle add to cart with loading state
   */
  const handleAddToCart = async () => {
    if (!product.variants || product.variants.length === 0) {
      return
    }
    
    const variant = product.variants.find(v => v.stock > 0)
    if (!variant) {
      return
    }

    try {
      setLoading(true)
      addItem(product, variant, 1)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative bg-gray-100 overflow-hidden aspect-square sm:aspect-square">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/assets/placeholder.jpg'
          }}
        />
        
        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          {isInStock() ? (
            <span className="inline-block bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
              ✓ In Stock
            </span>
          ) : (
            <span className="inline-block bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-900 line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Price */}
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          {formatPrice(product.basePrice)}
        </p>

        {/* Variants Info */}
        {product.variants && product.variants.length > 0 && (
          <p className="text-gray-500 text-xs sm:text-sm mb-3">
            <span className="text-blue-600 font-medium">{inStockCount}</span> variant{inStockCount !== 1 ? 's' : ''} available
          </p>
        )}

        {/* Buttons Container */}
        <div className="flex gap-2 mt-auto pt-2">
          <Link
            to={`/product/${product.slug}`}
            className="flex-1 bg-gray-900 text-white px-3 py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors text-center font-semibold text-sm sm:text-base active:scale-95 transition-transform"
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock() || loading}
            className={`flex-1 px-3 py-2.5 sm:py-3 rounded-lg transition-all font-semibold text-sm sm:text-base active:scale-95 transition-transform ${
              isInStock()
                ? addedToCart
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } ${loading ? 'opacity-75' : ''}`}
          >
            {loading ? '...' : (addedToCart ? '✓ Added' : 'Add')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
