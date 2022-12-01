import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoryImage, ProductImage } from '@prisma/client';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { PrismaService } from '../common/services/prisma.service';
import { UploadedFileModel } from '../common/types/uploaded-file.model';

@Injectable()
export class ImagesService {
  readonly defaultDestination =
    this.configService.get<string>('imageStore.destination') ?? 'default';

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(imageFileDto: UploadedFileModel): Promise<number> {
    return this.prismaService.categoryImage
      .create({
        data: {
          destination: this.defaultDestination,
          originalname: imageFileDto.originalname,
          filename: imageFileDto.filename,
          mimetype: imageFileDto.mimetype,
        },
        select: {
          id: true,
        },
      })
      .then((res) => res.id);
  }

  async findOneForCategory(id: number, res: Response): Promise<StreamableFile> {
    const categoryImage = await this.prismaService.categoryImage.findUnique({
      where: { id },
    });

    return this.findOne(id, categoryImage, res);
  }

  async findOneForProduct(id: number, res: Response): Promise<StreamableFile> {
    const productImage = await this.prismaService.productImage.findUnique({
      where: { id },
    });

    return this.findOne(id, productImage, res);
  }

  private async findOne(
    id: number,
    image: CategoryImage | ProductImage | null,
    res: Response,
  ): Promise<StreamableFile> {
    if (image === null) {
      throw new NotFoundException(`No image found with the id: ${id} `);
    }

    const imageFile = createReadStream(join(image.destination, image.filename));

    res.set({
      'Content-Type': image.mimetype,
      'Content-Disposition': `attachment; filename="${image.originalname}"`,
    });

    return new StreamableFile(imageFile);
  }
}
