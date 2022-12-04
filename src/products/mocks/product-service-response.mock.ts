import { CreatedProductDto } from '../dto/created-product.dto';

export const prismaCreateResponse = {
  images: [{ id: 1 }, { id: 2 }],
  highlights: [
    {
      description: 'prod highlight',
      id: 1,
    },
    {
      description: 'highlight 2',
      id: 2,
    },
  ],
  id: 1,
};

export const prismaFindMultiResponse = [
  prismaCreateResponse,
  prismaCreateResponse,
];

export const prodServiceCreatedResponse: CreatedProductDto = {
  id: 1,
  highlights: [
    {
      description: 'prod highlight',
      id: 1,
    },
    {
      description: 'highlight 2',
      id: 2,
    },
  ],
  images: ['/products/1', '/products/2'],
};

export const prodServiceFindMultiResponse = [
  prodServiceCreatedResponse,
  prodServiceCreatedResponse,
];

export const prismaLayerProdDeleteResponse = {
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
  images: [{ id: 1 }, { id: 2 }],
};

export const serviceLayerProdDeleteResponse = {
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
  images: ['/products/1', '/products/2'],
};

export const prismaLayerProdUpdateResponse = prismaLayerProdDeleteResponse;
export const serviceLayerProdUpdateResponse = serviceLayerProdDeleteResponse;
