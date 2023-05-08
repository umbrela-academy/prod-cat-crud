import { z } from 'zod';

//                         1 MB   1 KB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

const MAX_FILENAME_LENGTH = 50;
export const WHITELISTED_MIMES = ['text/csv'];

const ACCEPTED_EXTENSIONS = WHITELISTED_MIMES.map((mime) => mime.split('/')[1])
  .join(', ')
  .slice(0, -1);

export const zCsvValidator = z.object({
  fieldname: z.string().startsWith('csv', { message: 'incorrect field' }),
  originalname: z
    .string()
    .max(
      MAX_FILENAME_LENGTH,
      `csv name should not be longer than ${MAX_FILENAME_LENGTH} characters`,
    ),
  encoding: z.string(),
  mimetype: z.string().regex(/csv/, {
    message: `csv type must be one among [${ACCEPTED_EXTENSIONS}]`,
  }),
  buffer: z.any(),
  size: z
    .number()
    .max(MAX_FILE_SIZE, { message: 'image size must be less than 10 MB' }),
});
