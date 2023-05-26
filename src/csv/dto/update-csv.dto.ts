import { createZodDto } from '@anatine/zod-nestjs';
import { PartialType } from '@nestjs/swagger';
import { zCsvUpdate } from 'src/common/services/z-csv-data.validator';

class CsvUpdateScalars extends createZodDto(zCsvUpdate) {}
export class UpdateCsvDto extends PartialType(CsvUpdateScalars) {}
