import { extendApi } from '@anatine/zod-openapi';
import { updatedProductHighlighsDto } from './updated-product-highlights.dto';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const updateProductHighlights = extendApi(
  z.object({
    edit: extendApi(z.array(updatedProductHighlighsDto), {
      description:
        'Array of existing highlight ids and their updated highlight descriptions ',
    }),
    remove: extendApi(z.array(z.number().min(0)), {
      description: 'Array of highlight ids that need to be removed',
    }),
  }),
  {
    description:
      'Updates or removes only those highlights which already belong to the given product',
  },
);

export class UpdateProductHighlightsDto extends createZodDto(
  updateProductHighlights,
) {}
