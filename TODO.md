# iRevive Project - TODO List

## Project Inventory

### What's Already There:
- Pages: home.jsx, products.jsx, product.jsx, cart.jsx, checkout.jsx, admin.jsx
- Components: Header, Footer, ProductCard, FeaturedProducts, LatestPhoneBanner, and many more
- Lib: CartContext, useCart, mock API for products
- Config: Vite, Tailwind, Prisma schema

---

## Critical Bugs (Must Fix First)

1. **CartProvider NOT wrapped** - The CartContext is created but NOT used in App.jsx. This means useCart() will throw an error and cart is completely broken.
   - Fix: Wrap app with CartProvider in main.jsx

2. **localStorage key inconsistency** - cartReducer uses 'cart', but cart.js API uses 'irevive_cart'

3. **No 404 page** - Invalid routes show blank page

4. **Admin route unprotected** - Anyone can access /admin

---

## Phase 1: Core Fixes

- [ ] Add CartProvider to main.jsx
- [ ] Fix localStorage key consistency
- [ ] Create 404 NotFound page
- [ ] Add Error Boundary
- [ ] Protect admin route
- [ ] Delete duplicate src/pages/index.jsx

---

## Phase 2: Frontend Improvements

- [ ] Add "Add to Cart" button on ProductCard
- [ ] Show variant prices in ProductCard
- [ ] Add quantity selector in cart
- [ ] Add toast notifications
- [ ] Improve mobile responsive design
- [ ] Add loading states

---

## Phase 3: Backend (Optional)

Options:
- A) Keep Vite + add Express backend
- B) Migrate to Next.js (recommended for SEO)

If adding backend:
- [ ] Set up Express.js server
- [ ] Connect PostgreSQL database
- [ ] Create REST API endpoints
- [ ] Implement Stripe checkout
- [ ] Add JWT authentication

---

## Next 5 Immediate Actions

1. Add CartProvider to main.jsx
2. Fix localStorage key
3. Create 404 page
4. Add Error Boundary
5. Delete duplicate index.jsx

---

## Progress

### Completed:
- Project scaffolding (Vite + React + Tailwind)
- Home page with components
- Products listing with filtering
- Product detail with variants
- Cart page UI
- Mock product data (9 products)

### Remaining:
- All items listed above
