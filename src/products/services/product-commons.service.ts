import { UploadedFileModel } from './../../common/types/uploaded-file.model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/services/prisma.service';
import { toGetProductDto, toImageUrl } from '../product.utils';

@Injectable()
export class ProductCommonsService {
  readonly IMG_STORE_URL = this.configService.get<string>(
    'imageStore.storeUrl',
  );

  readonly defaultDestination =
    this.configService.get<string>('imageStore.destination') ?? 'default';

  toDto = toGetProductDto(this.IMG_STORE_URL);
  toUrl = toImageUrl(this.IMG_STORE_URL);

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  getImagesPayload(imageFileDtos: UploadedFileModel[]) {
    const data = imageFileDtos.map((imageFileDto) => ({
      destination: this.defaultDestination,
      originalname: imageFileDto.originalname,
      filename: imageFileDto.filename,
      mimetype: imageFileDto.mimetype,
    }));
    return { createMany: { data } };
  }

  async exists(id: number, isProduct = true): Promise<boolean> {
    const whereQuery = {
      where: {
        id,
      },
    };
    const found = isProduct
      ? await this.prismaService.product.findUnique(whereQuery)
      : await this.prismaService.category.findUnique(whereQuery);
    return found !== null;
  }
}
