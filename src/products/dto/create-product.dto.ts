import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { zImage } from '../../common/types/z-image.schema';
import {
  category,
  product,
  zIdNumStr,
  zName,
  zStatus,
  zString,
} from './../../common/types/z.schema';

export const zProductCreateObj = z.object({
  parentId: zIdNumStr(
    product,
    `to which this belongs as a sub-${product}`,
    true,
  ),

  categoryId: zIdNumStr(category, `to which this ${product} belongs`),

  name: zName(product, 1000),
  description: zString(product, 10000, 'description'),

  highlight: extendApi(z.string(), {
    description: `The highlight of this product`,
    type: 'string',
    minimum: 1,
  }),

  status: zStatus(product),
});

export const zCreateProduct = extendApi(
  zProductCreateObj.extend({
    images: z.array(zImage(product)).optional(),
  }),
  {
    description: `The schema for the ${product} model`,
  },
);

export class CreateProductDto extends createZodDto(zCreateProduct) {}
