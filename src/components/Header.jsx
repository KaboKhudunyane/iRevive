import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Header Component with Mobile Navigation
 * 
 * Features:
 * - Responsive mobile hamburger menu
 * - Clean navigation with proper spacing
 * - Touch-friendly button targets (48px minimum)
 * - Apple-inspired design
 * - Mobile-first responsive design
 */
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-gray-900 to-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-bold text-white hover:text-gray-200 transition-colors">
            iRevive
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-white transition-colors font-medium">
              Products
            </Link>
            <Link to="/cart" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Cart
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-700 py-4 space-y-3">
            <Link
              to="/"
              className="block px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
