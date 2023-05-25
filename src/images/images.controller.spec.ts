import { createMock } from '@golevelup/ts-jest';
import { StreamableFile } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { PrismaService } from './../common/services/prisma.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MinioClientModule } from '../minio-client/minio-client.module';
import config from '../common/config/config';

describe('ImagesController', () => {
  let controller: ImagesController;
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MinioClientModule, ConfigModule.forRoot({ load: [config] })],
      controllers: [ImagesController],
      providers: [ImagesService, PrismaService],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const body = Buffer.from(join(__dirname + '../../../test/34563.png'));
  const mockStream = createReadStream(body);

  const mockResponseObject = () => {
    return createMock<Response>({
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    });
  };

  describe('findOneForProduct', () => {
    const response = mockResponseObject();
    const result = new StreamableFile(mockStream);
    it('should download image file', () => {
      jest
        .spyOn(service, 'findOneForProduct')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.findOneForProduct(3, response)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(service, 'findOneForProduct')
        .mockResolvedValue(result);
      await controller.findOneForProduct(3, response);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findOneForCategory', () => {
    const response = mockResponseObject();
    const result = new StreamableFile(mockStream);
    it('should download image file', () => {
      jest
        .spyOn(service, 'findOneForCategory')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.findOneForCategory(3, response)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(service, 'findOneForCategory')
        .mockResolvedValue(result);
      await controller.findOneForCategory(3, response);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });
});
