import React, { useEffect, useState, useRef } from 'react'
import ProductCard from './ProductCard'
import { getProducts } from '../lib/api/products'

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-bold mb-16 text-center text-black tracking-tight">Featured Products</h2>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-8 pb-8"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {products.map(product => (
              <div
                key={product.id}
                className="flex-shrink-0 w-80"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-xl rounded-full p-4 hover:shadow-2xl transition-all duration-300 z-10 border border-gray-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-xl rounded-full p-4 hover:shadow-2xl transition-all duration-300 z-10 border border-gray-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
