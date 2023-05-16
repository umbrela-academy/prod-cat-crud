import { createZodDto } from '@anatine/zod-nestjs';
import { PartialType } from '@nestjs/swagger';
import { z } from 'zod';
import { zName, zStatus, zString } from '../../common/types/z.schema';

export const zCsvUpdateSchema = z.object({
  id: z.number().min(1),
  parentId: z.number().min(1).optional().nullable(),
  categoryId: z.number().min(1).optional().nullable(),
  name: zName('product', 1000).optional().nullable(),
  description: zString('product', 10000, 'description').optional().nullable(),
  status: zStatus('product').optional().nullable(),
  images: z
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
    .optional()
    .nullable(),
});

class CsvUpdateScalars extends createZodDto(zCsvUpdateSchema) {}
export class UpdateCsvDto extends PartialType(CsvUpdateScalars) {}
