import React from 'react'

const Footer = () => {
  return (
<footer className="bg-white text-black py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">iRevive</h3>
            <p className="text-gray-400">
              Your trusted source for refurbished iPhones and accessories.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/cart" className="text-black-400 hover:text-white">Cart</a></li>
              <li><a href="/admin" className="text-black-400 hover:text-white">Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-black-400">Email: info@irevive.co.za</p>
            <p className="text-black-400">Phone: +27 21 123 4567</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-black-400 hover:text-white">Facebook</a>
              <a href="#" className="text-black-400 hover:text-white">Twitter</a>
              <a href="#" className="text-black-400 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-black-600 mt-8 pt-8 text-center">
          <p className="text-black-400">
            &copy; 2024 iRevive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
