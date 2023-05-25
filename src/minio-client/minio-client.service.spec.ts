import { Test, TestingModule } from '@nestjs/testing';
import { MinioClientService } from './minio-client.service';
import { MinioService } from 'nestjs-minio-client';
import { ConfigModule } from '@nestjs/config';
import { mockFile } from '../products/mocks/product-req-res.mock';
import { InternalServerErrorException } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs';

describe('MinioClientService', () => {
  let service: MinioClientService;
  let minioService: MinioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        MinioClientService,
        {
          provide: MinioService,
          useValue: {
            client: { putObject: jest.fn(), getObject: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<MinioClientService>(MinioClientService);
    minioService = module.get<MinioService>(MinioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should upload file and return filename', () => {
      const minioClientMock = jest
        .spyOn(minioService.client, 'putObject')
        .mockResolvedValue({ etag: 'etag', versionId: 'version1' });
      expect(
        service.upload(mockFile.buffer, 'filename'),
      ).resolves.toStrictEqual('filename');
      expect(minioClientMock).toBeCalledTimes(1);
    });

    it('should throw InternalServerError when file cannot be uploaded', () => {
      const minioClientPutMock = jest
        .spyOn(minioService.client, 'putObject')
        .mockRejectedValue(new Error('Put Object Error'));
      expect(service.upload(mockFile.buffer, 'filename')).rejects.toThrow(
        new InternalServerErrorException('Failed to upload file'),
      );
      expect(minioClientPutMock).toBeCalledTimes(1);
      minioClientPutMock.mockRestore();
    });
  });
  describe('get', () => {
    const filepath = join('test', '34563.png');
    it('should return observable', async () => {
      const mockClient = jest
        .spyOn(minioService.client, 'getObject')
        .mockResolvedValue(createReadStream(filepath));
      const res = service.get('filename');
      expect(res).toBeInstanceOf(Observable);
    });
  });
});
