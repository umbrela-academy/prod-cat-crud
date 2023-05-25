import { generateMock } from '@anatine/zod-mock';
import { CreatedProductDto } from 'src/products/dto/created-product.dto';
import { GetProductDto } from 'src/products/dto/get-product.dto';
import { z } from 'zod';
import { zCsvCreateSchema } from '../dto/create-csv.dto';
import { UpdateCsvDto } from '../dto/update-csv.dto';

export const csvProdCreatedResponse: CreatedProductDto[] = [
  {
    id: 1,
    highlights: [
      {
        id: 1,
        description: 'Product Highlight 1',
      },
    ],
    images: ['http://localhost:3333/api/images/products/1'],
  },
  {
    id: 2,
    highlights: [
      {
        id: 2,
        description: 'Product Highlight 2',
      },
    ],
    images: ['http://localhost:3333/api/images/products/2'],
  },
];

export const prismaCsvCreatedResponse = [
  {
    id: 1,
    images: [{ id: 1 }],
    highlights: [
      {
        id: 1,
        description: 'Product Highlight 1',
      },
    ],
  },
  {
    id: 2,
    images: [{ id: 2 }],
    highlights: [
      {
        id: 2,
        description: 'Product Highlight 2',
      },
    ],
  },
];

export const csvProdUpdateRequest: UpdateCsvDto[] = [
  {
    id: 1,
    name: 'Update Name 1',
    description: 'Update Description 1',
    categoryId: 1,
    parentId: 1,
    status: 'ACTIVE',
  },
  {
    id: 1,
    name: 'Update Name 2',
    description: 'Update Description 2',
    categoryId: 1,
    parentId: 1,
    status: 'DELETE',
  },
];

export const prismaCsvUpdateResponse = [
  {
    id: 1,
    name: 'Product 1',
    images: [{ id: 1 }],
    categoryId: 1,
    parentId: 1,
    status: 'ACTIVE',
    description: 'Update Description 1',
    highlights: [
      {
        id: 1,
        description: 'Highlight of Product 1',
      },
    ],
  },
  {
    id: 2,
    name: 'Product 2',
    images: [{ id: 2 }],
    categoryId: 1,
    parentId: 1,
    status: 'PENDING',
    description: 'Update Description 2',
    highlights: [
      {
        id: 2,
        description: 'Highlight of Product 2',
      },
    ],
  },
];

export const csvProdUpdateResponse: GetProductDto[] = [
  {
    id: 1,
    categoryId: 1,
    parentId: 1,
    name: 'Product 1',
    description: 'Update Description 1',
    status: 'ACTIVE',
    highlights: [
      {
        id: 1,
        description: 'Highlight of Product 1',
      },
    ],
    images: ['http://localhost:3333/api/images/products/1'],
  },
  {
    id: 2,
    categoryId: 1,
    parentId: 1,
    name: 'Product 2',
    description: 'Update Description 2',
    status: 'PENDING',
    highlights: [
      {
        id: 2,
        description: 'Highlight of Product 2',
      },
    ],
    images: ['http://localhost:3333/api/images/products/2'],
  },
];

export const invalidProdUpdateRequest = [
  {
    parentId: 1,
  },
  {
    categoryId: 'abcd',
  },
];

export const invalidCsv = generateMock(z.array(zCsvCreateSchema));

export const ProdCreateResIntegration = [
  {
    id: 1,
    highlights: [
      {
        id: 1,
        description: 'Highlight of Product',
      },
    ],
    images: ['http://localhost:3333/api/images/products/1'],
  },
  {
    id: 2,
    highlights: [
      {
        id: 2,
        description: 'Highlight of Product',
      },
    ],
    images: ['http://localhost:3333/api/images/products/2'],
  },
];

export const ProdUpdateResIntegration = [
  {
    id: 1,
    categoryId: 1,
    parentId: null,
    name: 'Updated Product 1',
    description: 'Updated Description',
    status: 'ACTIVE',
    highlights: [
      {
        id: 1,
        description: 'Highlight of Product',
      },
    ],
    images: ['http://localhost:3333/api/images/products/3'],
  },
];

export const findImagePrismaResponse = {
  id: 1,
  destination: 'default',
  originalname: 'originalname.png',
  filename: 'filename.png',
  mimetype: 'image/png',
  url: 'example.com/123',
};
