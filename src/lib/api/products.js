// Placeholder API functions for products
// In a real app, these would make HTTP requests to backend
//
// Design decisions:
// - Mock data structure matches Prisma schema for easy migration
// - Product variants support different conditions, storage, colors
// - Images are served from public/assets for Vite compatibility
// - Prices in cents to avoid floating point precision issues
//
// Next steps:
// - Replace with actual API calls to backend
// - Add error handling and loading states
// - Implement caching for better performance
// - Add pagination for large product lists

export const getProducts = async (filters = {}) => {
  // Product data based on available images
  const products = [
    {
      id: '1',
      title: 'iPhone 8',
      slug: 'iphone-8',
      description: 'Refurbished iPhone 8 with excellent condition and Home button',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 420000,
      currency: 'ZAR',
      images: ['/assets/iPhone8 Black.jpg', '/assets/iPhone8 White.jpg', '/assets/iPhone8 Red.jpg'],
      variants: [
        { id: '1-1', condition: 'Excellent', storageGB: 64, color: 'Black', priceCents: 420000, image: '/assets/iPhone8 Black.jpg' },
        { id: '1-2', condition: 'Good', storageGB: 64, color: 'White', priceCents: 400000, image: '/assets/iPhone8 White.jpg' },
        { id: '1-3', condition: 'Excellent', storageGB: 256, color: 'Red', priceCents: 450000, image: '/assets/iPhone8 Red.jpg' }
      ],
      inventory: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'iPhone 11',
      slug: 'iphone-11',
      description: 'Refurbished iPhone 11 with dual camera system and Liquid Retina display',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 550000,
      currency: 'ZAR',
      images: ['/assets/iPhone 11 2.jpg', '/assets/iPhone 11 3.jpg', '/assets/iPhone 11 white.jpg'],
      variants: [
        { id: '2-1', condition: 'Excellent', storageGB: 64, color: 'Black', priceCents: 550000, image: '/assets/iPhone 11 2.jpg' },
        { id: '2-2', condition: 'Good', storageGB: 128, color: 'White', priceCents: 570000, image: '/assets/iPhone 11 white.jpg' },
        { id: '2-3', condition: 'Like New', storageGB: 256, color: 'Purple', priceCents: 600000, image: '/assets/iPhone 11 3.jpg' }
      ],
      inventory: 10,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'iPhone 11 Pro',
      slug: 'iphone-11-pro',
      description: 'Refurbished iPhone 11 Pro with triple camera system and Super Retina XDR display',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 750000,
      currency: 'ZAR',
      images: ['/assets/iPhone11Pro Gold.jpg', '/assets/iPhone11Pro MidnightGreen.jpg'],
      variants: [
        { id: '3-1', condition: 'Excellent', storageGB: 64, color: 'Midnight Green', priceCents: 750000, image: '/assets/iPhone11Pro MidnightGreen.jpg' },
        { id: '3-2', condition: 'Good', storageGB: 256, color: 'Gold', priceCents: 780000, image: '/assets/iPhone11Pro Gold.jpg' },
        { id: '3-3', condition: 'Like New', storageGB: 512, color: 'Space Gray', priceCents: 820000, image: '/assets/iPhone11Pro MidnightGreen.jpg' }
      ],
      inventory: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'iPhone 12',
      slug: 'iphone-12',
      description: 'Refurbished iPhone 12 with 5G support and Ceramic Shield',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 700000,
      currency: 'ZAR',
      images: ['/assets/iPhone12 Black.jpg', '/assets/iPhone12 Blue.jpg', '/assets/iPhone12 Purple.jpg', '/assets/iPhone12 Red.jpg', '/assets/iPhone12 White.jpg'],
      variants: [
        { id: '4-1', condition: 'Excellent', storageGB: 64, color: 'Black', priceCents: 700000, image: '/assets/iPhone12 Black.jpg' },
        { id: '4-2', condition: 'Good', storageGB: 128, color: 'Blue', priceCents: 720000, image: '/assets/iPhone12 Blue.jpg' },
        { id: '4-3', condition: 'Like New', storageGB: 256, color: 'Purple', priceCents: 750000, image: '/assets/iPhone12 Purple.jpg' },
        { id: '4-4', condition: 'Excellent', storageGB: 128, color: 'Red', priceCents: 730000, image: '/assets/iPhone12 Red.jpg' },
        { id: '4-5', condition: 'Good', storageGB: 64, color: 'White', priceCents: 690000, image: '/assets/iPhone12 White.jpg' }
      ],
      inventory: 8,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'iPhone 12 mini',
      slug: 'iphone-12-mini',
      description: 'Refurbished iPhone 12 mini with compact design and 5G support',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 650000,
      currency: 'ZAR',
      images: ['/assets/iPhone12mini Black.jpg', '/assets/iPhone12mini Blue.jpg', '/assets/iPhone12mini Green.jpg', '/assets/iPhone12mini Purple.jpg', '/assets/iPhone12mini Red.jpg', '/assets/iPhone12mini White.jpg'],
      variants: [
        { id: '5-1', condition: 'Excellent', storageGB: 64, color: 'Black', priceCents: 650000, image: '/assets/iPhone12mini Black.jpg' },
        { id: '5-2', condition: 'Good', storageGB: 128, color: 'Blue', priceCents: 670000, image: '/assets/iPhone12mini Blue.jpg' },
        { id: '5-3', condition: 'Like New', storageGB: 256, color: 'Green', priceCents: 700000, image: '/assets/iPhone12mini Green.jpg' },
        { id: '5-4', condition: 'Excellent', storageGB: 64, color: 'Purple', priceCents: 660000, image: '/assets/iPhone12mini Purple.jpg' },
        { id: '5-5', condition: 'Good', storageGB: 128, color: 'Red', priceCents: 680000, image: '/assets/iPhone12mini Red.jpg' },
        { id: '5-6', condition: 'Like New', storageGB: 256, color: 'White', priceCents: 710000, image: '/assets/iPhone12mini White.jpg' }
      ],
      inventory: 6,
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'iPhone 13',
      slug: 'iphone-13',
      description: 'Refurbished iPhone 13 with A15 Bionic chip and Cinematic mode',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 850000,
      currency: 'ZAR',
      images: ['/assets/iPhone13 Blue.jpg', '/assets/iPhone13 Green.jpg', '/assets/iPhone13 Midnight.jpg', '/assets/iPhone13 Pink.jpg', '/assets/iPhone13 Red.jpg', '/assets/iPhone13 Starlight.jpg'],
      variants: [
        { id: '6-1', condition: 'Excellent', storageGB: 128, color: 'Blue', priceCents: 850000, image: '/assets/iPhone13 Blue.jpg' },
        { id: '6-2', condition: 'Good', storageGB: 256, color: 'Green', priceCents: 880000, image: '/assets/iPhone13 Green.jpg' },
        { id: '6-3', condition: 'Like New', storageGB: 128, color: 'Midnight', priceCents: 870000, image: '/assets/iPhone13 Midnight.jpg' },
        { id: '6-4', condition: 'Excellent', storageGB: 256, color: 'Pink', priceCents: 890000, image: '/assets/iPhone13 Pink.jpg' },
        { id: '6-5', condition: 'Good', storageGB: 128, color: 'Red', priceCents: 860000, image: '/assets/iPhone13 Red.jpg' },
        { id: '6-6', condition: 'Like New', storageGB: 512, color: 'Starlight', priceCents: 920000, image: '/assets/iPhone13 Starlight.jpg' }
      ],
      inventory: 9,
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      title: 'iPhone 13 Pro',
      slug: 'iphone-13-pro',
      description: 'Refurbished iPhone 13 Pro with ProMotion display and Pro camera system',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 1100000,
      currency: 'ZAR',
      images: ['/assets/iPhone13Pro AlpineGreen.jpg', '/assets/iPhone13Pro Gold.jpg', '/assets/iPhone13Pro Graphite.jpg', '/assets/iPhone13Pro SierraBlue.jpg', '/assets/iPhone13Pro Silver.jpg'],
      variants: [
        { id: '7-1', condition: 'Excellent', storageGB: 128, color: 'Graphite', priceCents: 1100000, image: '/assets/iPhone13Pro Graphite.jpg' },
        { id: '7-2', condition: 'Good', storageGB: 256, color: 'Gold', priceCents: 1130000, image: '/assets/iPhone13Pro Gold.jpg' },
        { id: '7-3', condition: 'Like New', storageGB: 512, color: 'Sierra Blue', priceCents: 1180000, image: '/assets/iPhone13Pro SierraBlue.jpg' },
        { id: '7-4', condition: 'Excellent', storageGB: 256, color: 'Alpine Green', priceCents: 1120000, image: '/assets/iPhone13Pro AlpineGreen.jpg' },
        { id: '7-5', condition: 'Good', storageGB: 128, color: 'Silver', priceCents: 1090000, image: '/assets/iPhone13Pro Silver.jpg' }
      ],
      inventory: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '8',
      title: 'iPhone 14 Plus',
      slug: 'iphone-14-plus',
      description: 'Refurbished iPhone 14 Plus with larger display and advanced camera system',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 1000000,
      currency: 'ZAR',
      images: ['/assets/iPhone14Plus Blue.jpg', '/assets/iPhone14Plus Midnight.jpg'],
      variants: [
        { id: '8-1', condition: 'Excellent', storageGB: 128, color: 'Blue', priceCents: 1000000, image: '/assets/iPhone14Plus Blue.jpg' },
        { id: '8-2', condition: 'Good', storageGB: 256, color: 'Midnight', priceCents: 1030000, image: '/assets/iPhone14Plus Midnight.jpg' },
        { id: '8-3', condition: 'Like New', storageGB: 512, color: 'Purple', priceCents: 1060000, image: '/assets/iPhone14Plus Blue.jpg' }
      ],
      inventory: 7,
      createdAt: new Date().toISOString(),
    },
    {
      id: '9',
      title: 'iPhone 15 Series',
      slug: 'iphone-15-series',
      description: 'Latest iPhone 15 series with USB-C and advanced features',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 1300000,
      currency: 'ZAR',
      images: ['/assets/WhatsApp Image 2025-09-11 at 04.37.36_3ae282fd.jpg'],
      variants: [
        { id: '9-1', condition: 'Like New', storageGB: 128, color: 'Black Titanium', priceCents: 1300000, image: '/assets/WhatsApp Image 2025-09-11 at 04.37.36_3ae282fd.jpg' },
        { id: '9-2', condition: 'Like New', storageGB: 256, color: 'White Titanium', priceCents: 1350000, image: '/assets/WhatsApp Image 2025-09-11 at 04.37.36_3ae282fd.jpg' },
        { id: '9-3', condition: 'Like New', storageGB: 512, color: 'Blue Titanium', priceCents: 1400000, image: '/assets/WhatsApp Image 2025-09-11 at 04.37.36_3ae282fd.jpg' }
      ],
      inventory: 8,
      createdAt: new Date().toISOString(),
    }
  ]

  // Apply filters (placeholder)
  let filtered = products
  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category)
  }
  if (filters.brand) {
    filtered = filtered.filter(p => p.brand === filters.brand)
  }

  return filtered
}

export const getProduct = async (slug) => {
  const products = await getProducts()
  return products.find(p => p.slug === slug)
}

export const createProduct = async (productData) => {
  console.log('Creating product:', productData)
  return { id: 'new-id', ...productData }
}

export const updateProduct = async (id, productData) => {
  console.log('Updating product:', id, productData)
  return { id, ...productData }
}

export const deleteProduct = async (id) => {
  console.log('Deleting product:', id)
  return true
}
