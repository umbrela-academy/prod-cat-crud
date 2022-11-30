import { createZodDto } from '@anatine/zod-nestjs';
import { zId, zString } from './../../common/types/z.schema';

import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { product } from './product.entity';

export const highlight = 'highlight' as const;

export const zHighlight = extendApi(
  z.object({
    id: zId(highlight),
    title: zString(highlight, 500, 'title'),
    description: zString(highlight, 2000, 'description'),
    productId: zId(product, `which this ${highlight} describes`),
  }),
  {
    title: `Highlight`,
    description: `The schema for the ${highlight} model`,
  },
);

export class Highlight extends createZodDto(zHighlight) {}
