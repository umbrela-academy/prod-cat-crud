import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { zId, zImage, zName, zStatus } from './../../common/types/z.schema';

export const category = 'category' as const;

export const zCategory = extendApi(
  z.object({
    id: zId(category),
    parentId: zId(category, `to which this belongs as a sub-${category}`, true),
    name: zName(category, 1000),
    image: zImage(category),
    status: zStatus(category),
  }),
  {
    title: `Category`,
    description: `The schema for the ${category} model`,
  },
);

export class Category extends createZodDto(zCategory) {}
