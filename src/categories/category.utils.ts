import { Category, CategoryImage } from '@prisma/client';

export const includeImage = {
  include: {
    categoryImage: true,
  },
};

export type CategoryWithImage = Category & {
  categoryImage: CategoryImage;
};

export const toImageUrl = (url?: string) => (id: number) => ({
  image: url ? `${url}categories/${id}` : `/categories/${id}`,
});

export const toGetCategoryDto =
  (url?: string) =>
  ({ categoryImage, ...cat }: CategoryWithImage) => ({
    ...cat,
    ...toImageUrl(url)(categoryImage.id),
  });
