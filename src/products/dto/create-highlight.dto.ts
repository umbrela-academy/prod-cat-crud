import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { highlight, zString } from 'src/common/types/z.schema';
import { z } from 'zod';

export const zHighlight = z.object({
  title: zString(highlight, 500, 'title'),
  description: zString(highlight, 2000, 'description'),
});

export const zCreateHighlight = extendApi(zHighlight, {
  title: `Highlight`,
  description: `The schema for the ${highlight} model`,
});

export class CreateHighlightDto extends createZodDto(zCreateHighlight) {}
