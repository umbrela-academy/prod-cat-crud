import {
  Category,
  CategoryImage,
  Highlight,
  Product,
  ProductImage,
} from '@prisma/client';

export type ProductNameAndDesc = Pick<Product, 'name' | 'description'>;

export type ProductWithImages = ProductNameAndDesc & {
  images: Pick<ProductImage, 'id'>[];
  highlights?: Omit<Highlight, 'productId'>[];
};

export const toImageUrl = (url?: string) => (id: number) =>
  url ? `${url}products/${id}` : `/products/${id}`;

export const toProdNameAndImages =
  (url?: string) =>
  ({ images, ...prod }: ProductWithImages) => ({
    ...prod,
    images: images.map((image) => toImageUrl(url)(image.id)),
  });

export type CategoryWithImage = Category & {
  categoryImage: CategoryImage;
};

export const toCategoryImageUrl = (url?: string) => (id: number) => ({
  image: url
    ? `${url}categories/${id}`
    : `http://localhost:3333/api/images/categories/${id}`,
});

export const toGetCategoryDto =
  (url?: string) =>
  ({ categoryImage, ...cat }: CategoryWithImage) => ({
    ...cat,
    ...toCategoryImageUrl(url)(categoryImage.id),
  });

export type ProductSearchDto = ProductNameAndDesc & {
  images: string[];
};

export type CategorySearchDto = Pick<Category, 'name'> & {
  images: string[];
};
