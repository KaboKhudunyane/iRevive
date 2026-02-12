import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@irevive.co.za' },
    update: {},
    create: {
      email: 'admin@irevive.co.za',
      password: '$2b$10$hashed_password_here', // Use bcrypt to hash password
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create sample products
  const iphone8 = await prisma.product.upsert({
    where: { slug: 'iphone-8' },
    update: {},
    create: {
      title: 'iPhone 8',
      slug: 'iphone-8',
      description: 'Refurbished iPhone 8 with excellent condition and Home button',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 420000,
      currency: 'ZAR',
      images: ['/assets/iPhone8 Black.jpg', '/assets/iPhone8 White.jpg', '/assets/iPhone8 Red.jpg'],
      inventory: 5,
      variants: {
        create: [
          { condition: 'Excellent', storageGB: 64, color: 'Black', priceCents: 420000, image: '/assets/iPhone8 Black.jpg' },
          { condition: 'Good', storageGB: 64, color: 'White', priceCents: 400000, image: '/assets/iPhone8 White.jpg' },
          { condition: 'Excellent', storageGB: 256, color: 'Red', priceCents: 450000, image: '/assets/iPhone8 Red.jpg' }
        ]
      }
    },
  })

  const iphone11 = await prisma.product.upsert({
    where: { slug: 'iphone-11' },
    update: {},
    create: {
      title: 'iPhone 11',
      slug: 'iphone-11',
      description: 'Refurbished iPhone 11 with dual camera system and Liquid Retina display',
      brand: 'Apple',
      category: 'Smartphones',
      priceCents: 550000,
      currency: 'ZAR',
      images: ['/assets/iPhone 11 2.jpg', '/assets/iPhone 11 3.jpg', '/assets/iPhone 11 white.jpg'],
      inventory: 10,
      variants: {
        create: [
          { condition: 'Excellent', storageGB: 64, color: 'Black', priceCents: 550000, image: '/assets/iPhone 11 2.jpg' },
          { condition: 'Good', storageGB: 128, color: 'White', priceCents: 570000, image: '/assets/iPhone 11 white.jpg' },
          { condition: 'Like New', storageGB: 256, color: 'Purple', priceCents: 600000, image: '/assets/iPhone 11 3.jpg' }
        ]
      }
    },
  })

  console.log('Database seeded successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
