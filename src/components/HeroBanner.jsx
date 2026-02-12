import React from 'react'
import { Link } from 'react-router-dom'

const HeroBanner = () => {
  return (
<section className="bg-black text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Refurbished iPhones at Great Prices
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Discover high-quality refurbished iPhones and accessories. Trusted by thousands of customers.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            to="/cart"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            View Cart
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
