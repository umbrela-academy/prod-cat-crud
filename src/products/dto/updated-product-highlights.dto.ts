import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const updatedProductHighlighsDto = z.object({
  id: z.number().min(0),
  description: z.string().min(1),
});

export class UpdatedProductHighlightsDto extends createZodDto(
  updatedProductHighlighsDto,
) {}
