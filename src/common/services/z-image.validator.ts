import { FileValidator, Injectable } from '@nestjs/common';
import { ZodError } from 'zod';
import { UploadedFileModel } from '../types/uploaded-file.model';
import { zImageValidator } from '../types/z-image.schema';

@Injectable()
export class ZImageValidationPipe extends FileValidator<Record<string, any>> {
  constructor() {
    super({ opt: 'empty' });
  }

  isValid(file?: UploadedFileModel): boolean | Promise<boolean> {
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
