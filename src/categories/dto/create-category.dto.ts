import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { zImage } from '../../common/types/z-image.schema';

import {
  category,
  zId,
  zName,
  zStatus,
  zIdNumStr,
} from './../../common/types/z.schema';

export const zCategoryCreateObj = z.object({
  parentId: zId(category, `to which this belongs as a sub-${category}`, true),
  name: zName(category, 500),
  status: zStatus(category),
});

export const zCreateCategory = extendApi(
  z.object({
    parentId: zIdNumStr(
      category,
      `to which this belongs as a sub-${category}`,
      true,
    ),
    name: zName(category, 500),
    status: zStatus(category),
    image: zImage(category),
  }),
  {
    description: `The schema for the ${category} model`,
  },
);

export class CreateCategoryDto extends createZodDto(zCreateCategory) {}
