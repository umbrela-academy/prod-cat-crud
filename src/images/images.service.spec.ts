import { createMock } from '@golevelup/ts-jest';
import { NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { PrismaService } from './../common/services/prisma.service';
import { ImagesService } from './images.service';
import { MinioClientModule } from '../minio-client/minio-client.module';
import config from '../common/config/config';
import { MinioService } from 'nestjs-minio-client';
import { join } from 'path';
import { createReadStream } from 'fs';
import { MinioClientService } from '../minio-client/minio-client.service';
describe('ImagesService', () => {
  let service: ImagesService;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let minioService: MinioService;
  let minioClientModule: MinioClientModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MinioClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
        }),
      ],
      providers: [
        ImagesService,
        PrismaService,
        {
          provide: MinioService,
          useValue: {
            client: { putObject: jest.fn(), getObject: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
    minioClientModule = module.get<MinioClientService>(MinioClientService);
    minioService = module.get<MinioService>(MinioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockResponseObject = () => {
    return createMock<Response>({
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    });
  };

  const mockImage = {
    id: 1,
    destination: 'default',
    originalname: '34563.png',
    filename: '0ebe5a400dc5f2c91d28a10b1ed18295',
    mimetype: 'image/png',
    category: 1,
  };

  describe('findOneForCategory', () => {
    const response = mockResponseObject();

    it('should return image file', async () => {
      const filepath = join('test', 'test.png');
      const res = new StreamableFile(createReadStream(filepath));
      service.findOne = jest.fn().mockResolvedValue(res);
      prismaService.categoryImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockImage);

      await expect(
        service.findOneForCategory(1, response),
      ).resolves.toBeInstanceOf(StreamableFile);
    });

    it('should delegate to prisma layer once', async () => {
      prismaService.categoryImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockImage);
      const filepath = join('test', 'test.png');
      const res = new StreamableFile(createReadStream(filepath));
      service.findOne = jest.fn().mockResolvedValue(res);
      const serviceSpy = jest.spyOn(prismaService.categoryImage, 'findUnique');
      await service.findOneForCategory(1, response);
      expect(serviceSpy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException when image not found', async () => {
      prismaService.categoryImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(null);
      const serviceSpy = jest.spyOn(prismaService.categoryImage, 'findUnique');
      await expect(service.findOneForCategory(1, response)).rejects.toThrow(
        NotFoundException,
      );
      expect(serviceSpy).toBeCalledTimes(1);
    });
  });

  describe('findOneForProduct', () => {
    const response = mockResponseObject();

    it('should return image file', () => {
      prismaService.productImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockImage);
      const filepath = join('test', 'test.png');
      const res = new StreamableFile(createReadStream(filepath));
      service.findOne = jest.fn().mockResolvedValue(res);

      expect(service.findOneForProduct(1, response)).resolves.toBeInstanceOf(
        StreamableFile,
      );
    });

    it('should delegate to prisma layer once', async () => {
      prismaService.productImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockImage);
      const filepath = join('test', 'test.png');
      const res = new StreamableFile(createReadStream(filepath));
      service.findOne = jest.fn().mockResolvedValue(res);

      const serviceSpy = jest.spyOn(prismaService.productImage, 'findUnique');
      await service.findOneForProduct(1, response);
      expect(serviceSpy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException when image not found', async () => {
      prismaService.productImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(null);
      const serviceSpy = jest.spyOn(prismaService.productImage, 'findUnique');
      await expect(service.findOneForProduct(1, response)).rejects.toThrow(
        NotFoundException,
      );
      expect(serviceSpy).toBeCalledTimes(1);
    });
  });
});
