import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const getCategoryDto = z.object({
  id: z.number().min(1),
  parentId: z.number().min(1).optional().nullable(),
  name: z.string(),
  image: z.string().url(),
});

export class GetCategoryDto extends createZodDto(getCategoryDto) {}
