# iRevive iPhone Reseller Website - Detailed Implementation Plan

## Project Structure Overview

```
src/
├── pages/                 # Main application pages
│   ├── index.jsx         # Home/Product listing
│   ├── product.jsx       # Product detail page
│   ├── cart.jsx          # Shopping cart
│   ├── checkout.jsx      # Checkout flow
│   ├── login.jsx         # User login
│   ├── register.jsx      # User registration
│   └── profile.jsx       # User profile/orders
├── admin/                 # Admin dashboard pages
│   ├── index.jsx         # Admin dashboard overview
│   ├── products.jsx      # Product management
│   ├── orders.jsx        # Order management
│   ├── inventory.jsx     # Inventory tracking
│   ├── users.jsx         # User management
│   └── settings.jsx      # Admin settings
├── components/            # Reusable UI components
│   ├── common/           # Generic components
│   │   ├── Header.jsx    # Site header with navigation
│   │   ├── Footer.jsx    # Site footer
│   │   ├── Button.jsx    # Custom button component
│   │   ├── Input.jsx     # Form input component
│   │   ├── Modal.jsx     # Modal dialog
│   │   └── Loading.jsx   # Loading spinner
│   ├── product/          # Product-related components
│   │   ├── ProductCard.jsx      # Product summary card
│   │   ├── ProductGallery.jsx   # Image gallery
│   │   ├── ProductVariants.jsx  # Variant selection
│   │   ├── ProductReviews.jsx   # Customer reviews
│   │   └── ProductFilters.jsx   # Search/filter controls
│   ├── cart/             # Cart-related components
│   │   ├── CartItem.jsx         # Individual cart item
│   │   ├── CartSummary.jsx      # Cart totals
│   │   └── CartSidebar.jsx      # Mini cart overlay
│   ├── checkout/         # Checkout components
│   │   ├── CheckoutForm.jsx     # Customer details form
│   │   ├── PaymentForm.jsx      # Stripe payment form
│   │   ├── OrderSummary.jsx     # Order review
│   │   └── CheckoutSteps.jsx    # Progress indicator
│   ├── admin/            # Admin-specific components
│   │   ├── AdminSidebar.jsx     # Admin navigation
│   │   ├── ProductForm.jsx      # Add/edit product form
│   │   ├── OrderTable.jsx       # Orders data table
│   │   ├── InventoryTable.jsx   # Inventory management
│   │   └── StatsCards.jsx       # Dashboard statistics
│   └── layout/           # Layout components
│       ├── Container.jsx # Max-width container
│       ├── Grid.jsx      # Responsive grid
│       └── Section.jsx   # Section wrapper
├── lib/                  # Utility libraries
│   ├── api/              # API client functions
│   │   ├── products.js   # Product API calls
│   │   ├── cart.js       # Cart API calls
│   │   ├── orders.js     # Order API calls
│   │   └── auth.js       # Authentication API
│   ├── utils/            # Utility functions
│   │   ├── format.js     # Price/currency formatting
│   │   ├── validation.js # Form validation
│   │   ├── storage.js    # Local storage helpers
│   │   └── constants.js  # App constants
│   ├── hooks/            # Custom React hooks
│   │   ├── useCart.js    # Cart state management
│   │   ├── useAuth.js    # Authentication hook
│   │   ├── useProducts.js # Product data fetching
│   │   └── useOrders.js  # Order management
│   ├── db.js             # Database connection
│   ├── stripe.js         # Stripe integration
│   └── email.js          # Email service
├── styles/               # Additional styles
│   ├── components.css    # Component-specific styles
│   └── animations.css    # CSS animations
└── contexts/             # React contexts
    ├── AuthContext.jsx   # Authentication context
    ├── CartContext.jsx   # Shopping cart context
    └── ThemeContext.jsx  # Theme/styling context

prisma/
├── schema.prisma         # Database schema
├── migrations/           # Database migrations
└── seed.ts              # Database seeding script

public/                   # Static assets
├── images/              # Product images, icons
└── favicon.ico          # Site favicon
```

## Detailed Page Specifications

### 1. Home Page (`src/pages/index.jsx`)

**Purpose:** Main product listing and entry point
**Features:**

- Hero section with featured products
- Product grid with pagination
- Search bar with autocomplete
- Category filters (iPhone models, accessories, condition)
- Sort options (price, popularity, newest)
- Responsive grid layout
- Loading states and error handling

**Components Used:**

- Header, Footer, ProductCard, ProductFilters, Loading

### 2. Product Detail Page (`src/pages/product.jsx`)

**Purpose:** Detailed product view with purchase options
**Features:**

- Large product image gallery
- Product title, description, specifications
- Variant selection (storage, color, condition)
- Price display with currency formatting
- Add to cart functionality
- Related products section
- Customer reviews and ratings
- Breadcrumb navigation
- Social sharing buttons

**Components Used:**

- Header, Footer, ProductGallery, ProductVariants, Button, ProductCard

### 3. Cart Page (`src/pages/cart.jsx`)

**Purpose:** Shopping cart management
**Features:**

- List all cart items with images
- Quantity adjustment controls
- Remove items functionality
- Cart subtotal, tax, shipping calculations
- Continue shopping button
- Proceed to checkout button
- Empty cart state
- Persistent cart across sessions

**Components Used:**

- Header, Footer, CartItem, CartSummary, Button

### 4. Checkout Page (`src/pages/checkout.jsx`)

**Purpose:** Complete purchase process
**Features:**

- Multi-step checkout flow
- Customer information form
- Shipping address collection
- Payment method selection
- Order review and confirmation
- Stripe payment integration
- Order success confirmation
- Email confirmation sending

**Components Used:**

- Header, Footer, CheckoutForm, PaymentForm, OrderSummary, CheckoutSteps

### 5. Admin Dashboard (`src/admin/index.jsx`)

**Purpose:** Admin overview and quick actions
**Features:**

- Key metrics cards (revenue, orders, products)
- Recent orders table
- Low inventory alerts
- Quick action buttons
- Charts for sales trends
- Navigation to detailed admin sections

**Components Used:**

- AdminSidebar, StatsCards, OrderTable, Button

## Detailed Component Specifications

### Core Components

#### Header (`src/components/common/Header.jsx`)

- Logo and brand name
- Main navigation menu
- Search bar
- Cart icon with item count
- User account menu (login/logout)
- Mobile hamburger menu
- Sticky positioning on scroll

#### ProductCard (`src/components/product/ProductCard.jsx`)

- Product image (with fallback)
- Product title and brand
- Price display (original/sale)
- Quick add to cart button
- Favorite/wishlist toggle
- Condition badge (new/used)
- Hover effects and animations

#### ProductGallery (`src/components/product/ProductGallery.jsx`)

- Main large image display
- Thumbnail navigation
- Zoom functionality
- Image lazy loading
- Touch/swipe support for mobile
- Lightbox modal for full view

#### CheckoutForm (`src/components/checkout/CheckoutForm.jsx`)

- Form validation with error messages
- Address autocomplete integration
- Save address for future use
- Guest checkout option
- Form persistence across steps

#### CartItem (`src/components/cart/CartItem.jsx`)

- Product image and details
- Quantity selector
- Price and subtotal calculation
- Remove button with confirmation
- Update quantity with optimistic UI

### Admin Components

#### ProductForm (`src/components/admin/ProductForm.jsx`)

- Multi-step form for product creation
- Image upload with preview
- Variant management (size, color, etc.)
- Inventory tracking
- SEO fields (meta title, description)
- Rich text editor for description

#### OrderTable (`src/components/admin/OrderTable.jsx`)

- Sortable columns
- Status filtering
- Bulk actions (update status, export)
- Pagination for large datasets
- Quick status update dropdowns

## API Structure

### RESTful Endpoints

```
/api/products
  GET    /api/products          # List products with filters
  POST   /api/products          # Create product (admin)
  GET    /api/products/:id      # Get product details
  PUT    /api/products/:id      # Update product (admin)
  DELETE /api/products/:id      # Delete product (admin)

/api/cart
  GET    /api/cart              # Get user's cart
  POST   /api/cart              # Add item to cart
  PUT    /api/cart/:itemId      # Update cart item
  DELETE /api/cart/:itemId      # Remove cart item

/api/orders
  GET    /api/orders            # Get user's orders
  POST   /api/orders            # Create order
  GET    /api/orders/:id        # Get order details
  PUT    /api/orders/:id/status # Update order status (admin)

/api/auth
  POST   /api/auth/login        # User login
  POST   /api/auth/register     # User registration
  POST   /api/auth/logout       # User logout
  GET    /api/auth/me           # Get current user

/api/admin
  GET    /api/admin/stats       # Dashboard statistics
  GET    /api/admin/orders      # All orders (admin)
  GET    /api/admin/users       # User management (admin)
```

### Webhook Endpoints

```
/api/webhooks/stripe           # Stripe payment webhooks
/api/webhooks/payfast          # PayFast payment webhooks
/api/webhooks/yoco             # Yoco payment webhooks
```

## Database Schema Details

### Core Tables

**products**

- id, title, slug, description, brand, category
- price_cents, currency, images (JSON array)
- created_at, updated_at

**product_variants**

- id, product_id, sku, condition, storage_gb, color
- price_cents, inventory_quantity

**users**

- id, email, password_hash, name, role
- created_at, last_login

**orders**

- id, user_id, total_cents, currency, status
- shipping_address (JSON), billing_address (JSON)
- created_at, updated_at

**order_items**

- id, order_id, variant_id, quantity, unit_price_cents

**payments**

- id, order_id, provider, provider_id, amount_cents
- status, created_at

**shipments**

- id, order_id, carrier, tracking_number, cost_cents
- status, shipped_at, delivered_at

## State Management

### Context Providers

**AuthContext**

- user state, login/logout functions
- role-based access control
- token management

**CartContext**

- cart items, add/remove/update functions
- cart total calculations
- persistence to localStorage

**ThemeContext**

- dark/light mode toggle
- responsive breakpoint management

### Custom Hooks

**useProducts**

- Fetch products with filters
- Pagination and infinite scroll
- Cache management

**useCart**

- Cart operations with optimistic updates
- Sync with server state
- Error handling and retry logic

**useAuth**

- Authentication state
- Protected route logic
- Auto-refresh tokens

## Testing Strategy

### Unit Tests

- Component rendering and props
- Utility function logic
- API client functions
- Custom hooks behavior

### Integration Tests

- Component interactions
- Form submissions
- API integration
- Context state updates

### E2E Tests (Cypress)

- Complete user journeys
- Payment flow testing
- Admin dashboard workflows
- Cross-browser compatibility

## Performance Optimizations

- Image lazy loading and optimization
- Code splitting by route
- API response caching
- Database query optimization
- CDN for static assets
- Service worker for offline functionality

## Security Considerations

- Input validation and sanitization
- CSRF protection
- Rate limiting on API endpoints
- Secure payment handling
- Role-based access control
- Data encryption for sensitive information

## Deployment Checklist

- Environment variables configured
- Database migrations run
- SSL certificate installed
- CDN configured for images
- Monitoring and logging setup
- Backup strategy implemented
- Performance monitoring enabled

This detailed plan provides a comprehensive roadmap for implementing the iRevive iPhone reseller website with all required features, following best practices for scalability, security, and user experience.
