import React, { useEffect, useState } from 'react'
import { getProducts } from '../lib/api/products'
import ProductCard from '../components/ProductCard'

const HomePage = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">iRevive iPhone Reseller</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}

export default HomePage
