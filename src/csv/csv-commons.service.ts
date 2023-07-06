import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import * as sharp from 'sharp';
import { toImageUrl } from '../categories/category.utils';
import { DownloadedFileModel } from '../common/types/downloaded-file.model';
import { toGetProductDto } from '../products/product.utils';
import * as crypto from 'crypto';
import { ImagesService } from '../images/images.service';

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
    private readonly configService: ConfigService,
    private readonly imageService: ImagesService,
  ) {}

  async downloadImage(url: string): Promise<DownloadedFileModel> {
    try {
      const req = this.httpService.get(url, { responseType: 'arraybuffer' });
      const res = await lastValueFrom(req);

      if (res.status !== HttpStatus.OK) {
        throw new BadRequestException(`Error downloading image from ${url}`);
      }
      const buffer: Buffer = Buffer.from(res.data);
      const metadata: sharp.Metadata = await this.getImageMetadata(buffer);
      const filename = crypto.randomUUID() + '.' + metadata.format;
      await this.imageService.upload(buffer, filename, metadata.format);
      const originalname: string = res.headers['Content-Disposition']
        ? res.headers['Content-Disposition'].split(';')[1].trim().split('=')[1]
        : filename;

      return {
        destination: this.defaultDestination,
        filename,
        originalname,
        mimetype: `image/${metadata.format}`,
        url,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async getImageMetadata(imageBuffer: Buffer) {
    try {
      const metadata: sharp.Metadata = await sharp(imageBuffer).metadata();

      return metadata;
    } catch (error) {
      throw new BadRequestException(
        'Error processing image metadata. Response Data may not be an image',
      );
    }
  }
}
