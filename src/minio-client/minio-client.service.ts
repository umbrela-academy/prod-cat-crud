import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import { Observable } from 'rxjs';
import { Readable } from 'stream';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket: string = this.configService.get<string>(
    'minioClient.bucketName',
  )!;

  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger('MinioStorageService');
  }
  async upload(buffer: Buffer, filename: string, mimetype?: string) {
    const baseBucket: string = this.baseBucket;
    const metaData = {
      'Content-Type': mimetype ?? 'binary/octet-stream',
    };
    try {
      await this.client.putObject(baseBucket, filename, buffer, metaData);
      return filename;
    } catch (err) {
      this.logger.error(`Error uploading file: ${err.message}`);
      throw new HttpException(
        'Failed to upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  get(filename: string): Observable<Buffer> {
    return new Observable<Buffer>((observer) => {
      this.client.getObject(
        this.baseBucket,
        filename,
        (err: Error | null, dataStream: Readable) => {
          if (err) {
            return observer.error(
              new NotFoundException('Error Retrieving file'),
            );
          }
          dataStream.on('data', (chunk: Buffer) => {
            observer.next(chunk);
          });
          dataStream.on('end', () => {
            observer.complete();
          });
          dataStream.on('error', (error: Error) => {
            observer.error(error);
          });
        },
      );
    });
  }
}
