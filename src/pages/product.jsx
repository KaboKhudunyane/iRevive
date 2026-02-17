import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../lib/api/products'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../lib/context/useCart'
import { getProductStock } from '../lib/services/inventory'

/**
 * ProductPage component with improved UI/UX for variant selection
 *
 * Design decisions:
 * - Show color palette based on available variants for the selected phone model
 * - Show storage size options filtered by selected color
 * - Show condition grades as part of variant selection
 * - Disable Add to Cart if product is out of stock
 * - Use clear visual cues for selected options
 * - Validate stock before allowing purchase
 *
 * Stock Logic:
 * - Stock is at product level (not per variant)
 * - All variants share the same inventory pool
 * - Users can buy any variant as long as stock > 0
 * - Stock is only reduced AFTER successful checkout
 */
const ProductPage = () => {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedStorage, setSelectedStorage] = useState(null)
  const [selectedCondition, setSelectedCondition] = useState(null)
  const [availableColors, setAvailableColors] = useState([])
  const [availableStorages, setAvailableStorages] = useState([])
  const [availableConditions, setAvailableConditions] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentStock, setCurrentStock] = useState(0)
  const [addedFeedback, setAddedFeedback] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(slug)
      if (data) {
        setProduct(data)
        // Get current stock from inventory service
        const stock = getProductStock(data.id)
        setCurrentStock(stock)
        
        // Extract unique colors from variants
        const colors = Array.from(new Set(data.variants.map(v => v.color)))
        setAvailableColors(colors)
        setSelectedColor(colors[0] || null)
      }
    }
    fetchProduct()
  }, [slug])

  // Update available storages and conditions when color changes
  useEffect(() => {
    if (!product || !selectedColor) return

    const filteredByColor = product.variants.filter(v => v.color === selectedColor)
    const storages = Array.from(new Set(filteredByColor.map(v => v.storageGB)))
    setAvailableStorages(storages)
    setSelectedStorage(storages[0] || null)

    const conditions = Array.from(new Set(filteredByColor.map(v => v.condition)))
    setAvailableConditions(conditions)
    setSelectedCondition(conditions[0] || null)
  }, [product, selectedColor])

  // Update selected variant when storage or condition changes
  useEffect(() => {
    if (!product || !selectedColor || !selectedStorage || !selectedCondition) {
      setSelectedVariant(null)
      return
    }
    const variant = product.variants.find(
      v =>
        v.color === selectedColor &&
        v.storageGB === selectedStorage &&
        v.condition === selectedCondition
    )
    setSelectedVariant(variant || null)
  }, [product, selectedColor, selectedStorage, selectedCondition])

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  /**
   * Check if product is in stock
   */
  const isInStock = () => {
    return currentStock > 0
  }

  /**
   * Handle add to cart with stock validation
   */
  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a variant')
      return
    }

    if (!isInStock()) {
      alert('Product is out of stock')
      return
    }

    if (quantity > currentStock) {
      alert(`Only ${currentStock} item(s) available`)
      return
    }

    // Add to cart
    addItem(product, selectedVariant, quantity)

    // Show feedback
    setAddedFeedback(true)
    setTimeout(() => {
      setAddedFeedback(false)
      setQuantity(1)
    }, 2000)
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading product...</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          {/* Product Image */}
          <div>
            <img
              src={selectedVariant ? selectedVariant.image : product.images[0]}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = '/assets/placeholder.jpg'
              }}
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4 text-black">{product.title}</h1>
            <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
            
            {/* Price */}
            <p className="text-3xl font-bold text-black mb-2">
              {selectedVariant ? formatPrice(selectedVariant.priceCents) : formatPrice(product.priceCents)}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              {isInStock() ? (
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                  ✓ In Stock ({currentStock} available)
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Color selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Color:</h3>
              <div className="flex space-x-3 flex-wrap">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: getColorValue(color) }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Storage selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Storage:</h3>
              <div className="flex space-x-3 flex-wrap">
                {availableStorages.map(storage => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 rounded border-2 font-semibold transition-all ${
                      selectedStorage === storage 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {storage} GB
                  </button>
                ))}
              </div>
            </div>

            {/* Condition selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Condition:</h3>
              <div className="flex space-x-3 flex-wrap">
                {availableConditions.map(condition => (
                  <button
                    key={condition}
                    onClick={() => setSelectedCondition(condition)}
                    className={`px-4 py-2 rounded border-2 font-semibold transition-all ${
                      selectedCondition === condition 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!isInStock()}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  −
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={!isInStock() || quantity >= currentStock}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={!isInStock() || !selectedVariant}
              onClick={handleAddToCart}
              className={`w-full px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                addedFeedback
                  ? 'bg-green-500 text-white'
                  : isInStock() && selectedVariant
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {addedFeedback ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
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
