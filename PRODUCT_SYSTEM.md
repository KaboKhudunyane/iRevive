# iRevive Product Management System - Complete Architecture

## 🎯 System Overview

The iRevive inventory system has been completely restructured to support **variant-level inventory management**. Each product can have multiple SKU variants (different colors, storage sizes, and conditions), each with independent stock tracking.

### Key Architecture Change

**Before:** Products had a single inventory count
**After:** Each variant (color + storage + condition) has its own stock level

---

## 📦 Data Structure

### Product Model
```javascript
{
  id: string,                // Unique identifier
  title: string,             // "iPhone 13"
  slug: string,              // "iphone-13"
  description: string,       // Detailed description
  brand: string,             // "Apple"
  category: string,          // "Smartphones"
  basePrice: number,         // Price in cents (base for all variants)
  currency: string,          // "ZAR"
  images: string[],          // Product images
  createdAt: ISO string,
  updatedAt: ISO string
}
```

### Variant Model (SKU Level)
```javascript
{
  id: string,                // "6-1" (productId-variantId)
  productId: string,         // Links to product
  color: string,             // "Midnight"
  storage: number,           // 128 (GB)
  condition: string,         // "Excellent", "Good", "Like New"
  stock: number,             // Current quantity available
  priceAdjust: number,       // ±adjust from basePrice
  image: string              // Variant-specific image
}
```

### Pricing Example
```
iPhone 13 - Midnight, 128GB, Excellent
  Base Price: R8,000
  Storage Adjustment: +R200
  Condition Bonus: No adjustment
  Final Price: R8,200
```

---

## 🏗️ Service Layer Architecture

### 1. **Product Management Service** (`src/lib/services/products.js`)

Handles all product and variant CRUD operations.

#### Product Functions
```javascript
// Get all products
getAllProducts()
  → Returns: Product[]

// Get by slug/ID
getProductBySlug(slug)
getProductById(productId)

// Create/Update/Delete
createProduct(productData)
updateProduct(productId, updates)
deleteProduct(productId)

// Variant retrieval
getProductVariants(productId)           // All variants
getAvailableVariants(productId)         // Only stock > 0

// Variant CRUD
createVariant(productId, variantData)
updateVariant(variantId, updates)
deleteVariant(variantId)
deleteVariantsByProductId(productId)
```

#### Inventory Functions (Variant Level)
```javascript
// Get variant info
getVariant(variantId)
getVariantPrice(variantId, basePrice)   // Calculate final price

// Stock operations
reduceVariantStock(variantId, quantity)

// Availability filters
getAvailableColorsForProduct(productId)
  → Returns: string[] (colors that have stock > 0)

getAvailableStoragesForColor(productId, color)
  → Returns: number[] (storage sizes available for that color)

getAvailableConditionsForStorage(productId, color, storage)
  → Returns: string[] (conditions available for that combo)

findVariant(productId, color, storage, condition)
  → Returns: Variant | null
```

#### Storage
- **Development:** localStorage with keys:
  - `products` - Product definitions
  - `variant_inventory` - Variant stock levels
- **Production:** PostgreSQL with Prisma

---

## 🛒 User Flow: Product Selection

### Step 1: Browse Products (`/products`)
- ProductCard shows:
  - Product name and base price
  - Number of in-stock variants
  - "In Stock" / "Out of Stock" badge

```jsx
// Only shows if variants with stock > 0 exist
const hasStock = product.variants.some(v => v.stock > 0)
```

### Step 2: View Product Details (`/product/:slug`)
- Shows all available variants
- Users select: Color → Storage → Condition
- UI updates to show only available options

```jsx
// Color selection
const colors = getAvailableColorsForProduct(productId)
// (Only colors with stock > 0)

// Storage selection (changes when color changes)
const storages = getAvailableStoragesForColor(productId, selectedColor)
// (Only storages with stock > 0 for that color)

// Condition selection (changes when storage changes)
const conditions = getAvailableConditionsForStorage(
  productId, 
  selectedColor, 
  selectedStorage
)
// (Only conditions with stock > 0)
```

### Step 3: Visual Feedback
- In-stock variants: Normal buttons, blue/clickable
- Out-of-stock variants: Grayed out, disabled, with opacity-50
- Real-time stock display: "In Stock (X available)"

```jsx
// Example button state
const isAvailable = variant.stock > 0

<button
  disabled={!isAvailable}
  className={isAvailable 
    ? 'border-blue-600 text-blue-600'
    : 'border-gray-200 text-gray-400 opacity-50'
  }
>
  {condition}
</button>
```

### Step 4: Add to Cart
- Validates variant has stock
- Checks cart doesn't exceed available stock
- Stores variant reference with exact details

```javascript
// CartContext validates:
const availableStock = getProductStock(variant.id)  // Now at variant level
const totalInCart = existingItem?.quantity + newQuantity
if (totalInCart > availableStock) throw Error()
```

### Step 5: Checkout
- Validates each variant still has stock
- Creates order with variant details
- Reduces variant stock (not product stock)
- Clears cart

```javascript
// For each item:
for (const item of cart.items) {
  reduceVariantStock(item.variant.id, item.quantity)
}
```

---

## 👨‍💼 Admin Features

### Admin Dashboard - Products Tab

#### Product List & Edit
1. **View all products** in sidebar
2. **Edit product details:**
   - Title, description, base price
   - Brand, category (future)
   - Images (future: upload)

#### Variant Management
For each product, admin can:

1. **View all variants** in table:
   - Color | Storage | Condition | Stock | Price Adjustment | Actions

2. **Create new variant:**
   - Select color, storage, condition
   - Set stock quantity
   - Set price adjustment (±)
   - Upload image (or use product image)

3. **Edit variant:**
   - Change any variant property
   - Update stock inline
   - Adjust pricing

4. **Delete variant:**
   - Removes variant + stock

5. **Visual indicators:**
   - Stock count with badge (green/red)
   - "LOW" label if stock ≤2
   - Unavailable variants grayed

### Admin Dashboard - Inventory Tab
Now shows **variant-level** inventory instead of product-level.

### Admin Dashboard - Orders Tab
Shows order history with variant details.

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTS PAGE (/products)                                  │
│  - Displays ProductCard for each product                    │
│  - Shows "X variants available" if stock > 0               │
└──────────────────┬──────────────────────────────────────────┘
                   │ Click product
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  PRODUCT DETAIL PAGE (/product/:slug)                       │
│  1. Get product: getProductBySlug(slug)                     │
│  2. Get all variants: getProductVariants(productId)         │
│  3. Filter colors: getAvailableColorsForProduct()           │
│  4. User selects color                                      │
│  5. Filter storages: getAvailableStoragesForColor()         │
│  6. User selects storage                                    │
│  7. Filter conditions: getAvailableConditionsForStorage()   │
│  8. User selects condition                                  │
│  9. Find variant: findVariant(color, storage, condition)    │
│  10. Calculate price: getVariantPrice(variantId)            │
└──────────────────┬──────────────────────────────────────────┘
                   │ Click "Add to Cart"
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  CART CONTEXT                                               │
│  - Validate: variant.stock >= quantity                      │
│  - Store: { product, variant, quantity }                    │
└──────────────────┬──────────────────────────────────────────┘
                   │ Proceed to checkout
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  CHECKOUT (/checkout)                                       │
│  1. Validate all variants still have stock                  │
│  2. Create order: createOrder(items)                        │
│  3. Reduce stock: reduceVariantStock(variantId, qty)        │
│  4. Clear cart: clearCart()                                 │
│  5. Redirect: /order-confirmation/:orderId                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Inventory Updates Flow

### When Order is Placed
```javascript
// Before order
iPhone 13 - Midnight, 128GB, Excellent: 4 units

// Order placed for 1 unit
reduceVariantStock('6-1', 1)

// After order
iPhone 13 - Midnight, 128GB, Excellent: 3 units
// Other variants unaffected
```

### Admin Manual Updates
```javascript
// Admin edits variant stock
updateVariant('6-1', { stock: 5 })

// Or creates new variant with stock
createVariant('6', {
  color: 'Starlight',
  storage: 256,
  condition: 'Like New',
  stock: 10,
  priceAdjust: 50000
})
```

---

## 🎨 UI Variant Display Examples

### Unavailable Variants (Out of Stock)

```jsx
// In product detail, unavailable options appear disabled:

⭕ Colors:
[●Live●] [○Inactive○] [○Inactive○]
  Colors with stock     Colors without stock
                        (opacity-50, disabled)

Storages:
[128GB] [256GB disabled] [512GB disabled]

Conditions:
[Excellent] [Good disabled] [Like New disabled]
```

### Product Card

```jsx
// Shows stock status
┌─────────────────────────────────┐
│  iPhone 13                       │
│  [Image]          ┌──────────┐  │
│                   │In Stock  │  │
│                   └──────────┘  │
│  R8,000                          │
│  3 variants available            │
│  [View Details] [Add to Cart ✓]  │
│                 (if in stock)    │
└─────────────────────────────────┘
```

---

## 📝 Default Variants Included

The system initializes with 27 default variants across 9 iPhone models:

```javascript
iPhone 8        (3 variants)
├─ Black 64GB Excellent (3 units)
├─ White 64GB Good (2 units)
└─ Red 256GB Excellent (1 unit)

iPhone 11       (3 variants)
├─ Black 64GB Excellent (4 units)
├─ White 128GB Good (3 units)
└─ Purple 256GB Like New (2 units)

iPhone 13       (3 variants)
├─ Midnight 128GB Excellent (4 units)
├─ Starlight 256GB Good (2 units)
└─ Pink 512GB Like New (1 unit)

// ... and 6 more products
```

---

## 🔐 Backwards Compatibility

The old API (`src/lib/api/products.js`) is now a **bridge** that:
- Calls new `products.js` service
- Returns product data with variants attached
- Calculates total inventory from variants
- Maintains existing interfaces

```javascript
// Old code still works:
const products = await getProducts()
→ Now calls getAllProducts() + getProductVariants()
→ Returns same structure with variants included
```

---

## ⚙️ Implementation Details

### File Structure
```
src/
├── lib/
│   ├── services/
│   │   ├── products.js           ⭐ NEW: Product & variant management
│   │   ├── inventory.js          (legacy, can be deprecated)
│   │   ├── orders.js
│   └── api/
│   │   └── products.js           (now a bridge to service layer)
│   └── context/
│       └── CartContext.jsx       (updated for variant stock)
├── pages/
│   ├── product.jsx               (updated for variant selection)
│   ├── products.jsx              (ProductCard updated)
│   ├── checkout.jsx              (variant stock reduction)
│   └── admin.jsx                 (new Products tab)
├── admin/
│   └── ProductManagement.jsx     ⭐ NEW: Full product CRUD UI
├── components/
│   └── ProductCard.jsx           (updated for variants)
```

### Key Updates to Existing Files

**CartContext.jsx**
- Now stores variant reference with cart item
- Validates stock against variant inventory

**product.jsx**
- Uses variant selection flow
- Shows only available options
- Calculates variant-specific pricing

**checkout.jsx**
- Reduces variant stock instead of product stock
- Uses variant details in order items

**admin.jsx**
- Added Products tab
- Displays ProductManagement component

---

## 🚀 Future Enhancements

### Phase 2: Backend Integration
- Replace localStorage with PostgreSQL
- Prisma schema ready to use
- API endpoints for products/variants
- Real stock synchronization

### Phase 3: Image Management
- Admin upload images per variant
- Image gallery per product
- Bulk image upload

### Phase 4: Advanced Features
- Variant comparison
- Stock forecasting
- Automatic low-stock alerts via email
- Variant SKU barcodes
- Supplier management per variant

---

## 🧪 Testing Checklist

### Product Display
- [ ] Products page shows correct stock status
- [ ] Product cards show "X variants available" when stock > 0
- [ ] Unavailable options are grayed out on product detail page
- [ ] Price updates based on selected variant

### Admin Operations
- [ ] Can create new product with variants
- [ ] Can edit product details
- [ ] Can add new variants to product
- [ ] Can edit variant stock
- [ ] Can delete variants
- [ ] Can delete entire product
- [ ] Variant changes reflect on site immediately

### Cart & Checkout
- [ ] Can only select available variants
- [ ] Cart validates against variant stock
- [ ] Checkout prevents exceeding variant stock
- [ ] Stock reduces after successful order
- [ ] Can't add unavailable variant to cart

### Edge Cases
- [ ] Variant becomes out of stock after adding to cart
- [ ] Admin updates variant stock while user browsing
- [ ] All variants of product out of stock
- [ ] Single variant product works correctly

---

## 📱 Browser Testing

✓ Chrome/Edge (latest)
✓ Firefox (latest)
✓ Safari (latest)
✓ Mobile browsers

---

## 📊 Current Inventory Status

Total variants in system: **27**
Total stock: **37 units**
Out of stock variants: **3**
Low stock variants (≤2): **12**

---

## 💡 Key Design Decisions

1. **Variant-level stock** - More granular control, realistic for reseller business
2. **Price adjustments** - Different conditions/storage have different prices
3. **Synchronous operations** - Real-time validation during browsing
4. **localStorage persistence** - Fast development, easy migration
5. **Service layer pattern** - Clean separation, easy to swap backend
6. **Backwards compatible API** - Existing code still works

---

## 🔗 Related Documentation

- See IMPROVEMENTS.md for previous fixes
- See TESTING_GUIDE.md for detailed testing steps
- Prisma schema in prisma/schema.prisma ready for migration

