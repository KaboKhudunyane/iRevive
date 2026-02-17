import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Products from './pages/products'
import ProductDetail from './pages/product'
import Cart from './pages/cart'
import Checkout from './pages/checkout'
import OrderConfirmation from './pages/order_confirmation'
import Admin from './pages/admin'
import AdminLogin from './pages/admin_login'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * Main App component with routing setup
 *
 * Design decisions:
 * - Uses React Router for client-side routing
 * - ProtectedRoute guards /admin from unauthorized access
 * - /admin/login is public for authentication
 * - Clean, minimal layout with gray background for Apple-like aesthetic
 * - Routes follow RESTful conventions
 *
 * Next steps:
 * - Add authentication guards for admin routes ✓
 * - Implement 404 page for invalid routes ✓
 * - Add loading states and error boundaries ✓
 * - Consider adding scroll-to-top functionality on route changes
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
