import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  return (
<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/assets/placeholder.jpg'
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-black">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <p className="text-xl font-bold text-black mb-2">{formatPrice(product.priceCents)}</p>
        <Link
          to={`/product/${product.slug}`}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors inline-block"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
