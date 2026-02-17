import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../lib/context/useAdmin'
import Header from '../components/Header'
import Footer from '../components/Footer'

/**
 * Admin Login Page
 * 
 * Test credentials:
 * Username: admin
 * Password: admin123
 */
const AdminLogin = () => {
  const navigate = useNavigate()
  const { login, error, clearError, loading } = useAdmin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    clearError()

    if (!username || !password) {
      setLoginError('Please enter both username and password')
      return
    }

    const result = await login(username, password)

    if (result.success) {
      navigate('/admin')
    } else {
      setLoginError(result.error || 'Login failed')
    }
  }

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">Admin Login</h1>

            {(loginError || error) && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-300">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{loginError || error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter username"
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Test credentials info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Test Credentials:</span>
              </p>
              <p className="text-sm text-gray-700">
                Username: <code className="bg-gray-200 px-2 py-1 rounded">admin</code>
              </p>
              <p className="text-sm text-gray-700">
                Password: <code className="bg-gray-200 px-2 py-1 rounded">admin123</code>
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">
                Replace with real backend authentication in production
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AdminLogin
