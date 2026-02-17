import React, { createContext, useState, useEffect } from 'react'

const AdminContext = createContext()

/**
 * Admin Authentication Context
 *
 * Design decisions:
 * - Mock authentication system using localStorage (for development)
 * - Hardcoded admin credentials for prototyping
 * - JWT/real backend can be added later without changing this interface
 * - Protects /admin route from unauthorized access
 *
 * Future: Replace with real backend authentication
 * Credentials: username="admin", password="admin123" (for testing only)
 */
const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if admin is already logged in on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token')
    const adminData = localStorage.getItem('admin_user')
    
    if (adminToken && adminData) {
      try {
        const user = JSON.parse(adminData)
        setAdminUser(user)
        setIsAdmin(true)
      } catch (e) {
        console.error('Error parsing admin data:', e)
        logout()
      }
    }
    setLoading(false)
  }, [])

  /**
   * Mock admin login
   * In production, this would call a real backend API
   */
  const login = async (username, password) => {
    setError(null)
    setLoading(true)

    try {
      // Mock validation - hardcoded credentials for testing
      if (username === 'admin' && password === 'admin123') {
        const user = {
          id: 'admin_1',
          username: 'admin',
          email: 'admin@irevive.com',
          role: 'admin',
          loginAt: new Date().toISOString()
        }

        // Mock token (in real app, this would come from backend)
        const token = btoa(JSON.stringify({ user, timestamp: Date.now() }))

        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_user', JSON.stringify(user))

        setAdminUser(user)
        setIsAdmin(true)

        return { success: true }
      } else {
        setError('Invalid credentials. Use username: "admin", password: "admin123"')
        return { success: false, error: 'Invalid credentials' }
      }
    } catch (err) {
      setError('Login failed: ' + err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout admin user
   */
  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setAdminUser(null)
    setIsAdmin(false)
    setError(null)
  }

  const value = {
    isAdmin,
    adminUser,
    loading,
    error,
    login,
    logout,
    clearError: () => setError(null)
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export { AdminProvider, AdminContext }
