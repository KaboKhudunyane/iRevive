import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const NotFound = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
          <p className="text-gray-500 mb-8">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default NotFound
