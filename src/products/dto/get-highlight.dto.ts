import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { highlight, zId } from '../../common/types/z.schema';
import { zHighlight } from './create-highlight.dto';

export const zGetHighlight = extendApi(
  zHighlight.extend({
    id: zId(highlight),
  }),
  {
    description: `The schema for the ${highlight} response model`,
  },
);

export class GetHighlightDto extends createZodDto(zGetHighlight) {}
