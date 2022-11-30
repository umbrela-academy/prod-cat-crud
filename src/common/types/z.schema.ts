import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const zStatuses = z.enum(['PENDING', 'ACTIVE', 'DELETE']);

export type MainResources = 'category' | 'product';
export type EntityNames = MainResources | 'image' | 'highlight';

export const zId = (entity: EntityNames, relation = '', optional = false) =>
  extendApi(optional ? z.number().min(1).optional() : z.number().min(1), {
    description: `The unique internal identity number for the ${entity} ${relation}`,
    type: 'number',
    minimum: 1,
    uniqueItems: relation.length === 0, // needs to be unique iff id is a primary key, in which case relation suffix is empty
  });

export const zStatus = (entity: MainResources) =>
  extendApi(zStatuses, {
    description: `The status of the ${entity}`,
    type: 'string',
  });

export const zString = (
  entity: EntityNames,
  maxLength: number,
  field = 'name',
) =>
  extendApi(z.string().min(1), {
    description: `The ${field} of the ${entity}`,
    type: 'string',
    minLength: 1,
    maxLength,
  });

export const zName = (entity: EntityNames, maxLength: number) =>
  zString(entity, maxLength, 'name');

// Max 10MB allows for Amazon-style lens based zoom-in view of the pictures
//                         1 MB   1 KB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Below 2kb files would most likely be part of a DDoS
// or too poor quality to be of any use
const MIN_FILE_SIZE = 2 * 1024;

const WHITELISTED_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
  'image/webp',
];

const ACCEPTED_EXTENSIONS = WHITELISTED_MIMES.map(
  (mime) => mime.split('/')[1],
).join(', ');

const zImageValidator = z
  .any()
  .refine(
    (image) => !WHITELISTED_MIMES.includes(image?.type),
    `Image must be one among ${ACCEPTED_EXTENSIONS}`,
  )
  .refine(
    (image) => image?.size > MAX_FILE_SIZE,
    'Image must be less than 10 MB in size',
  )
  .refine(
    (image) => image?.size < MIN_FILE_SIZE,
    'Image must be above 2 KB in size',
  );

export const zImage = (resource: MainResources) =>
  extendApi(zImageValidator, {
    description: `The image file that represents this ${resource}`,
    format: 'binary',
    type: 'string',
  });
