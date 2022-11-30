import { zCategory } from './../../categories/entities/category.entity';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { zId, zName } from '../../common/types/z.schema';
import { zString } from './../../common/types/z.schema';
import { zHighlight } from './highlight.entity';

export const product = 'product' as const;

export const zProduct = extendApi(
  z.object({
    id: zId(product),
    name: zName(product, 1000),
    description: zString(product, 10_000, 'description'),
    parentId: zId(product, `to which this belongs as a sub-${product}`, true),
    highlights: zHighlight.array(),
    categoryId: zCategory.shape.id,
  }),
  {
    title: `Product`,
    description: `The schema for the ${product} model`,
  },
);

export class Product extends createZodDto(zProduct) {}
