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
        description: 'prod highlight',
      },
    ],
    images: [
      'http://localhost:3333/api/images/products/1',
      'http://localhost:3333/api/images/products/2',
    ],
  },
];
