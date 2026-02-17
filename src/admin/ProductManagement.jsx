import React, { useState, useEffect } from 'react'
import {
  getAllProducts,
  getProductVariants,
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant,
  getAvailableColorsForProduct,
  getAvailableStoragesForColor,
  getAvailableConditionsForStorage
} from '../lib/services/products'

/**
 * ProductManagement Component
 * 
 * Admin interface for:
 * - Creating new products
 * - Editing product details
 * - Managing product variants with individual stock levels
 * - Deleting products and variants
 */
const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [showNewVariantForm, setShowNewVariantForm] = useState(false)
  const [editingVariant, setEditingVariant] = useState(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [productForm, setProductForm] = useState({
    title: '',
    slug: '',
    description: '',
    brand: 'Apple',
    category: 'Smartphones',
    basePrice: '',
    images: ''
  })

  const [variantForm, setVariantForm] = useState({
    color: '',
    storage: '',
    condition: 'Excellent',
    stock: '',
    priceAdjust: '0',
    image: ''
  })

  // Load products and variants
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    try {
      setLoading(true)
      const productsData = getAllProducts()
      setProducts(productsData)
    } catch (error) {
      alert('Error loading products: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadVariants = (product) => {
    try {
      const variantsData = getProductVariants(product.id)
      setVariants(variantsData)
    } catch (error) {
      alert('Error loading variants: ' + error.message)
    }
  }

  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    loadVariants(product)
    setShowNewVariantForm(false)
    setEditingVariant(null)
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    try {
      if (!productForm.title || !productForm.slug || !productForm.basePrice) {
        alert('Please fill in all required fields')
        return
      }

      const imageArray = productForm.images.split(',').map(img => img.trim()).filter(Boolean)

      const newProduct = createProduct({
        title: productForm.title,
        slug: productForm.slug,
        description: productForm.description,
        brand: productForm.brand,
        category: productForm.category,
        basePrice: parseInt(productForm.basePrice),
        currency: 'ZAR',
        images: imageArray.length > 0 ? imageArray : ['/assets/placeholder.jpg']
      })

      setProducts([...products, newProduct])
      setProductForm({
        title: '',
        slug: '',
        description: '',
        brand: 'Apple',
        category: 'Smartphones',
        basePrice: '',
        images: ''
      })
      setShowNewProductForm(false)
      alert('Product created successfully!')
    } catch (error) {
      alert('Error creating product: ' + error.message)
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    try {
      const updates = {
        title: productForm.title,
        description: productForm.description,
        brand: productForm.brand,
        basePrice: parseInt(productForm.basePrice)
      }

      const updated = updateProduct(selectedProduct.id, updates)
      setSelectedProduct(updated)
      setProducts(products.map(p => p.id === updated.id ? updated : p))
      alert('Product updated successfully!')
    } catch (error) {
      alert('Error updating product: ' + error.message)
    }
  }

  const handleDeleteProduct = () => {
    if (window.confirm('Are you sure you want to delete this product and all its variants?')) {
      try {
        deleteProduct(selectedProduct.id)
        setProducts(products.filter(p => p.id !== selectedProduct.id))
        setSelectedProduct(null)
        setVariants([])
        alert('Product deleted successfully!')
      } catch (error) {
        alert('Error deleting product: ' + error.message)
      }
    }
  }

  const handleCreateVariant = async (e) => {
    e.preventDefault()
    try {
      if (!variantForm.color || !variantForm.storage || !variantForm.condition || variantForm.stock === '') {
        alert('Please fill in all variant fields')
        return
      }

      const newVariant = createVariant(selectedProduct.id, {
        color: variantForm.color,
        storage: parseInt(variantForm.storage),
        condition: variantForm.condition,
        stock: parseInt(variantForm.stock),
        priceAdjust: parseInt(variantForm.priceAdjust) || 0,
        image: variantForm.image || selectedProduct.images[0]
      })

      setVariants([...variants, newVariant])
      setVariantForm({
        color: '',
        storage: '',
        condition: 'Excellent',
        stock: '',
        priceAdjust: '0',
        image: ''
      })
      setShowNewVariantForm(false)
      alert('Variant created successfully!')
    } catch (error) {
      alert('Error creating variant: ' + error.message)
    }
  }

  const handleUpdateVariant = async (e) => {
    e.preventDefault()
    try {
      const updates = {
        color: variantForm.color,
        storage: parseInt(variantForm.storage),
        condition: variantForm.condition,
        stock: parseInt(variantForm.stock),
        priceAdjust: parseInt(variantForm.priceAdjust) || 0,
        image: variantForm.image
      }

      const updated = updateVariant(editingVariant.id, updates)
      setVariants(variants.map(v => v.id === updated.id ? updated : v))
      setEditingVariant(null)
      setVariantForm({
        color: '',
        storage: '',
        condition: 'Excellent',
        stock: '',
        priceAdjust: '0',
        image: ''
      })
      alert('Variant updated successfully!')
    } catch (error) {
      alert('Error updating variant: ' + error.message)
    }
  }

  const handleEditVariant = (variant) => {
    setEditingVariant(variant)
    setVariantForm({
      color: variant.color,
      storage: String(variant.storage),
      condition: variant.condition,
      stock: String(variant.stock),
      priceAdjust: String(variant.priceAdjust || 0),
      image: variant.image
    })
    setShowNewVariantForm(false)
  }

  const handleDeleteVariant = (variantId) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        deleteVariant(variantId)
        setVariants(variants.filter(v => v.id !== variantId))
        setEditingVariant(null)
        setVariantForm({
          color: '',
          storage: '',
          condition: 'Excellent',
          stock: '',
          priceAdjust: '0',
          image: ''
        })
        alert('Variant deleted successfully!')
      } catch (error) {
        alert('Error deleting variant: ' + error.message)
      }
    }
  }

  const formatPrice = (cents) => {
    return `R${(cents / 100).toFixed(2)}`
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => setShowNewProductForm(!showNewProductForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showNewProductForm ? '✕ Cancel' : '+ New Product'}
        </button>
      </div>

      {/* New Product Form */}
      {showNewProductForm && (
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
          <h3 className="text-lg font-bold mb-4">Create New Product</h3>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Title"
                value={productForm.title}
                onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Slug (e.g., iphone-15)"
                value={productForm.slug}
                onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <select
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option>Apple</option>
                <option>Samsung</option>
                <option>Google</option>
                <option>Other</option>
              </select>
              <input
                type="number"
                placeholder="Base Price (cents)"
                value={productForm.basePrice}
                onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              rows="3"
            />
            <input
              type="text"
              placeholder="Image paths (comma-separated, e.g., /assets/img1.jpg, /assets/img2.jpg)"
              value={productForm.images}
              onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Product
              </button>
              <button
                type="button"
                onClick={() => setShowNewProductForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-50 px-6 py-3 border-b font-bold">
            Products ({products.length})
          </div>
          <div className="max-h-96 overflow-y-auto">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`w-full text-left px-6 py-3 border-b hover:bg-blue-50 transition ${
                  selectedProduct?.id === product.id ? 'bg-blue-100 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="font-semibold text-sm">{product.title}</div>
                <div className="text-xs text-gray-600">Base: {formatPrice(product.basePrice)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Product Details */}
        {selectedProduct && (
          <div className="lg:col-span-2 space-y-6">
            {/* Product Edit Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4">Edit Product</h3>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <input
                  type="text"
                  value={productForm.title || selectedProduct.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Title"
                />
                <textarea
                  value={productForm.description || selectedProduct.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="border rounded px-3 py-2 w-full"
                  rows="3"
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={productForm.basePrice || selectedProduct.basePrice}
                  onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Base Price"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteProduct}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete Product
                  </button>
                </div>
              </form>
            </div>

            {/* Variants Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Variants ({variants.length})</h3>
                {!showNewVariantForm && (
                  <button
                    onClick={() => {
                      setShowNewVariantForm(true)
                      setEditingVariant(null)
                      setVariantForm({
                        color: '',
                        storage: '',
                        condition: 'Excellent',
                        stock: '',
                        priceAdjust: '0',
                        image: ''
                      })
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    + Add Variant
                  </button>
                )}
              </div>

              {/* Variant Form */}
              {(showNewVariantForm || editingVariant) && (
                <div className="bg-gray-50 p-4 rounded mb-4 border-l-4 border-green-600">
                  <form onSubmit={editingVariant ? handleUpdateVariant : handleCreateVariant} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Color"
                        value={variantForm.color}
                        onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Storage (GB)"
                        value={variantForm.storage}
                        onChange={(e) => setVariantForm({ ...variantForm, storage: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                        required
                      />
                      <select
                        value={variantForm.condition}
                        onChange={(e) => setVariantForm({ ...variantForm, condition: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Like New</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variantForm.stock}
                        onChange={(e) => setVariantForm({ ...variantForm, stock: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price Adjustment (±cents)"
                        value={variantForm.priceAdjust}
                        onChange={(e) => setVariantForm({ ...variantForm, priceAdjust: e.target.value })}
                        className="border rounded px-2 py-1 text-sm col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Image path"
                        value={variantForm.image}
                        onChange={(e) => setVariantForm({ ...variantForm, image: e.target.value })}
                        className="border rounded px-2 py-1 text-sm col-span-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        {editingVariant ? 'Update' : 'Create'} Variant
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewVariantForm(false)
                          setEditingVariant(null)
                          setVariantForm({
                            color: '',
                            storage: '',
                            condition: 'Excellent',
                            stock: '',
                            priceAdjust: '0',
                            image: ''
                          })
                        }}
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Variants Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-2 py-2">Color</th>
                      <th className="text-left px-2 py-2">Storage</th>
                      <th className="text-left px-2 py-2">Condition</th>
                      <th className="text-right px-2 py-2">Stock</th>
                      <th className="text-right px-2 py-2">Price Adj</th>
                      <th className="px-2 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map(variant => (
                      <tr key={variant.id} className={`border-b ${variant.stock === 0 ? 'bg-red-50' : ''}`}>
                        <td className="px-2 py-2">{variant.color}</td>
                        <td className="px-2 py-2">{variant.storage}GB</td>
                        <td className="px-2 py-2">{variant.condition}</td>
                        <td className="text-right px-2 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            variant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {variant.stock}
                          </span>
                        </td>
                        <td className="text-right px-2 py-2 text-xs text-gray-600">
                          {variant.priceAdjust > 0 ? '+' : ''}{formatPrice(variant.priceAdjust || 0)}
                        </td>
                        <td className="px-2 py-2 flex gap-1">
                          <button
                            onClick={() => handleEditVariant(variant)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVariant(variant.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductManagement
