import { BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';

export const throw400IfInvalid = (zValidator: () => void) => {
  try {
    zValidator();
  } catch (e) {
    if (e instanceof ZodError) {
      throw new BadRequestException(
        e.issues.map((issue) => issue.message).join(' & '),
      );
    }
  }
};
