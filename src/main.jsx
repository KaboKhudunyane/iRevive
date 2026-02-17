import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from './lib/context/CartContext'
import { AdminProvider } from './lib/context/AdminContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AdminProvider>
  </StrictMode>,
)
