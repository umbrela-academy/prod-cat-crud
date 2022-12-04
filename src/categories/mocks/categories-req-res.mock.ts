import { toGetCategoryDto } from '../category.utils';

export const prismaLayerResponse = {
  id: 1,
  categoryImage: {
    id: 1,
    destination: 'default',
    originalname: '34563.png',
    filename: 'd1b96c16a967c6fdc7f7d440c9310531',
    mimetype: 'image/png',
  },
};

export const prismaLayerMultiResponse = [
  {
    id: 1,
    categoryImage: {
      id: 1,
      destination: 'default',
      originalname: '34563.png',
      filename: 'd1b96c16a967c6fdc7f7d440c9310531',
      mimetype: 'image/png',
    },
  },
  {
    id: 2,
    categoryImage: {
      id: 2,
      destination: 'default',
      originalname: '34563.png',
      filename: 'd1b96c16a967c6fdc7f7d440c9310531',
      mimetype: 'image/png',
    },
  },
];

export const prismaLayerDeleteResponse = {
  id: 1,
  parentId: 4,
  name: 'AS category',
  status: 'ACTIVE',
  image: 1,
};

export const prismaLayerUpdateResponse = prismaLayerDeleteResponse;

export const deleteResponse = {
  id: 1,
  parentId: 4,
  name: 'AS category',
  status: 'ACTIVE',
  image: '/categories/1',
};

export const updateResponse = deleteResponse;

export const multiResponse = prismaLayerMultiResponse.map(toGetCategoryDto());
