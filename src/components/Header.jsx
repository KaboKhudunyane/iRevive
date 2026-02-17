import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Header Component
 * 
 * Design decisions:
 * - Admin link removed from public navbar (protected route only)
 * - Clean Apple-like header with minimal navigation
 * - Logo is immediately recognizable
 */
const Header = () => {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            iRevive
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>
            <Link to="/cart" className="text-gray-300 hover:text-white transition-colors">Cart</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
