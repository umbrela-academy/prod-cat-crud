import { FileValidator, Injectable } from '@nestjs/common';
import { ZodError } from 'zod';
import { UploadedFileModel } from '../types/uploaded-file.model';
import { zImageValidator } from '../types/z-image.schema';

@Injectable()
export class ZImageOptionalValidationPipe extends FileValidator<
  Record<string, any>
> {
  constructor() {
    super({ opt: 'empty' });
    console.log('kabul ready hai');
  }

  isValid(file?: UploadedFileModel): boolean | Promise<boolean> {
    console.log('kabul karnaa hai');
    if (file === undefined || file === null) {
      console.log('kabul kia');
      return true;
    }
    return zImageValidator.safeParse(file).success;
  }

  buildErrorMessage(file: any): string {
    console.log('kabul nahi hua');
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
