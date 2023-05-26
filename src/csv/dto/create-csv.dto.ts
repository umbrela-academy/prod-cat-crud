import { createZodDto } from '@anatine/zod-nestjs';
import { zCsvCreate } from '../../common/services/z-csv-data.validator';

export class CreateCsvDto extends createZodDto(zCsvCreate) {}
