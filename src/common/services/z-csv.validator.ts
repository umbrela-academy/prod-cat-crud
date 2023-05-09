import { FileValidator, Injectable } from '@nestjs/common';
import { UploadedFileModel } from '../types/uploaded-file.model';
import { zCsvValidator } from '../types/z-csv.schema';
import { ZodError } from 'zod';

@Injectable()
export class ZCsvValidatorPipe extends FileValidator<Record<string, any>> {
  constructor() {
    super({ opt: 'empty' });
  }
  isValid(file?: UploadedFileModel): boolean | Promise<boolean> {
    return zCsvValidator.safeParse(file).success;
  }
  buildErrorMessage(file: any): string {
    try {
      zCsvValidator.parse(file);
      return '';
    } catch (e) {
      if (e instanceof ZodError) {
        return e.issues.map((i) => i.message).join(', and ');
      }
      return 'Unknown file-related errors occured';
    }
  }
}
