import { GetProductDto } from './dto/get-product.dto';
import { highlight } from './../common/types/z.schema';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './../common/services/prisma.service';
import {
  addedHighlightsResponse,
  addedImages,
  addHighlightsRequest,
  mockFiles,
  prodCreatedResponse,
  prodCreateRequest,
  prodFindMultiResponse,
  prodPatchRequest,
  prodPatchResponse,
  updatedHighlightsResponse,
  updateHighlightsRequest,
} from './mocks/product-req-res.mock';
import { ProductsController } from './products.controller';
import { ProductCommonsService } from './services/product-commons.service';
import { ProductRelationsService } from './services/product-relations.service';
import { ProductsService } from './services/products.service';

/**
 * Unit Tests for the Products Controller layer.
 * Checks that the request and response contracts continue to be adhered to
 * and that the controller delegates to the service layer properly.
 */

describe('ProductsController', () => {
  let controller: ProductsController;
  let entityService: ProductsService;
  let relationsService: ProductRelationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        ProductCommonsService,
        ProductRelationsService,
        PrismaService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    entityService = module.get<ProductsService>(ProductsService);
    relationsService = module.get<ProductRelationsService>(
      ProductRelationsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const request = prodCreateRequest;
    const result = prodCreatedResponse;

    it('should return id and highlights and image urls', () => {
      jest
        .spyOn(entityService, 'create')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.create(request, mockFiles)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(entityService, 'create')
        .mockResolvedValue(result);
      await controller.create(request, mockFiles);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const result = prodFindMultiResponse;
    it('should return an array with ids, attributes, highlights and image urls', () => {
      jest
        .spyOn(entityService, 'findAll')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.findAll()).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(entityService, 'findAll')
        .mockResolvedValue(result);
      await controller.findAll();
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findPaged', () => {
    const result = prodFindMultiResponse;

    it('should return an array with ids, attributes, highlights and image urls', () => {
      jest
        .spyOn(entityService, 'findPaged')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.findPaged(1, 2)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(entityService, 'findPaged')
        .mockResolvedValue(result);
      await controller.findPaged(1, 2);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const result = prodFindMultiResponse[0];
    it('should return id, attributes, highlights and image urls', () => {
      jest
        .spyOn(entityService, 'findOne')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.findOne(3)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(entityService, 'findOne')
        .mockResolvedValue(result);
      await controller.findOne(3);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('remove', () => {
    const result = prodFindMultiResponse[0];
    it('should return deleted id, parentId, name, status and image url', () => {
      jest
        .spyOn(entityService, 'remove')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.remove(3)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceCreateSpy = jest
        .spyOn(entityService, 'remove')
        .mockResolvedValue(result);
      await controller.remove(3);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('removeHighlight', () => {
    const result = 'a highlight of this product';
    it('should return deleted highlight description', () => {
      jest
        .spyOn(relationsService, 'removeHighlight')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.removeHighlight(1, 2)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'removeHighlight')
        .mockResolvedValue(result);
      await controller.removeHighlight(2, 4);
      expect(serviceSpy).toBeCalledTimes(1);
    });

    it('should throw BadRequestException on invalid product id', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'removeHighlight')
        .mockResolvedValue(result);
      await expect(controller.removeHighlight(0, 4)).rejects.toThrow(
        BadRequestException,
      );
      expect(serviceSpy).toBeCalledTimes(0);
    });

    it('should throw BadRequestException on invalid highlight id', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'removeHighlight')
        .mockResolvedValue(result);
      await expect(controller.removeHighlight(1, -4)).rejects.toThrow(
        BadRequestException,
      );
      expect(serviceSpy).toBeCalledTimes(0);
    });
  });

  describe('removeImage', () => {
    const result = 'http://localhost:3333/api/images/products/3';
    it('should return deleted image url', () => {
      jest
        .spyOn(relationsService, 'removeImage')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.removeImage(1, 2)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'removeImage')
        .mockResolvedValue(result);
      await controller.removeImage(2, 4);
      expect(serviceSpy).toBeCalledTimes(1);
    });

    it('should throw BadRequestException on invalid product id', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'removeImage')
        .mockResolvedValue(result);
      await expect(controller.removeImage(0, 4)).rejects.toThrow(
        BadRequestException,
      );
      expect(serviceSpy).toBeCalledTimes(0);
    });

    it('should throw BadRequestException on invalid image id', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'removeImage')
        .mockResolvedValue(result);
      await expect(controller.removeImage(1, -4)).rejects.toThrow(
        BadRequestException,
      );
      expect(serviceSpy).toBeCalledTimes(0);
    });
  });

  describe('updateHighlights', () => {
    const result = updatedHighlightsResponse;
    const request = updateHighlightsRequest;
    it('should return deleted image url', () => {
      jest
        .spyOn(relationsService, 'updateHighlights')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.updateHighlights(1, request)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'updateHighlights')
        .mockResolvedValue(result);
      await controller.updateHighlights(2, request);
      expect(serviceSpy).toBeCalledTimes(1);
    });

    it('should throw BadRequestException on invalid product id', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'updateHighlights')
        .mockResolvedValue(result);
      await expect(controller.updateHighlights(0, request)).rejects.toThrow(
        BadRequestException,
      );
      expect(serviceSpy).toBeCalledTimes(0);
    });
  });

  describe('addHighlights', () => {
    const result = addedHighlightsResponse;
    const request = addHighlightsRequest;
    it('should return deleted image url', () => {
      jest
        .spyOn(relationsService, 'addHighlights')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.addHighlights(1, request)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'addHighlights')
        .mockResolvedValue(result);
      await controller.addHighlights(2, request);
      expect(serviceSpy).toBeCalledTimes(1);
    });

    it('should throw BadRequestException on invalid product id', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'addHighlights')
        .mockResolvedValue(result);
      await expect(controller.addHighlights(0, request)).rejects.toThrow(
        BadRequestException,
      );
      expect(serviceSpy).toBeCalledTimes(0);
    });
  });

  describe('addImages', () => {
    const result = addedImages;
    const request = { images: mockFiles };

    it('should return deleted image url', () => {
      jest
        .spyOn(relationsService, 'addImages')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.addImages(1, request, mockFiles)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'addImages')
        .mockResolvedValue(result);
      await controller.addImages(2, request, mockFiles);
      expect(serviceSpy).toBeCalledTimes(1);
    });

    it('should throw BadRequestException on invalid product id', async () => {
      const serviceSpy = jest
        .spyOn(relationsService, 'addImages')
        .mockResolvedValue(result);
      await expect(controller.addImages(0, request, mockFiles)).rejects.toThrow(
        BadRequestException,
      );
      expect(serviceSpy).toBeCalledTimes(0);
    });
  });

  describe('update', () => {
    const result = prodPatchResponse;
    const request = prodPatchRequest;

    it('should return deleted image url', () => {
      jest
        .spyOn(entityService, 'updateScalars')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.update(1, request)).resolves.toBe(result);
    });

    it('should delegate to service once', async () => {
      const serviceSpy = jest
        .spyOn(entityService, 'updateScalars')
        .mockResolvedValue(result);
      await controller.update(2, request);
      expect(serviceSpy).toBeCalledTimes(1);
    });

    it('should throw BadRequestException on invalid product id', async () => {
      const serviceSpy = jest
        .spyOn(entityService, 'updateScalars')
        .mockResolvedValue(result);
      await expect(controller.update(0, request)).rejects.toThrow(
        BadRequestException,
      );
      expect(serviceSpy).toBeCalledTimes(0);
    });
  });
});
