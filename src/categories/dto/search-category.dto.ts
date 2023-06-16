import { z } from 'zod';
import { zCategoryCreateObj } from './create-category.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const getSearchCategoryDto = zCategoryCreateObj
  .extend({
    images: z.array(z.string().url()),
  })
  .omit({
    status: true,
    parentId: true,
    id: true,
  });

export class GetSearchCategoryDto extends createZodDto(getSearchCategoryDto) {}
