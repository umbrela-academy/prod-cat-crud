import { Highlight, Product, ProductImage } from '@prisma/client';

export const includeHightsAndImages = {
  include: {
    images: true,
    highlights: true,
  },
};

export type ProductWithHighlightsAndImages = Product & {
  images: ProductImage[];
  highlights: Highlight[];
};

export const toImageUrl = (url?: string) => (id: number) =>
  `${url}products/${id}`;

export const toGetProductDto =
  (url?: string) =>
  ({ images, ...prod }: ProductWithHighlightsAndImages) => ({
    ...prod,
    images: images.map((image) => toImageUrl(url)(image.id)),
  });
