import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Fashion', status: 'ACTIVE' },
    { name: 'Technology', status: 'ACTIVE' },
    { name: 'Cars', status: 'ACTIVE' },
    { name: 'Agriculture', status: 'ACTIVE' },
    { name: 'Decor', status: 'ACTIVE' },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        status: 'ACTIVE',
        categoryImage: {
          create: {
            destination: 'default',
            originalname: 'imagename',
            filename: 'filename',
            mimetype: 'image/png',
          },
        },
      },
    });
    console.log(`Created category with name: ${category.name}`);
  }

  const products = [
    { name: 'MacBook Air' },
    { name: 'Iphone' },
    { name: 'Samsung Galaxy' },
    { name: 'Curtains' },
    { name: 'Carpets' },
    { name: 'Whiskeys' },
    { name: 'Fan' },
    { name: 'Heater' },
    { name: 'Theory of Everything Book' },
    { name: 'Fundamental of C Book' },
  ];

  const createdProducts = await prisma.product.createMany({
    data: products.map((product) => ({
      name: product.name,
      categoryId: 1,
      status: 'ACTIVE',
      description: `Description of ${product.name}`,
    })),
  });

  console.log(`Created products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
