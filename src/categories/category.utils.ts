import { ZodError } from 'zod';
import { Category, CategoryImage } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

export const includeImage = {
  include: {
    categoryImage: true,
  },
};

export type CategoryWithImage = Category & {
  categoryImage: CategoryImage;
};

export const toGetCategoryDto =
  (url?: string) =>
  ({ categoryImage, ...cat }: CategoryWithImage) => ({
    ...cat,
    image: `${url}categories/${categoryImage.id}`,
  });
