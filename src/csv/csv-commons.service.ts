import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import * as sharp from 'sharp';
import { toImageUrl } from '../categories/category.utils';
import { DownloadedFileModel } from 'src/common/types/downloaded-file.model';
import { toGetProductDto } from '../products/product.utils';

@Injectable()
export class CsvCommonService {
  readonly IMG_STORE_URL = this.configService.get<string>(
    'imageStore.storeUrl',
  );
  readonly defaultDestination =
    this.configService.get<string>('imageStore.destination') ?? 'default';

  toDto = toGetProductDto(this.IMG_STORE_URL);
  toUrl = toImageUrl(this.IMG_STORE_URL);
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async downloadImage(url: string): Promise<DownloadedFileModel> {
    try {
      const req = this.httpService.get(url, { responseType: 'arraybuffer' });
      const res = await lastValueFrom(req);

      if (res.status !== HttpStatus.OK) {
        throw new BadRequestException(`Error downloading image from ${url}`);
      }
      const buffer = Buffer.from(res.data);
      const metadata = await this.getImageMetadata(buffer);
      const filename = (await this.saveImage(buffer)).filename;
      const originalname: string = res.headers['Content-Disposition']
        ? res.headers['Content-Disposition']
        : filename;

      return {
        destination: this.defaultDestination,
        filename,
        originalname,
        mimetype: `image/${metadata.format}`,
        url,
      };
    } catch (error) {
      throw new BadRequestException(`Error downloading image from ${url}`);
    }
  }

  private async getImageMetadata(imageBuffer: Buffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      return metadata;
    } catch (error) {
      throw new BadRequestException(
        'Error processing image metadata. Response Data may not be an image',
      );
    }
  }
  private async saveImage(imageBuffer: Buffer) {
    try {
      const filename = `${Date.now()}`;
      const path = join(this.defaultDestination, filename);
      const writeStream = createWriteStream(path);

      await new Promise<void>((resolve, reject) => {
        writeStream.write(imageBuffer, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
        writeStream.end();
      });

      return {
        filename,
      };
    } catch (error) {
      throw new Error('Error saving the image');
    }
  }
}
