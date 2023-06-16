import { Category, Product } from '@prisma/client';

export const prismaProductFindRes = {
  name: 'Product 1',
  description: 'Description of Product 1',
  images: [
    {
      id: 1,
    },
  ],
};

export const prismaProductFindManyRes = [
  prismaProductFindRes,
  prismaProductFindRes,
] as unknown as Product[];

export const prismaCategoryFindRes = {
  name: 'Category 1',
  categoryImage: {
    id: 1,
  },
};

export const prismaCategoryFindManyRes = [
  prismaCategoryFindRes,
  prismaCategoryFindRes,
] as unknown as Category[];

export const serviceLayerSearchRes = {
  products: [
    {
      name: 'Product 1',
      description: 'Description of Product 1',
      images: ['/products/1'],
    },

    {
      name: 'Product 1',
      description: 'Description of Product 1',
      images: ['/products/1'],
    },
  ],
  categories: [
    {
      name: 'Category 1',
      image: 'http://localhost:3333/api/images/categories/1',
    },
    {
      name: 'Category 1',
      image: 'http://localhost:3333/api/images/categories/1',
    },
  ],
};
