import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { UploadedFileModel } from "./uploaded-file.model";

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
  'jpeg',
  'jpg',
  'gif',
  'png',
  'webp',
];

const ACCEPTED_EXTENSIONS = WHITELISTED_MIMES.join(', ').slice(0, -1);

export const zImageValidator = z.object({
  fieldname: z.string().startsWith('image', { message: "incorrect field" }),
  originalname: z.string().max(25, "image name should not be longer than 25 characters"),
  encoding: z.string(),
  mimetype: z.string().regex(/png$|jpg$|jpeg$|webp$|gif$/, { message: `image type must be one among [${ACCEPTED_EXTENSIONS}]` }),
  buffer: z.any(),
  size: z.number()
    .min(2 * 1024, { message: "image size must be greater than 2 KB" })
    .max(10 * 1024 * 1024, { message: "image size must be less than 10 MB" })
});

export const zImage = (resource: MainResources) =>
  extendApi(z.any().optional(), {
    description: `The image file that represents this ${resource}`,
    format: 'binary',
    type: 'string',
    required: ['image']
  });
