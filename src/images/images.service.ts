import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoryImage, ProductImage } from '@prisma/client';
import type { Response } from 'express';
import { PrismaService } from '../common/services/prisma.service';
import { MinioClientService } from '../minio-client/minio-client.service';
import { Observable } from 'rxjs';
import { Readable } from 'stream';

@Injectable()
export class ImagesService {
  readonly defaultDestination =
    this.configService.get<string>('imageStore.destination') ?? 'default';

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private readonly minioService: MinioClientService,
  ) {}

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

  async findOne(
    id: number,
    image: CategoryImage | ProductImage | null,
    res: Response,
  ): Promise<StreamableFile> {
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const filename = image.filename;

    try {
      const observableBuffer: Observable<Buffer> =
        this.minioService.get(filename);
      const bufferStream = new Readable({
        read() {},
      });

      await new Promise<void>((resolve, reject) => {
        observableBuffer.subscribe({
          next(chunk) {
            bufferStream.push(chunk);
          },
          error(err) {
            reject(err);
          },
          complete() {
            bufferStream.push(null);
            resolve();
          },
        });
      });

      res.set({
        'Content-Type': image.mimetype,
        'Content-Disposition': `attachment; filename="${image.originalname}"`,
      });

      return new StreamableFile(bufferStream);
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }
  async upload(buffer: Buffer, filename: string): Promise<string> {
    return await this.minioService.upload(buffer, filename);
  }
}
