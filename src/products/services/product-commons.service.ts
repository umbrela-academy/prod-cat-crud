import { UploadedFileModel } from './../../common/types/uploaded-file.model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/services/prisma.service';
import { toGetProductDto, toImageUrl } from '../product.utils';
import { ImagesService } from 'src/images/images.service';
import * as crypto from 'crypto';

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
    private imageService: ImagesService,
  ) {}

  async getImagesPayload(imageFileDtos: UploadedFileModel[]) {
    const data = await Promise.all(
      imageFileDtos.map(async (imageFileDto) => {
        const filename = await this.saveImage(
          imageFileDto.buffer,
          imageFileDto.mimetype,
        );
        return {
          destination: this.defaultDestination,
          originalname: imageFileDto.originalname,
          filename,
          mimetype: imageFileDto.mimetype,
        };
      }),
    );

    return { createMany: { data } };
  }
  async exists(id: number, isProduct = true): Promise<boolean> {
    const whereQuery = {
      where: {
        id,
      },
      select: {
        id: true,
      },
    };
    const found = isProduct
      ? await this.prismaService.product.findUnique(whereQuery)
      : await this.prismaService.category.findUnique(whereQuery);
    return found !== null;
  }

  async saveImage(buffer: Buffer, mimetype: string): Promise<string> {
    const ext: string = mimetype.split('/')[1];
    const filename: string = crypto.randomUUID() + '.' + ext;
    return await this.imageService.upload(buffer, filename);
  }
}
