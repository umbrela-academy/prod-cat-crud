import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { zProductCreateObj } from './create-product.dto';
import { zGetHighlight } from './get-highlight.dto';

export const getProductDto = zProductCreateObj
  .extend({
    images: z.array(z.string().url()),
  })
  .omit({
    highlight: true,
    parentId: true,
  })
  .extend({
    parentId: z.number().nullable(),
    highlights: z.array(zGetHighlight),
  });

export class GetProductDto extends createZodDto(getProductDto) {}
