import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { CreatedProductDto } from 'src/products/dto/created-product.dto';

export const mockCSV = {
  buffer: Buffer.from(__dirname + '../../../test/mock.csv'),
} as Express.Multer.File;

export const csvProdCreateRequest = {
  csv: mockCSV,
};

export const csvProdCreatedResponse: CreatedProductDto[] = [
  {
    id: 1,
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
    highlights: [
      {
        id: 2,
        description: 'Highlight of Product 2',
      },
    ],
    images: ['http://localhost:3333/api/images/products/2'],
  },
  {
    id: 3,
    highlights: [
      {
        id: 3,
        description: 'Highlight of Product 3',
      },
    ],
    images: ['http://localhost:3333/api/images/products/3'],
  },
];
