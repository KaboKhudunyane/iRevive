import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAdmin } from '../lib/context/useAdmin'
import { getProducts } from '../lib/api/products'
import { getInventory, updateStock, getInventoryStats } from '../lib/services/inventory'
import { getAllOrders, updateOrderStatus, ORDER_STATUS } from '../lib/services/orders'

/**
 * Admin Dashboard
 * 
 * Features:
 * - Dashboard with KPIs
 * - Product inventory management
 * - Order management with status updates
 * - Admin panel access control
 * 
 * Note: Requires admin authentication to access
 */
const AdminPage = () => {
  const navigate = useNavigate()
  const { adminUser, logout } = useAdmin()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [inventory, setInventory] = useState({})
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingStock, setEditingStock] = useState(null)
  const [newStockValue, setNewStockValue] = useState('')
  const [stats, setStats] = useState(null)

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await getProducts()
        const inventoryData = getInventory()
        const ordersData = getAllOrders()
        
        setProducts(productsData)
        setInventory(inventoryData)
        setOrders(ordersData)
        setStats(getInventoryStats())
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Handle stock update
   */
  const handleUpdateStock = (productId, newValue) => {
    try {
      updateStock(productId, parseInt(newValue))
      const updated = getInventory()
      setInventory(updated)
      setStats(getInventoryStats())
      setEditingStock(null)
      setNewStockValue('')
    } catch (error) {
      alert('Error updating stock: ' + error.message)
    }
  }

  /**
   * Handle order status change
   */
  const handleOrderStatusChange = (orderId, newStatus) => {
    try {
      updateOrderStatus(orderId, newStatus)
      const updated = getAllOrders()
      setOrders(updated)
    } catch (error) {
      alert('Error updating order: ' + error.message)
    }
  }

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto p-4 min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Loading admin dashboard...</p>
        </main>
        <Footer />
      </>
    )
  }

  // Dashboard tab content
  const DashboardTab = () => (
    <div>
      {/* User Info */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Logged in as</p>
          <p className="text-lg font-semibold text-blue-900">{adminUser?.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalProducts || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Stock</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalStock || 0} units</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Sold</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalSold || 0} units</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.lowStockCount || 0} items</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-black">Recent Orders</h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-6 text-gray-600 text-center">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-3 text-sm font-mono text-gray-900">{order.id}</td>
                    <td className="px-6 py-3 text-sm font-bold text-black">{formatPrice(order.totalCents)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  // Inventory Management tab
  const InventoryTab = () => (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {stats?.lowStockCount > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-800">
            <strong>⚠️ Warning:</strong> {stats.lowStockCount} product(s) have low stock levels
          </p>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => {
              const inv = inventory[product.id]
              const isLowStock = inv && inv.currentStock <= 2
              
              return (
                <tr key={product.id} className={isLowStock ? 'bg-orange-50' : ''}>
                  <td className="px-6 py-3">
                    <div className="flex items-center">
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="h-10 w-10 rounded object-cover mr-3"
                        onError={(e) => e.target.src = '/assets/placeholder.jpg'}
                      />
                      <div>
                        <p className="font-semibold text-black">{product.title}</p>
                        <p className="text-xs text-gray-600">{formatPrice(product.priceCents)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {editingStock === product.id ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          value={newStockValue}
                          onChange={(e) => setNewStockValue(e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateStock(product.id, newStockValue)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingStock(null)}
                          className="px-2 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${isLowStock ? 'text-orange-600' : 'text-black'}`}>
                          {inv?.currentStock || 0}
                        </span>
                        {isLowStock && <span className="text-orange-600 text-xs font-semibold">LOW</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">{inv?.sold || 0}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        setEditingStock(product.id)
                        setNewStockValue(inv?.currentStock || 0)
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  // Orders Management tab
  const OrdersTab = () => (
    <div className="bg-white rounded-lg shadow-md">
      {orders.length === 0 ? (
        <div className="p-6 text-gray-600 text-center">No orders created yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-3 text-sm font-mono text-gray-900">{order.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{order.items.length}</td>
                  <td className="px-6 py-3 text-sm font-bold text-black">{formatPrice(order.totalCents)}</td>
                  <td className="px-6 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      <option value={ORDER_STATUS.PENDING}>Pending</option>
                      <option value={ORDER_STATUS.PROCESSING}>Processing</option>
                      <option value={ORDER_STATUS.SHIPPED}>Shipped</option>
                      <option value={ORDER_STATUS.DELIVERED}>Delivered</option>
                      <option value={ORDER_STATUS.CANCELLED}>Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => alert(JSON.stringify(order.items, null, 2))}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-6">Admin Dashboard</h1>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'inventory', label: 'Inventory' },
                { id: 'orders', label: 'Orders' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'orders' && <OrdersTab />}
      </main>
      <Footer />
    </>
  )
}

export default AdminPage
