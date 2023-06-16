import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../common/services/prisma.service';
import {
  toGetCategoryDto,
  toProdNameAndImages,
  toImageUrl,
} from '../common/utils/product-common.utils';

@Injectable()
export class SearchService {
  readonly IMG_STORE_URL = this.configService.get<string>(
    'imageStore.storeUrl',
  );
  readonly defaultDestination =
    this.configService.get<string>('imageStore.destination') ?? 'default';

  toProductDto = toProdNameAndImages(this.IMG_STORE_URL);
  toCategoryDto = toGetCategoryDto(this.IMG_STORE_URL);

  toUrl = toImageUrl(this.IMG_STORE_URL);

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}
  async search(query: string) {
    const products = this.prismaService.product.findMany({
      where: { name: { search: query }, description: { search: query } },
      select: {
        name: true,
        description: true,
        images: {
          select: {
            id: true,
          },
        },
      },
    });

    const categories = this.prismaService.category.findMany({
      where: { name: { search: query } },
      select: { name: true, categoryImage: true },
    });

    const res = await Promise.all([products, categories]);
    return {
      products: res[0].map(this.toProductDto),
      categories: res[1].map(this.toCategoryDto),
    };
  }
}
