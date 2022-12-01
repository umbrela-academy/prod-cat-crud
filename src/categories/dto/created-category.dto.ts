import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { getCategoryDto } from './get-category.dto';

const createdCategoryDto = getCategoryDto
  .pick({
    image: true,
  })
  .extend({
    id: z.number().min(1),
  });

export class CreatedCategoryDto extends createZodDto(createdCategoryDto) {}
