import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { highlight, zString } from '../../common/types/z.schema';
import { z } from 'zod';

export const zHighlight = z.object({
  description: zString(highlight, 2000, 'description'),
});

export const zCreateHighlight = extendApi(zHighlight, {
  title: `Highlight`,
  description: `The schema for the ${highlight} model`,
});

const zCreateHighlights = extendApi(z.array(zHighlight), {
  title: `Highlights`,
  description: `The schema for creating multiple highlights`,
});

export class CreateHighlightDto extends createZodDto(zCreateHighlight) {}

export class CreateHightlightsDto extends createZodDto(zCreateHighlights) {}
