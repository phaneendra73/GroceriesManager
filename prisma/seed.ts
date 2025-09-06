import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Produce',
        description: 'Fresh fruits and vegetables',
        color: '#10b981',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dairy',
        description: 'Milk, cheese, yogurt, and other dairy products',
        color: '#3b82f6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bakery',
        description: 'Bread, pastries, and baked goods',
        color: '#f59e0b',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Meat & Seafood',
        description: 'Fresh meat, poultry, and seafood',
        color: '#ef4444',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pantry',
        description: 'Canned goods, pasta, rice, and other pantry staples',
        color: '#8b5cf6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages',
        description: 'Drinks, juices, and other beverages',
        color: '#06b6d4',
      },
    }),
  ])

  // Create items
  const items = await Promise.all([
    // Produce items
    prisma.item.create({
      data: {
        name: 'Bananas',
        description: 'Fresh yellow bananas',
        defaultQuantity: 6,
        price: 2.99,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1566393028639-d108a42c46a7?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Apples',
        description: 'Red delicious apples',
        defaultQuantity: 4,
        price: 3.49,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Lettuce',
        description: 'Fresh romaine lettuce',
        defaultQuantity: 1,
        price: 1.99,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Tomatoes',
        description: 'Fresh vine tomatoes',
        defaultQuantity: 4,
        price: 2.79,
        categoryId: categories[0].id,
        imageUrl: 'https://images.unsplash.com/photo-1592924379991-abd1b9ea5e0d?w=400&h=400&fit=crop',
      },
    }),
    // Dairy items
    prisma.item.create({
      data: {
        name: 'Milk',
        description: 'Whole milk, 1 gallon',
        defaultQuantity: 1,
        price: 4.99,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Cheese',
        description: 'Cheddar cheese block',
        defaultQuantity: 1,
        price: 6.99,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb3a47747bc7?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Yogurt',
        description: 'Greek yogurt, 32oz',
        defaultQuantity: 1,
        price: 5.49,
        categoryId: categories[1].id,
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
      },
    }),
    // Bakery items
    prisma.item.create({
      data: {
        name: 'Bread',
        description: 'Whole wheat bread loaf',
        defaultQuantity: 1,
        price: 3.99,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Bagels',
        description: 'Plain bagels, pack of 6',
        defaultQuantity: 1,
        price: 4.49,
        categoryId: categories[2].id,
        imageUrl: 'https://images.unsplash.com/photo-1586449246532-1c1e4cb5f659?w=400&h=400&fit=crop',
      },
    }),
    // Meat & Seafood items
    prisma.item.create({
      data: {
        name: 'Chicken Breast',
        description: 'Boneless skinless chicken breast',
        defaultQuantity: 2,
        price: 8.99,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d8c8a7?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Salmon',
        description: 'Fresh Atlantic salmon fillet',
        defaultQuantity: 1,
        price: 12.99,
        categoryId: categories[3].id,
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop',
      },
    }),
    // Pantry items
    prisma.item.create({
      data: {
        name: 'Pasta',
        description: 'Spaghetti pasta, 1lb',
        defaultQuantity: 1,
        price: 1.99,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1554412083-5276651418e0?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Rice',
        description: 'White rice, 2lb bag',
        defaultQuantity: 1,
        price: 3.49,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Canned Beans',
        description: 'Black beans, 15oz can',
        defaultQuantity: 2,
        price: 1.49,
        categoryId: categories[4].id,
        imageUrl: 'https://images.unsplash.com/photo-1548867998-4ffd1c4f3b8c?w=400&h=400&fit=crop',
      },
    }),
    // Beverage items
    prisma.item.create({
      data: {
        name: 'Orange Juice',
        description: '100% pure orange juice, 64oz',
        defaultQuantity: 1,
        price: 4.99,
        categoryId: categories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=400&h=400&fit=crop',
      },
    }),
    prisma.item.create({
      data: {
        name: 'Coffee',
        description: 'Ground coffee, 12oz',
        defaultQuantity: 1,
        price: 7.99,
        categoryId: categories[5].id,
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641aebac8c8e?w=400&h=400&fit=crop',
      },
    }),
  ])

  // Create default templates
  const weeklyEssentials = await prisma.template.create({
    data: {
      name: 'Weekly Essentials',
      description: 'Basic grocery items for weekly shopping',
      isDefault: true,
    },
  })

  const bakeryDairy = await prisma.template.create({
    data: {
      name: 'Bakery & Dairy',
      description: 'Fresh bakery and dairy products',
      isDefault: true,
    },
  })

  const produce = await prisma.template.create({
    data: {
      name: 'Produce',
      description: 'Fresh fruits and vegetables',
      isDefault: true,
    },
  })

  // Add items to templates
  await Promise.all([
    // Weekly Essentials template items
    prisma.templateItem.create({
      data: {
        templateId: weeklyEssentials.id,
        itemId: items[0].id, // Bananas
        quantity: 6,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: weeklyEssentials.id,
        itemId: items[1].id, // Apples
        quantity: 4,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: weeklyEssentials.id,
        itemId: items[4].id, // Milk
        quantity: 1,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: weeklyEssentials.id,
        itemId: items[7].id, // Bread
        quantity: 1,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: weeklyEssentials.id,
        itemId: items[12].id, // Pasta
        quantity: 1,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: weeklyEssentials.id,
        itemId: items[13].id, // Rice
        quantity: 1,
      },
    }),
    // Bakery & Dairy template items
    prisma.templateItem.create({
      data: {
        templateId: bakeryDairy.id,
        itemId: items[4].id, // Milk
        quantity: 1,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: bakeryDairy.id,
        itemId: items[5].id, // Cheese
        quantity: 1,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: bakeryDairy.id,
        itemId: items[6].id, // Yogurt
        quantity: 1,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: bakeryDairy.id,
        itemId: items[7].id, // Bread
        quantity: 1,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: bakeryDairy.id,
        itemId: items[8].id, // Bagels
        quantity: 1,
      },
    }),
    // Produce template items
    prisma.templateItem.create({
      data: {
        templateId: produce.id,
        itemId: items[0].id, // Bananas
        quantity: 6,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: produce.id,
        itemId: items[1].id, // Apples
        quantity: 4,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: produce.id,
        itemId: items[2].id, // Lettuce
        quantity: 1,
      },
    }),
    prisma.templateItem.create({
      data: {
        templateId: produce.id,
        itemId: items[3].id, // Tomatoes
        quantity: 4,
      },
    }),
  ])

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })