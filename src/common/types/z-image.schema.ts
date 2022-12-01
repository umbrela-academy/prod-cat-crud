import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { MainResource } from './z.schema';

//TODO #8 put the consts below in the config, with zod validator
// Max 10MB allows for Amazon-style lens based zoom-in view of the pictures

//                         1 MB   1 KB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Below 2kb files would most likely be part of a DDoS
// or too poor quality to be of any use
const MIN_FILE_SIZE = 2 * 1024;

const MAX_FILENAME_LENGTH = 50;

export const WHITELISTED_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
  'image/webp',
];

const ACCEPTED_EXTENSIONS = WHITELISTED_MIMES.map((mime) => mime.split('/')[1])
  .join(', ')
  .slice(0, -1);

export const zImageValidator = z.object({
  fieldname: z.string().startsWith('image', { message: 'incorrect field' }),
  originalname: z
    .string()
    .max(
      MAX_FILENAME_LENGTH,
      `image name should not be longer than ${MAX_FILENAME_LENGTH} characters`,
    ),
  encoding: z.string(),
  mimetype: z.string().regex(/png$|jpg$|jpeg$|webp$|gif$/, {
    message: `image type must be one among [${ACCEPTED_EXTENSIONS}]`,
  }),
  buffer: z.any(),
  size: z
    .number()
    .min(MIN_FILE_SIZE, { message: 'image size must be greater than 2 KB' })
    .max(MAX_FILE_SIZE, { message: 'image size must be less than 10 MB' }),
});

export const zImage = (resource: MainResource) =>
  extendApi(z.any().optional(), {
    description: `The image file that represents this ${resource}`,
    format: 'binary',
    type: 'string',
  });
