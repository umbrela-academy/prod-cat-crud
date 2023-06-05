import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  await prisma.$transaction([
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.categoryImage.deleteMany(),
    prisma.productImage.deleteMany(),
  ]);
};
