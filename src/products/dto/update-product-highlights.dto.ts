import { updatedProductHighlighsDto } from './updated-product-highlights.dto';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const updateProductHighlights = z.object({
  edit: z.array(updatedProductHighlighsDto),
  remove: z.array(z.number().min(0)),
});

export class UpdateProductHighlightsDto extends createZodDto(
  updateProductHighlights,
) {}
