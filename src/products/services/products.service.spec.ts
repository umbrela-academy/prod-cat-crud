import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mockFiles, prodCreateRequest } from '../mocks/product-req-res.mock';
import {
  prismaCreateResponse,
  prismaFindMultiResponse,
  prodServiceCreatedResponse,
} from '../mocks/product-service-response.mock';
import { PrismaService } from './../../common/services/prisma.service';
import { UpdateProductDto } from './../dto/update-product.dto';
import {
  prismaLayerProdDeleteResponse,
  prismaLayerProdUpdateResponse,
  prodServiceFindMultiResponse,
  serviceLayerProdDeleteResponse,
  serviceLayerProdUpdateResponse,
} from './../mocks/product-service-response.mock';
import { ProductCommonsService } from './product-commons.service';
import { ProductsService } from './products.service';
import { Category } from '@prisma/client';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;
  let commonsService: ProductCommonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        ProductCommonsService,
        PrismaService,
        ConfigService,
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
    commonsService = module.get<ProductCommonsService>(ProductCommonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const request = prodCreateRequest;
    const result = prodServiceCreatedResponse;

    beforeEach(async () => {
      prismaService.product.create = jest
        .fn()
        .mockReturnValueOnce(prismaCreateResponse);
    });

    it('should return id and highlights and image urls', async () => {
      const serviceFindUniqueSpy = jest
        .spyOn(prismaService.category, 'findUnique')
        .mockResolvedValueOnce({ id: 1 } as Category);
      expect(await service.create(request, mockFiles)).toStrictEqual(result);
      expect(serviceFindUniqueSpy).toHaveBeenCalledTimes(1);
    });

    it('should delegate to prisma layer once', async () => {
      const serviceFindUniqueSpy = jest
        .spyOn(prismaService.category, 'findUnique')
        .mockResolvedValueOnce({ id: 1 } as Category);

      const serviceCreateSpy = jest.spyOn(prismaService.product, 'create');
      await service.create(request, mockFiles);
      expect(serviceCreateSpy).toBeCalledTimes(1);
      expect(serviceFindUniqueSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      prismaService.product.findMany = jest
        .fn()
        .mockReturnValueOnce(prismaFindMultiResponse);
    });

    it('should return an array with ids, attributes, highlights and image urls', () => {
      expect(service.findAll()).resolves.toStrictEqual(
        prodServiceFindMultiResponse,
      );
    });

    it('should delegate to prisma layer once', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.product, 'findMany');
      await service.findAll();
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findPaged', () => {
    beforeEach(async () => {
      prismaService.product.findMany = jest
        .fn()
        .mockReturnValueOnce(prismaFindMultiResponse);
    });

    it('should return an array with ids, attributes, highlights and image urls', () => {
      expect(service.findPaged(1, 2)).resolves.toStrictEqual(
        prodServiceFindMultiResponse,
      );
    });

    it('should delegate to prisma layer once', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.product, 'findMany');
      await service.findPaged(1, 2);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      prismaService.product.findUnique = jest
        .fn()
        .mockReturnValueOnce(prismaFindMultiResponse[0]);
    });

    it('should return an array with ids, attributes, highlights and image urls', () => {
      expect(service.findOne(1)).resolves.toStrictEqual(
        prodServiceFindMultiResponse[0],
      );
    });

    it('should delegate to prisma layer once', async () => {
      const serviceCreateSpy = jest.spyOn(prismaService.product, 'findUnique');
      await service.findOne(1);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      prismaService.product.delete = jest
        .fn()
        .mockReturnValueOnce(prismaLayerProdDeleteResponse);
    });

    it('should return deleted id, parentId, name, status and image url', () => {
      service.throwIfNotFound = jest.fn().mockReturnValueOnce(null);
      expect(service.remove(1)).resolves.toStrictEqual(
        serviceLayerProdDeleteResponse,
      );
    });

    it('should delegate to prisma layer once', async () => {
      service.throwIfNotFound = jest.fn().mockReturnValueOnce(null);
      const serviceCreateSpy = jest.spyOn(prismaService.product, 'delete');
      await service.remove(1);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException and not delegate to service layer if product id not found', async () => {
      jest.spyOn(service, 'throwIfNotFound').mockImplementation(() => {
        throw new NotFoundException();
      });
      const serviceDeleteSpy = jest.spyOn(prismaService.category, 'delete');
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(serviceDeleteSpy).toBeCalledTimes(0);
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      prismaService.product.update = jest
        .fn()
        .mockReturnValueOnce(prismaLayerProdUpdateResponse);
      prismaService.category.findUnique = jest
        .fn()
        .mockReturnValueOnce({ id: 1 });
      prismaService.product.findUnique = jest
        .fn()
        .mockReturnValueOnce({ id: 1 });
    });

    const request: UpdateProductDto = {
      name: 'product name',
      status: 'PENDING',
    };

    it('should return updated id, parentId, name, status and image url', () => {
      service.throwIfNotFound = jest.fn().mockReturnValueOnce(null);
      expect(service.updateScalars(1, request)).resolves.toStrictEqual(
        serviceLayerProdUpdateResponse,
      );
    });

    it('should delegate to prisma layer once', async () => {
      service.throwIfNotFound = jest.fn().mockReturnValueOnce(null);
      const serviceCreateSpy = jest.spyOn(prismaService.product, 'update');
      await service.updateScalars(1, request);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException and not delegate to service layer if product id not found', async () => {
      commonsService.exists = jest.fn().mockReturnValueOnce(false);
      const serviceCreateSpy = jest.spyOn(prismaService.product, 'update');
      await expect(service.updateScalars(1, request)).rejects.toThrow(
        NotFoundException,
      );
      expect(serviceCreateSpy).toBeCalledTimes(0);
    });
  });
});
