import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import * as xlsx from 'xlsx';
import { zCsvCreateArray, zCsvUpdateArray } from './z-csv-data.validator';

export class ExcelTransformationPipe implements PipeTransform {
  private create: Boolean;
  constructor(create: Boolean = true) {
    this.create = create;
  }
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    const json = this.toJson(file.buffer);
    const parseSchema = this.create ? zCsvCreateArray : zCsvUpdateArray;
    const parseResult = parseSchema.safeParse(json);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map(
        (issue) => issue.message,
      );
      throw new BadRequestException(errorMessages.join(', '));
    }
    return parseResult.data;
  }

  toJson(buffer: Buffer) {
    const excelData = xlsx.read(buffer);
    const sheetName = excelData.SheetNames[0];
    const sheet = excelData.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
  }
}
