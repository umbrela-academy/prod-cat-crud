import { createZodDto } from '@anatine/zod-nestjs';
import { BadRequestException } from '@nestjs/common';
import { zName, zString, zStatus } from 'src/common/types/z.schema';
import { z } from 'zod';

const zImagesArray = z
  .string()
  .transform((value) => {
    try {
      const imagesArray = JSON.parse(value);
      if (Array.isArray(imagesArray)) {
        return imagesArray;
      }
    } catch (e) {}
    return [];
  })
  .refine((value) => {
    if (value.length === 0) {
      throw new BadRequestException('images row must be an array ');
    }
    return true;
  });

export const zCsvCreateSchema = z.object({
  parentId: z.number().min(1).optional().nullable(),
  categoryId: z.number().min(1),
  name: zName('product', 1000),
  description: zString('product', 10000, 'description'),
  highlight: z.string(),
  status: zStatus('product'),
  images: zImagesArray,
});
export class CreateCsvDto extends createZodDto(zCsvCreateSchema) {}
