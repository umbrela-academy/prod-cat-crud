import { z } from 'zod';

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILENAME_LENGTH = 50;

const WHITELISTED_MIMES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

const ACCEPTED_EXTENSIONS = WHITELISTED_MIMES.map((mime) => mime.split('/')[1])
  .join(', ')
  .slice(0, -1);

const fileSchema = z.object({
  fieldname: z.string().startsWith('file', { message: 'Incorrect field' }),
  originalname: z
    .string()
    .max(
      MAX_FILENAME_LENGTH,
      `File name should not exceed ${MAX_FILENAME_LENGTH} characters`,
    ),
  encoding: z.string(),
  mimetype: z
    .string()
    .regex(
      new RegExp(
        WHITELISTED_MIMES.map((mime) => mime.replace('/', '\\/')).join('|'),
      ),
      {
        message: `File type must be one among [${ACCEPTED_EXTENSIONS}]`,
      },
    ),
  buffer: z.any(),
  size: z
    .number()
    .max(MAX_FILE_SIZE, { message: 'File size must be less than 10 MB' }),
});

export const zCsvValidator = fileSchema;
