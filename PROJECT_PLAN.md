# iRevive iPhone Reseller Website - Detailed Project Structure and Plan

## Project Structure Overview

```
iRevive/
├── public/
│   ├── vite.svg
│   └── placeholder.jpg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGallery.jsx
│   │   │   ├── ProductVariantSelector.jsx
│   │   │   └── ProductReview.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── CartDrawer.jsx
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   ├── ShippingForm.jsx
│   │   │   └── OrderSummary.jsx
│   │   ├── admin/
│   │   │   ├── ProductEditor.jsx
│   │   │   ├── OrderList.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── InventoryManager.jsx
│   │   │   └── DashboardStats.jsx
│   │   └── auth/
│   │       ├── LoginForm.jsx
│   │       ├── RegisterForm.jsx
│   │       └── PasswordReset.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── Profile.jsx
│   │   ├── Wishlist.jsx
│   │   ├── SearchResults.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Terms.jsx
│   │   ├── Privacy.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Settings.jsx
│   │   └── auth/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       └── ForgotPassword.jsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   ├── auth.js
│   │   │   └── admin.js
│   │   ├── utils/
│   │   │   ├── format.js
│   │   │   ├── validation.js
│   │   │   ├── storage.js
│   │   │   └── constants.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useProducts.js
│   │   │   └── useOrders.js
│   │   ├── services/
│   │   │   ├── stripe.js
│   │   │   ├── email.js
│   │   │   ├── s3.js
│   │   │   └── analytics.js
│   │   └── db.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── themes.css
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── README.md
├── TODO.md
└── docker-compose.yml
```

## Detailed Component Descriptions

### Common Components

- **Header**: Navigation bar with logo, search, cart icon, user menu
- **Footer**: Links to policies, contact, social media
- **Navigation**: Main menu with categories
- **Button**: Reusable button with variants (primary, secondary, outline)
- **Input**: Form input with validation and error states
- **Modal**: Overlay dialog for confirmations and forms

### Product Components

- **ProductCard**: Thumbnail, title, price, add to cart button
- **ProductGallery**: Image carousel with thumbnails
- **ProductVariantSelector**: Dropdowns for color, storage, condition
- **ProductReview**: Star rating and review display

### Cart Components

- **CartItem**: Product image, name, quantity, price, remove button
- **CartSummary**: Subtotal, tax, total, checkout button
- **CartDrawer**: Slide-out cart panel for quick access

### Checkout Components

- **CheckoutForm**: Multi-step form (shipping, payment, review)
- **PaymentForm**: Stripe Elements integration
- **ShippingForm**: Address and delivery options
- **OrderSummary**: Final order details before payment

### Admin Components

- **ProductEditor**: Form to add/edit products with image upload
- **OrderList**: Table of orders with status filters
- **OrderDetail**: Detailed order view with update status
- **InventoryManager**: Stock levels and alerts
- **DashboardStats**: Charts and KPIs

### Auth Components

- **LoginForm**: Email/password with remember me
- **RegisterForm**: User registration with validation
- **PasswordReset**: Forgot password flow

## Page Descriptions

### Public Pages

- **Home**: Hero section, featured products, categories
- **ProductList**: Filtered product grid with pagination
- **ProductDetail**: Full product info, gallery, add to cart
- **Cart**: Cart items, summary, proceed to checkout
- **Checkout**: Multi-step checkout process
- **OrderConfirmation**: Thank you page with order details
- **Profile**: User account management
- **Wishlist**: Saved products
- **SearchResults**: Search results with filters
- **About/Contact/Terms/Privacy**: Static content pages

### Admin Pages

- **Dashboard**: Overview stats and recent activity
- **Products**: Product management with CRUD operations
- **Orders**: Order management and fulfillment
- **Customers**: Customer list and details
- **Reports**: Sales and performance analytics
- **Settings**: Site configuration and preferences

### Auth Pages

- **Login**: User authentication
- **Register**: New user registration
- **ForgotPassword**: Password reset flow

## API Structure

### Product APIs

- GET /api/products - List products with filters
- GET /api/products/:id - Get product details
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Cart APIs

- GET /api/cart - Get user's cart
- POST /api/cart - Add item to cart
- PUT /api/cart/:itemId - Update cart item
- DELETE /api/cart/:itemId - Remove cart item

### Order APIs

- POST /api/orders - Create order
- GET /api/orders/:id - Get order details
- PUT /api/orders/:id - Update order status (admin)
- GET /api/orders - List orders (admin)

### Auth APIs

- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user

### Admin APIs

- GET /api/admin/stats - Dashboard statistics
- GET /api/admin/products - Admin product list
- GET /api/admin/orders - Admin order list
- GET /api/admin/customers - Customer list

## Database Schema (Prisma)

### Models

- User: id, email, name, password, role, createdAt
- Product: id, title, slug, description, brand, category, priceCents, currency, images, createdAt, variants, inventory
- Variant: id, sku, productId, condition, storageGB, color, priceCents, inventory
- Order: id, userId, totalCents, currency, status, items, payment, shipping, createdAt
- OrderItem: id, orderId, variantId, qty, unitCents
- Payment: id, provider, providerId, amountCents, currency, status, createdAt
- Shipment: id, orderId, carrier, trackingNo, costCents, status

## Implementation Priorities

### Phase 1: Core MVP

1. Product listing and detail pages
2. Cart functionality
3. Checkout with Stripe
4. Basic admin dashboard
5. User authentication

### Phase 2: Enhanced Features

1. Product variants and inventory
2. Order management and fulfillment
3. Email notifications
4. Search and filtering
5. Wishlist and reviews

### Phase 3: Advanced Features

1. Analytics and reporting
2. Multi-language support
3. Advanced admin tools
4. Mobile app
5. AI-powered recommendations

## Next Steps

1. Implement product listing page with API integration
2. Build product detail page with image gallery
3. Develop cart functionality with local storage
4. Setup backend API routes
5. Integrate Stripe for payments
6. Build admin dashboard for product management

This detailed plan provides a comprehensive roadmap for the iRevive iPhone reseller website development.
