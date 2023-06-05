import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { zName, zString, zStatus } from '../types/z.schema';

const zImagesArray = z
  .string()
  .transform((value) => {
    const urls = value.split(',').map((url) => url.trim());
    return urls;
  })
  .refine((value) => {
    if (value.length === 0) {
      throw new BadRequestException('images row must not be empty');
    }

    return true;
  });

export const zCsvCreate = z.object({
  parentId: z.number().min(1).optional().nullable(),
  categoryId: z.number().min(1),
  name: zName('product', 1000),
  description: zString('product', 10000, 'description'),
  highlight: z.string(),
  status: zStatus('product'),
  images: zImagesArray,
});

export const zCsvCreateArray = z.array(zCsvCreate);

export const zCsvUpdate = z.object({
  id: z.number().min(1),
  parentId: z.number().min(1).optional().nullable(),
  categoryId: z.number().min(1).optional().nullable(),
  name: zName('product', 1000).optional().nullable(),
  description: zString('product', 10000, 'description').optional().nullable(),
  status: zStatus('product').optional().nullable(),
  images: z
    .string()
    .transform((value) => {
      const urls = value.split(',').map((url) => url.trim());
      return urls;
    })
    .refine((value) => {
      if (value.length === 0) {
        throw new BadRequestException('images row must not be empty');
      }
      return true;
    })
    .optional()
    .nullable(),
});

export const zCsvUpdateArray = z.array(zCsvUpdate);
