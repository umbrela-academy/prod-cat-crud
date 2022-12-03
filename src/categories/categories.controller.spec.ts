import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/services/prisma.service';

/**
 * Unit Tests for the Controller layer only.
 * Checks that the request and response contracts continue to be adhered to
 * and that the controller delegates to the service layer properly.
 */

const mockFile = {
  fieldname: 'file',
  originalname: '34563.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: Buffer.from(__dirname + '../../test/34563.png'),
  size: 3638506,
} as Express.Multer.File;

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const request: CreateCategoryDto = {
      name: 'category name',
      status: 'PENDING',
      image: mockFile,
    };

    const result = {
      id: 1,
      image: 'http://localhost:3333/api/images/categories/1',
    };

    it('should return id and image url', () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.create(request, mockFile)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(result);
      await controller.create(request, mockFile);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const result: GetCategoryDto[] = [
      {
        id: 3,
        parentId: null,
        name: 'first cat',
        status: 'PENDING',
        image: 'http://localhost:3333/api/images/categories/3',
      },
      {
        id: 4,
        parentId: 3,
        name: 'another cat',
        status: 'PENDING',
        image: 'http://localhost:3333/api/images/categories/4',
      },
      {
        id: 5,
        parentId: 3,
        name: 'third category',
        status: 'ACTIVE',
        image: 'http://localhost:3333/api/images/categories/5',
      },
    ];
    it('should return an array with id, parentId, name, status and image url', () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.findAll()).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(result);
      await controller.findAll();
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findPaged', () => {
    const result: GetCategoryDto[] = [
      {
        id: 3,
        parentId: null,
        name: 'first cat',
        status: 'PENDING',
        image: 'http://localhost:3333/api/images/categories/3',
      },
      {
        id: 4,
        parentId: 3,
        name: 'another cat',
        status: 'PENDING',
        image: 'http://localhost:3333/api/images/categories/4',
      },
    ];
    it('should return an array with id, parentId, name, status and image url', () => {
      jest
        .spyOn(service, 'findPaged')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.findPaged(1, 2)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(service, 'findPaged')
        .mockResolvedValue(result);
      await controller.findPaged(1, 2);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const result: GetCategoryDto = {
      id: 3,
      parentId: null,
      name: 'first cat',
      status: 'PENDING',
      image: 'http://localhost:3333/api/images/categories/3',
    };
    it('should return id, parentId, name, status and image url', () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.findOne(3)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(result);
      await controller.findOne(3);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('remove', () => {
    const result: GetCategoryDto = {
      id: 3,
      parentId: null,
      name: 'first cat',
      status: 'PENDING',
      image: 'http://localhost:3333/api/images/categories/3',
    };
    it('should return deleted id, parentId, name, status and image url', () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.remove(3)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValue(result);
      await controller.remove(3);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    const request: UpdateCategoryDto = {
      name: 'category name',
      status: 'PENDING',
    };

    const result: GetCategoryDto = {
      id: 4,
      parentId: 4,
      name: 'another cat',
      status: 'DELETE',
      image: 'http://localhost:3333/api/images/categories/16',
    };
    it('should return id and (updated) parentId, name, status and image url', () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.update(3, request)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValue(result);
      await controller.update(3, request);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });
});
