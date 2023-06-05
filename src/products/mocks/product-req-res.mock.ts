import { GetProductDto } from './../dto/get-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreatedProductDto } from './../dto/created-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { join } from 'path';
import * as fs from 'fs';

export const filepath = join('test', '34563.png');
export const mockFile = {
  fieldname: 'file',
  originalname: '34563.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: fs.readFileSync(filepath),
  size: 3638506,
} as Express.Multer.File;

export const mockFiles = [mockFile, mockFile];

export const prodCreateRequest: CreateProductDto = {
  categoryId: 4,
  name: 'product a',
  description: 'prod desc',
  highlight: 'prod highlight',
  status: 'PENDING',
  images: mockFiles,
};

export const prodCreatedResponse: CreatedProductDto = {
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
};

export const prodFindMultiResponse: GetProductDto[] = [
  {
    id: 1,
    categoryId: 4,
    parentId: null,
    name: 'product a',
    description: 'prod desc',
    status: 'PENDING',
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
  {
    id: 2,
    categoryId: 4,
    parentId: 1,
    name: 'product b',
    description: 'prod desc b',
    status: 'PENDING',
    highlights: [
      {
        id: 2,
        description: 'prod highlight b',
      },
    ],
    images: [
      'http://localhost:3333/api/images/products/3',
      'http://localhost:3333/api/images/products/4',
    ],
  },
];

export const addedImages = [
  {
    id: 5,
    url: 'http://localhost:3333/api/images/products/5',
  },
  {
    id: 6,
    url: 'http://localhost:3333/api/images/products/6',
  },
  {
    id: 7,
    url: 'http://localhost:3333/api/images/products/7',
  },
  {
    id: 8,
    url: 'http://localhost:3333/api/images/products/8',
  },
];

export const addHighlightsRequest = [
  {
    description: 'new highlight 1',
  },
  {
    description: 'new highlight 2',
  },
];

export const addedHighlightsResponse = [
  {
    id: 3,
    description: 'prod highlight b',
  },
  {
    id: 6,
    description: 'new highlight 1',
  },
  {
    id: 7,
    description: 'new highlight 2',
  },
];

export const updateHighlightsRequest = {
  edit: [
    {
      id: 2,
      description: 'highlight update 2',
    },
    {
      id: 4,
      description: 'highlight update 4',
    },
  ],
  remove: [5],
};

export const updatedHighlightsResponse = [
  {
    id: 2,
    description: 'string update 2',
  },
  {
    id: 4,
    description: 'string update 4',
  },
];

export const removedHightResponse = {
  id: 3,
  categoryId: 4,
  parentId: 2,
  name: 'product b',
  description: 'prod desc b',
  status: 'PENDING',
};

export const prodPatchRequest: UpdateProductDto = {
  categoryId: 5,
  name: 'string',
  description: 'string',
  status: 'PENDING',
};

export const prodPatchResponse: GetProductDto = {
  id: 2,
  categoryId: 5,
  parentId: null,
  name: 'string',
  description: 'prod desc b',
  status: 'PENDING',
  highlights: [
    {
      id: 2,
      description: 'string update 2',
    },
  ],
  images: ['http://localhost:3333/api/images/products/3'],
};
