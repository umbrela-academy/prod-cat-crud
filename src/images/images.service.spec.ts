import { createMock } from '@golevelup/ts-jest';
import { NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { PrismaService } from './../common/services/prisma.service';
import { ImagesService } from './images.service';

describe('ImagesService', () => {
  let service: ImagesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService, PrismaService, ConfigService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    prismaService = module.get<PrismaService>(PrismaService);
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
    filename: 'd1b96c16a967c6fdc7f7d440c9310531',
    mimetype: 'image/png',
    category: 1,
  };

  describe('findOneForCategory', () => {
    const response = mockResponseObject();

    it('should return image file', () => {
      prismaService.categoryImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockImage);
      expect(service.findOneForCategory(1, response)).resolves.toBeInstanceOf(
        StreamableFile,
      );
    });

    it('should delegate to prisma layer once', async () => {
      prismaService.categoryImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockImage);
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
      expect(service.findOneForProduct(1, response)).resolves.toBeInstanceOf(
        StreamableFile,
      );
    });

    it('should delegate to prisma layer once', async () => {
      prismaService.productImage.findUnique = jest
        .fn()
        .mockReturnValueOnce(mockImage);
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
