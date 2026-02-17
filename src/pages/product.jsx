import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductBySlug, getProductVariants, getAvailableColorsForProduct, getAvailableStoragesForColor, getAvailableConditionsForStorage, findVariant, getVariantPrice } from '../lib/services/products'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../lib/context/useCart'

/**
 * ProductPage component with variant-level inventory
 *
 * Design decisions:
 * - Show only colors that have in-stock variants
 * - Show only storage sizes available for selected color (with stock)
 * - Show only conditions available for selected color + storage (with stock)
 * - Unavailable variants are shown but grayed out/disabled
 * - Each variant has independent stock tracking
 * - Price can vary by storage, condition, and color
 *
 * Stock Logic (per variant):
 * - Each variant has individual stock
 * - Users can only select available variants
 * - Stock checked at variant level before checkout
 * - Stock reduced per variant after order
 */
const ProductPage = () => {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [allVariants, setAllVariants] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedStorage, setSelectedStorage] = useState(null)
  const [selectedCondition, setSelectedCondition] = useState(null)
  const [availableColors, setAvailableColors] = useState([])
  const [availableStorages, setAvailableStorages] = useState([])
  const [availableConditions, setAvailableConditions] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [variantPrice, setVariantPrice] = useState(0)
  const [addedFeedback, setAddedFeedback] = useState(false)

  useEffect(() => {
    const fetchProduct = () => {
      const data = getProductBySlug(slug)
      if (data) {
        setProduct(data)
        
        // Get all variants for this product
        const variants = getProductVariants(data.id)
        setAllVariants(variants)
        
        // Get only colors with in-stock variants
        const colors = getAvailableColorsForProduct(data.id)
        setAvailableColors(colors)
        setSelectedColor(colors[0] || null)
      }
    }
    fetchProduct()
  }, [slug])

  // Update available storages and conditions when color changes
  useEffect(() => {
    if (!product || !selectedColor) return

    // Get storages available for this color with stock
    const storages = getAvailableStoragesForColor(product.id, selectedColor)
    setAvailableStorages(storages)
    setSelectedStorage(storages[0] || null)
  }, [product, selectedColor])

  // Update available conditions when storage changes
  useEffect(() => {
    if (!product || !selectedColor || !selectedStorage) return

    const conditions = getAvailableConditionsForStorage(product.id, selectedColor, selectedStorage)
    setAvailableConditions(conditions)
    setSelectedCondition(conditions[0] || null)
  }, [product, selectedColor, selectedStorage])
  // Update selected variant and price when selections change
  useEffect(() => {
    if (!product || !selectedColor || !selectedStorage || !selectedCondition) {
      setSelectedVariant(null)
      setVariantPrice(0)
      return
    }

    const variant = findVariant(product.id, selectedColor, selectedStorage, selectedCondition)
    setSelectedVariant(variant)

    if (variant) {
      const price = getVariantPrice(variant.id, product.basePrice)
      setVariantPrice(price)
    }
  }, [product, selectedColor, selectedStorage, selectedCondition])

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  /**
   * Get variant details including stock
   */
  const getVariantDetails = () => {
    if (!selectedVariant) return null
    return {
      variant: selectedVariant,
      price: variantPrice,
      inStock: selectedVariant.stock > 0,
      stock: selectedVariant.stock
    }
  }

  /**
   * Handle add to cart with stock validation
   */
  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a variant')
      return
    }

    const details = getVariantDetails()
    if (!details.inStock) {
      alert('This variant is out of stock')
      return
    }

    if (quantity > details.stock) {
      alert(`Only ${details.stock} item(s) available for this variant`)
      return
    }

    // Add to cart with variant
    addItem(product, selectedVariant, quantity)

    // Show feedback
    setAddedFeedback(true)
    setTimeout(() => {
      setAddedFeedback(false)
      setQuantity(1)
    }, 2000)
  }

  /**
   * Check if variant is available
   */
  const isVariantAvailable = (color, storage, condition) => {
    const variant = findVariant(product.id, color, storage, condition)
    return variant && variant.stock > 0
  }

  /**
   * Get all variants for a specific state
   */
  const getAllVariantsForColor = (color) => {
    return allVariants.filter(v => v.color === color)
  }

  const getAllVariantsForStorage = (color, storage) => {
    return allVariants.filter(v => v.color === color && v.storage === storage)
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⌛</div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const variantDetails = getVariantDetails()

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 my-6 sm:my-8">
          {/* Product Image */}
          <div className="flex items-start sticky top-20 sm:top-24">
            <div className="w-full aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100">
              <img
                src={selectedVariant ? selectedVariant.image : product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/placeholder.jpg'
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gray-900">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-4 sm:mb-6">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                {variantPrice > 0 ? formatPrice(variantPrice) : formatPrice(product.basePrice)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Price varies by color, storage, and condition
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6 sm:mb-8">
              {selectedVariant ? (
                variantDetails.inStock ? (
                  <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                    <span className="text-lg">✓</span>
                    In Stock ({variantDetails.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold text-sm">
                    <span className="text-lg">✗</span>
                    Out of Stock
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-semibold text-sm">
                  Select options below
                </span>
              )}
            </div>

            {/* Variant Selectors */}
            <div className="space-y-6 sm:space-y-8 mb-8">
              {/* Color Selection */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                  Color {selectedColor && <span className="text-gray-600 font-normal">- {selectedColor}</span>}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map(color => {
                    const hasInStockVariant = getAllVariantsForColor(color).some(v => v.stock > 0)
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 transition-all relative flex-shrink-0 ${
                          selectedColor === color
                            ? 'border-blue-600 ring-2 ring-blue-300 ring-offset-2'
                            : 'border-gray-200'
                        } ${!hasInStockVariant ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-md'}`}
                        style={{ backgroundColor: getColorValue(color) }}
                        title={`${color}${!hasInStockVariant ? ' (out of stock)' : ''}`}
                        disabled={!hasInStockVariant}
                        aria-label={`Select ${color} color`}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Storage Selection */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                  Storage {selectedStorage && <span className="text-gray-600 font-normal">- {selectedStorage}GB</span>}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availableStorages.map(storage => {
                    const hasInStockVariant = getAllVariantsForStorage(selectedColor, storage).some(v => v.stock > 0)
                    return (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        disabled={!hasInStockVariant}
                        className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border-2 font-semibold text-sm transition-all flex-shrink-0 ${
                          selectedStorage === storage
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : hasInStockVariant
                            ? 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                            : 'border-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {storage}GB
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Condition Selection */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                  Condition {selectedCondition && <span className="text-gray-600 font-normal">- {selectedCondition}</span>}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availableConditions.map(condition => {
                    const variant = findVariant(product.id, selectedColor, selectedStorage, condition)
                    const isAvailable = variant && variant.stock > 0
                    return (
                      <button
                        key={condition}
                        onClick={() => setSelectedCondition(condition)}
                        disabled={!isAvailable}
                        className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border-2 font-semibold text-sm transition-all flex-shrink-0 ${
                          selectedCondition === condition
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : isAvailable
                            ? 'border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                            : 'border-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {condition}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4 mt-auto">
              {/* Quantity Selector */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0 && val <= (selectedVariant?.stock || 1)) {
                        setQuantity(val);
                      }
                    }}
                    className="w-14 text-center py-2 border-none focus:outline-none text-lg font-semibold"
                  />
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedVariant?.stock || 1, quantity + 1)
                      )
                    }
                    disabled={
                      !selectedVariant ||
                      selectedVariant.stock === 0 ||
                      quantity >= (selectedVariant?.stock || 0)
                    }
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={!selectedVariant || selectedVariant.stock === 0}
                onClick={handleAddToCart}
                className={`w-full px-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all active:scale-95 ${
                  addedFeedback
                    ? 'bg-green-500 text-white'
                    : selectedVariant && selectedVariant.stock > 0
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {addedFeedback ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

            {/* Product Details Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Product Info</h4>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                <li>• Free shipping on all orders</li>
                <li>• 30-day returns policy</li>
                <li>• 12-month warranty included</li>
                <li>• Quality checked before dispatch</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

/**
 * Helper function to map color names to CSS colors for better UX
 */
const getColorValue = (color) => {
  const colorMap = {
    'Black': '#1f1f1f',
    'White': '#f8f8f8',
    'Red': '#dc2626',
    'Blue': '#2563eb',
    'Green': '#16a34a',
    'Purple': '#9333ea',
    'Pink': '#ec4899',
    'Gold': '#d4af37',
    'Silver': '#c0c0c0',
    'Space Gray': '#4b5563',
    'Midnight': '#1e293b',
    'Starlight': '#f1f5f9',
    'Alpine Green': '#4ade80',
    'Sierra Blue': '#3b82f6',
    'Graphite': '#374151',
    'Midnight Green': '#064e3b',
    'Black Titanium': '#0f172a',
    'White Titanium': '#f8fafc',
    'Blue Titanium': '#1e40af'
  }
  return colorMap[color] || '#6b7280'
}

export default ProductPage
