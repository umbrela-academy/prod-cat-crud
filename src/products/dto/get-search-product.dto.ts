import { z } from 'zod';
import { zProductCreateObj } from './create-product.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const getSearchProductDto = zProductCreateObj
  .extend({
    images: z.array(z.string().url()),
  })
  .omit({
    parentId: true,
    categoryId: true,
    status: true,
  });

export class GetSearchProductDto extends createZodDto(getSearchProductDto) {}
