import { FileValidator, Injectable } from '@nestjs/common';
import { ZodError } from 'zod';
import { UploadedFileModel } from '../types/uploaded-file.model';
import { zImageValidator } from '../types/z-image.schema';

@Injectable()
export class ZImagesValidationPipe extends FileValidator<Record<string, any>> {
  constructor() {
    super({ opt: 'empty' });
  }

  isValid(files?: UploadedFileModel[]): boolean | Promise<boolean> {
    if (!files?.length) {
      return false;
    }
    // fails early on first invalid file so that we don't have to parse through all files that way
    return files.every((file) => zImageValidator.safeParse(file).success);
  }

  buildErrorMessage(files: unknown[]): string {
    if (!files || !files.length) {
      return 'At least one image file is required';
    }
    try {
      files.forEach((file) => zImageValidator.parse(file));
      return '';
    } catch (e) {
      if (e instanceof ZodError) {
        return e.issues.map((i) => i.message).join(', and ');
      }
      return 'Unknown file-related errors occurred';
    }
  }
}
