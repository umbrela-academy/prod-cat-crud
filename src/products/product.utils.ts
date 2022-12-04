import { Highlight, Product, ProductImage } from '@prisma/client';

export const includeHightsAndImages = {
  include: {
    images: true,
    highlights: {
      select: {
        id: true,
        description: true,
      },
    },
  },
};

export type ProductWithHighlightsAndImages = Product & {
  images: ProductImage[];
  highlights: Omit<Highlight, 'productId'>[];
};

export const toImageUrl = (url?: string) => (id: number) =>
  url ? `${url}products/${id}` : `/products/${id}`;

export const toGetProductDto =
  (url?: string) =>
  ({ images, ...prod }: ProductWithHighlightsAndImages) => ({
    ...prod,
    images: images.map((image) => toImageUrl(url)(image.id)),
  });
