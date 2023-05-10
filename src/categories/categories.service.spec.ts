import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './../common/services/prisma.service';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  deleteResponse,
  multiResponse,
  prismaLayerDeleteResponse,
  prismaLayerMultiResponse,
  prismaLayerResponse,
  prismaLayerUpdateResponse,
  updateResponse,
} from './mocks/categories-req-res.mock';

const mockFile = {
  fieldname: 'file',
  originalname: '34563.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: Buffer.from(__dirname + '../../test/34563.png'),
  size: 3638506,
} as Express.Multer.File;

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, PrismaService, ConfigService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const request: CreateCategoryDto = {
      name: 'category name',
      status: 'PENDING',
      image: mockFile,
    };

    const result = {
      id: 1,
      image: '/categories/1',
    };

    beforeEach(async () => {
      prismaService.category.create = jest
        .fn()
        .mockReturnValueOnce(prismaLayerResponse);
    });

    it('should return id and image url', async () => {
      expect(await service.create(request, mockFile)).toStrictEqual(result);
    });

    it('should delegate to prisma layer once', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.category, 'create');
      await service.create(request, mockFile);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      prismaService.category.findMany = jest
        .fn()
        .mockReturnValueOnce(prismaLayerMultiResponse);
    });

    it('should return an array with id, parentId, name, status and image url', () => {
      expect(service.findAll()).resolves.toStrictEqual(multiResponse);
    });

    it('should delegate to prisma layer once', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.category, 'findMany');
      await service.findAll();
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findPaged', () => {
    beforeEach(async () => {
      prismaService.category.findMany = jest
        .fn()
        .mockReturnValueOnce(prismaLayerMultiResponse);
    });

    it('should return an array with id, parentId, name, status and image url', () => {
      expect(service.findPaged(1, 2)).resolves.toStrictEqual(multiResponse);
    });

    it('should delegate to prisma layer once', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.category, 'findMany');
      await service.findPaged(1, 2);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      prismaService.category.findUnique = jest
        .fn()
        .mockReturnValueOnce(prismaLayerMultiResponse[0]);
    });

    it('should return id, parentId, name, status and image url', () => {
      expect(service.findOne(1)).resolves.toStrictEqual(multiResponse[0]);
    });

    it('should delegate to prisma layer once', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.category, 'findUnique');
      await service.findOne(1);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      prismaService.category.delete = jest
        .fn()
        .mockReturnValueOnce(prismaLayerDeleteResponse);
    });

    it('should return deleted id, parentId, name, status and image url', () => {
      service.throwIfNotFound = jest.fn().mockReturnValueOnce(null);
      expect(service.remove(1)).resolves.toStrictEqual(deleteResponse);
    });

    it('should delegate to prisma layer once', async () => {
      service.throwIfNotFound = jest.fn().mockReturnValueOnce(null);
      const serviceCreateSpy = jest.spyOn(prismaService.category, 'delete');
      await service.remove(1);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException and not delegate to service layer if category id not found', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.category, 'delete');
      await expect(service.remove(100)).rejects.toThrow(NotFoundException);
      expect(serviceCreateSpy).toBeCalledTimes(0);
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      prismaService.category.update = jest
        .fn()
        .mockReturnValueOnce(prismaLayerUpdateResponse);
    });

    const request: UpdateCategoryDto = {
      name: 'category name',
      status: 'PENDING',
    };

    it('should return updated id, parentId, name, status and image url', () => {
      service.throwIfNotFound = jest.fn().mockReturnValueOnce(null);
      expect(service.update(1, request)).resolves.toStrictEqual(updateResponse);
    });

    it('should delegate to prisma layer once', async () => {
      service.throwIfNotFound = jest.fn().mockReturnValueOnce(null);
      const serviceCreateSpy = jest.spyOn(prismaService.category, 'update');
      await service.update(1, request);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException and not delegate to service layer if category id not found', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.category, 'update');
      await expect(service.update(1000, request)).rejects.toThrow(
        NotFoundException,
      );
      expect(serviceCreateSpy).toBeCalledTimes(0);
    });
  });
});
