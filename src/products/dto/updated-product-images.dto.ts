import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const updatedProductImagesDto = z.object({
  id: z.number().min(0),
  url: z.string().url(),
});

export class UpdatedProductImagesDto extends createZodDto(
  updatedProductImagesDto,
) {}
