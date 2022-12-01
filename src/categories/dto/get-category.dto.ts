import { zCategoryCreateObj } from './create-category.dto';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const getCategoryDto = zCategoryCreateObj.extend({
  image: z.string().url(),
});

export class GetCategoryDto extends createZodDto(getCategoryDto) {}
