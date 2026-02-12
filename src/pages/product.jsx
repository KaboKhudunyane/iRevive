import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../lib/api/products'
import Header from '../components/Header'
import { useCart } from '../lib/context/useCart'

/**
 * ProductPage component with improved UI/UX for variant selection
 *
 * Design decisions:
 * - Show color palette based on available variants for the selected phone model
 * - Show storage size options filtered by selected color
 * - Show condition grades as part of variant selection
 * - Disable Add to Cart if selected variant is out of stock
 * - Use clear visual cues for selected options
 *
 * Next steps:
 * - Integrate with cart state management
 * - Add quantity selector
 * - Add user feedback on add to cart
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

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(slug)
      setProduct(data)
      if (data) {
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

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4">Loading...</div>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={selectedVariant ? selectedVariant.image : product.images[0]}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/assets/placeholder.jpg'
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              {selectedVariant ? formatPrice(selectedVariant.priceCents) : formatPrice(product.priceCents)}
            </p>

            {/* Color selection */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Color:</h3>
              <div className="flex space-x-3">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? 'border-blue-600' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: getColorValue(color) }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Storage selection */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Storage:</h3>
              <div className="flex space-x-3">
                {availableStorages.map(storage => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 rounded border-2 ${
                      selectedStorage === storage ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    {storage} GB
                  </button>
                ))}
              </div>
            </div>

            {/* Condition selection */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Condition:</h3>
              <div className="flex space-x-3">
                {availableConditions.map(condition => (
                  <button
                    key={condition}
                    onClick={() => setSelectedCondition(condition)}
                    className={`px-4 py-2 rounded border-2 ${
                      selectedCondition === condition ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!selectedVariant || selectedVariant.inventory === 0}
              onClick={() => {
                if (selectedVariant && selectedVariant.inventory > 0) {
                  addItem(product, selectedVariant, 1)
                  alert('Item added to cart!')
                }
              }}
              className={`px-6 py-3 rounded text-white transition-colors ${
                selectedVariant && selectedVariant.inventory > 0
                  ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedVariant && selectedVariant.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

// Helper function to map color names to CSS colors
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
