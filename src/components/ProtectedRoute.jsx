import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../lib/context/useAdmin'

/**
 * ProtectedRoute component
 * Prevents unauthorized access to admin routes
 * Redirects non-admin users to login
 */
const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not admin, redirect to admin login page
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
