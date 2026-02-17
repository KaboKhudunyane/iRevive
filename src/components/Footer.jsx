import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Footer Component with Mobile Optimization
 * 
 * Features:
 * - Responsive grid layout (1 col mobile, 4 cols desktop)
 * - Proper color contrast and readability
 * - Touch-friendly links
 * - Better spacing on mobile
 */
const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">iRevive</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Your trusted source for refurbished iPhones and quality electronics at great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                <a href="mailto:info@irevive.co.za" className="hover:text-white transition-colors">
                  info@irevive.co.za
                </a>
              </li>
              <li className="text-gray-400">
                <a href="tel:+27211234567" className="hover:text-white transition-colors">
                  +27 21 123 4567
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                F
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left text-sm">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} iRevive. All rights reserved.
            </p>
            <div className="flex justify-center gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
            <p className="text-gray-400">
              Quality Refurbished Electronics
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
