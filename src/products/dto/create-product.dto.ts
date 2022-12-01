import { createZodDto } from '@anatine/zod-nestjs';
import {
  category,
  product,
  zId,
  zIdNumStr,
  zName,
  zStatus,
  zString,
} from './../../common/types/z.schema';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { zImage } from '../../common/types/z-image.schema';
import { zHighlight } from './create-highlight.dto';

export const zProductCreateObj = z.object({
  parentId: zIdNumStr(
    product,
    `to which this belongs as a sub-${product}`,
    true,
  ),

  categoryId: zIdNumStr(
    category,
    `${category} to which this ${product} belongs`,
  ),

  name: zName(product, 1000),
  description: zString(product, 10000, 'description'),

  highlights: z.array(zHighlight),

  status: zStatus(category),
});

export const zCreateProduct = extendApi(
  zProductCreateObj.extend({
    images: z.array(zImage(product)),
  }),
  {
    description: `The schema for the ${product} model`,
  },
);

export class CreateProductDto extends createZodDto(zCreateProduct) {}
