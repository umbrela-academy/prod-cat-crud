import { FileValidator, Injectable } from '@nestjs/common';
import { UploadedFileModel } from '../types/uploaded-file.model';
import { z, ZodError } from 'zod';
import { zImageValidator } from '../types/z.schema';

@Injectable()
export class ZImageValidationPipe extends FileValidator<Record<string, any>> {
  constructor() {
    super({ opt: 'empty' });
  }

  isValid(file?: UploadedFileModel): boolean | Promise<boolean> {
    console.log('file', file);
    return zImageValidator.safeParse(file).success;
  }

  buildErrorMessage(file: any): string {
    try {
      zImageValidator.parse(file);
      return '';
    } catch (e) {
      if (e instanceof ZodError) {
        return e.issues.map((i) => i.message).join(', and ');
      }
      return 'Unknown file-related errors occurred';
    }
  }
}
