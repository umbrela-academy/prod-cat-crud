import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const category = 'category' as const;
export const product = 'product' as const;
export const highlight = 'highlight' as const;

export const zStatuses = z.enum(['PENDING', 'ACTIVE', 'DELETE']);

export type MainResource = 'category' | 'product';
export type EntityName = MainResource | 'image' | 'highlight';

export const zZeroIndexParam = (paramName = 'index') =>
  z.number().min(0, `${paramName} should be greater than or equal to 0`);

export const zIdParam = (paramName = 'id') =>
  z.number().min(1, `${paramName} should be greater than or equal to 1`);

export const zId = (entity: EntityName, relation = '', optional = false) =>
  extendApi(
    optional ? z.number().min(1).optional().nullable() : z.number().min(1),
    {
      description: `The unique internal identity number for the ${entity} ${relation}`,
      type: 'number',
      minimum: 1,
    },
  );

const numStringT = (schema: z.ZodString) =>
  schema
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), 'must be a number')
    .refine((val) => val > 0, 'must be greater than 0');

export const zIdNumStr = (
  entity: EntityName,
  relation = '',
  optional = false,
) => {
  const numStrSchema = optional
    ? numStringT(z.string().min(1)).optional()
    : numStringT(z.string().min(1));
  return extendApi(numStrSchema, {
    description: `The unique internal identity number for the ${entity} ${relation}`,
    type: 'number',
    minimum: 1,
  });
};

export const zStatus = (entity: MainResource) =>
  extendApi(zStatuses, {
    description: `The status of the ${entity}`,
    type: 'string',
  });

export const zString = (
  entity: EntityName,
  maxLength: number,
  field = 'name',
) =>
  extendApi(z.string().min(1).max(maxLength), {
    description: `The ${field} of the ${entity}`,
    type: 'string',
    minLength: 1,
    maxLength,
  });

export const zName = (entity: EntityName, maxLength: number) =>
  zString(entity, maxLength, 'name');
