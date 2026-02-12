import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Products from './pages/products'
import ProductDetail from './pages/product'
import Cart from './pages/cart'
import Checkout from './pages/checkout'
import Admin from './pages/admin'

/**
 * Main App component with routing setup
 *
 * Design decisions:
 * - Uses React Router for client-side routing
 * - Clean, minimal layout with gray background for Apple-like aesthetic
 * - Routes follow RESTful conventions
 *
 * Next steps:
 * - Add authentication guards for admin routes
 * - Implement 404 page for invalid routes
 * - Add loading states and error boundaries
 * - Consider adding scroll-to-top functionality on route changes
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
