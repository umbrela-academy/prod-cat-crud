import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import { UploadedObjectInfo } from 'minio';
import { MinioService } from 'nestjs-minio-client';
import { Observable, catchError, throwError } from 'rxjs';
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
  async upload(buffer: Buffer, filename: string) {
    const baseBucket: string = this.baseBucket;
    await this.client.putObject(
      baseBucket,
      filename,
      buffer,
      function (err: Error | null, res: UploadedObjectInfo) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
      },
    );
    return filename;
  }
  async get(filename: string): Promise<Observable<Buffer>> {
    return new Observable<Buffer>((observer) => {
      const stream = this.client.getObject(
        this.baseBucket,
        filename,
        (err: Error | null, dataStream: Readable) => {
          if (err) {
            observer.error(
              new HttpException(
                'Error Retrieving file',
                HttpStatus.BAD_REQUEST,
              ),
            );
          } else {
            dataStream.on('data', (chunk: Buffer) => {
              observer.next(chunk);
            });

            dataStream.on('end', () => {
              observer.complete();
            });

            dataStream.on('error', (error: Error) => {
              observer.error(error);
            });
          }
        },
      );
    }).pipe(catchError((error: Error) => throwError(error)));
  }
}
