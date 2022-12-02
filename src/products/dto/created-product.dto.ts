import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { getProductDto } from './get-product.dto';

export const createdProductDto = getProductDto
  .pick({
    images: true,
    highlights: true,
  })
  .extend({
    id: z.number().min(0),
  });

export class CreatedProductDto extends createZodDto(createdProductDto) {}
