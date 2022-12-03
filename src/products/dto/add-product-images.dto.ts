import { zImage } from './../../common/types/z-image.schema';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { product } from '../../common/types/z.schema';
import { createZodDto } from '@anatine/zod-nestjs';

const zAddProductImages = extendApi(
  z.object({
    images: z.array(zImage(product)).optional(),
  }),
  {
    description: `The schema for the ${product} images`,
  },
);

export class AddProductImagesDto extends createZodDto(zAddProductImages) {}
