import {
  addedImages,
  mockFiles,
  updatedHighlightsResponse,
  updateHighlightsRequest,
} from './../mocks/product-req-res.mock';
import { highlight } from './../../common/types/z.schema';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { ProductCommonsService } from './product-commons.service';
import { ProductRelationsService } from './product-relations.service';

describe('ProductRelationsService', () => {
  let service: ProductRelationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRelationsService,
        ProductCommonsService,
        PrismaService,
        ConfigService,
      ],
    }).compile();

    service = module.get<ProductRelationsService>(ProductRelationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateHighlights', () => {
    beforeEach(() => {
      prismaService.product.findUnique = jest.fn().mockReturnValueOnce({
        id: 1,
        highlights: [
          {
            id: 2,
          },
          {
            id: 4,
          },
          {
            id: 5,
          },
        ],
      });
    });
    it('should throw NotFoundException when product is not found', async () => {
      const request = updateHighlightsRequest;
      await expect(service.updateHighlights(1, request)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should update highlights in edit field and remove highlights in remove field', async () => {
      service.throw404IfNonExistent = jest.fn().mockReturnValueOnce(null);
      const request = {
        edit: [
          {
            id: 2,
            description: 'highlight update 2',
          },
          {
            id: 4,
            description: 'highlight update 4',
          },
        ],
        remove: [5],
      };

      prismaService.highlight.update = jest
        .fn()
        .mockReturnValueOnce({ id: 2 })
        .mockReturnValueOnce({ id: 4 });
      prismaService.$transaction = jest
        .fn()
        .mockReturnValueOnce([{ id: 2 }, { id: 4 }]);
      prismaService.highlight.deleteMany = jest
        .fn()
        .mockReturnValueOnce({ count: 1 });
      prismaService.highlight.findMany = jest
        .fn()
        .mockReturnValueOnce(request.edit);

      const updateSpy = jest.spyOn(prismaService.highlight, 'update');
      const txnSpy = jest.spyOn(prismaService, '$transaction');
      const deleteManySpy = jest.spyOn(prismaService.highlight, 'deleteMany');
      const findManySpy = jest.spyOn(prismaService.highlight, 'findMany');

      expect(await service.updateHighlights(1, request)).toStrictEqual(
        request.edit,
      );

      expect(updateSpy).toBeCalledTimes(2);
      expect(txnSpy).toBeCalledTimes(1);
      expect(deleteManySpy).toBeCalledTimes(1);
      expect(findManySpy).toBeCalledTimes(1);
    });

    it('should update highlights in edit field and not create delete requests', async () => {
      service.throw404IfNonExistent = jest.fn().mockReturnValueOnce(null);
      const request = {
        edit: [
          {
            id: 2,
            description: 'highlight update 2',
          },
          {
            id: 4,
            description: 'highlight update 4',
          },
        ],
        remove: [],
      };

      prismaService.highlight.update = jest
        .fn()
        .mockReturnValueOnce({ id: 2 })
        .mockReturnValueOnce({ id: 4 });
      prismaService.$transaction = jest
        .fn()
        .mockReturnValueOnce([{ id: 2 }, { id: 4 }]);
      prismaService.highlight.findMany = jest
        .fn()
        .mockReturnValueOnce(request.edit);

      const updateSpy = jest.spyOn(prismaService.highlight, 'update');
      const txnSpy = jest.spyOn(prismaService, '$transaction');
      const deleteManySpy = jest.spyOn(prismaService.highlight, 'deleteMany');
      const findManySpy = jest.spyOn(prismaService.highlight, 'findMany');

      expect(await service.updateHighlights(1, request)).toStrictEqual(
        request.edit,
      );

      expect(updateSpy).toBeCalledTimes(2);
      expect(txnSpy).toBeCalledTimes(1);
      expect(deleteManySpy).toBeCalledTimes(0);
      expect(findManySpy).toBeCalledTimes(1);
    });

    it('should remove highlights in remove field and not trigger any update transactions', async () => {
      service.throw404IfNonExistent = jest.fn().mockReturnValueOnce(null);
      const request = {
        edit: [],
        remove: [5],
      };

      prismaService.highlight.deleteMany = jest
        .fn()
        .mockReturnValueOnce({ count: 1 });
      prismaService.highlight.findMany = jest
        .fn()
        .mockReturnValueOnce(request.edit);

      const updateSpy = jest.spyOn(prismaService.highlight, 'update');
      const txnSpy = jest.spyOn(prismaService, '$transaction');
      const deleteManySpy = jest.spyOn(prismaService.highlight, 'deleteMany');
      const findManySpy = jest.spyOn(prismaService.highlight, 'findMany');

      expect(await service.updateHighlights(1, request)).toStrictEqual(
        request.edit,
      );

      expect(updateSpy).toBeCalledTimes(0);
      expect(txnSpy).toBeCalledTimes(0);
      expect(deleteManySpy).toBeCalledTimes(1);
      expect(findManySpy).toBeCalledTimes(1);
    });
  });

  describe('removeImage', () => {
    beforeEach(() => {
      prismaService.product.update = jest.fn().mockReturnValueOnce({ id: 1 });
    });

    it('should return deleted image url when both product and image in the product are found', () => {
      prismaService.product.findUnique = jest
        .fn()
        .mockReturnValueOnce({ id: 1, images: [{ id: 1 }] });
      expect(service.removeImage(1, 1)).resolves.toStrictEqual('/products/1');
    });

    it('should throw NotFoundException when image is not found', async () => {
      prismaService.product.findUnique = jest
        .fn()
        .mockReturnValueOnce({ id: 1, images: [] });
      await expect(service.removeImage(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      prismaService.product.findUnique = jest.fn().mockReturnValueOnce(null);
      await expect(service.removeImage(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeHighlight', () => {
    beforeEach(() => {
      prismaService.product.update = jest.fn().mockReturnValueOnce({ id: 1 });
    });
    it('should return deleted image url when both product and image in the product are found', () => {
      const description = 'highlight description';
      prismaService.product.findUnique = jest
        .fn()
        .mockReturnValueOnce({ id: 1, highlights: [{ id: 1, description }] });
      prismaService.product.update = jest.fn().mockReturnValueOnce({ id: 1 });
      expect(service.removeHighlight(1, 1)).resolves.toStrictEqual(description);
    });

    it('should throw NotFoundException when highlight is not found', async () => {
      prismaService.product.findUnique = jest
        .fn()
        .mockReturnValueOnce({ id: 1, highlights: [] });
      await expect(service.removeHighlight(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when product is not found', async () => {
      prismaService.product.findUnique = jest.fn().mockReturnValueOnce(null);
      await expect(service.removeHighlight(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addImages', () => {
    const prismaUpdateResponse = { id: 1, images: [{ id: 1 }, { id: 2 }] };
    const serviceUpdateResponse = [
      {
        id: 1,
        url: '/products/1',
      },
      {
        id: 2,
        url: '/products/2',
      },
    ];
    beforeEach(async () => {
      prismaService.product.update = jest
        .fn()
        .mockReturnValueOnce(prismaUpdateResponse);
    });
    it('should add images and return image urls with their ids', async () => {
      service.throw404IfNonExistent = jest.fn().mockReturnValueOnce(null);
      expect(await service.addImages(1, mockFiles)).toStrictEqual(
        serviceUpdateResponse,
      );
    });

    it('should throw NotFoundException when product is not found', async () => {
      service.throw404IfNonExistent = jest.fn().mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      await expect(service.addImages(1, mockFiles)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addHighlights', () => {
    const newHighlights = [
      { description: 'highlight 1' },
      { description: 'highlight 2' },
    ];

    const prismaUpdateResponse = [
      {
        id: 1,
        description: 'highlight 1',
      },
      {
        id: 2,
        description: 'highlight 2',
      },
    ];

    beforeEach(() => {
      prismaService.highlight.createMany = jest
        .fn()
        .mockReturnValueOnce({ count: 2 });
      prismaService.highlight.findMany = jest
        .fn()
        .mockReturnValueOnce(prismaUpdateResponse);
    });

    it('should add highlights and return highlights with their ids', async () => {
      service.throw404IfNonExistent = jest.fn().mockReturnValueOnce(null);

      // expect(await service.addImages(1, mockFiles)).
      expect(await service.addHighlights(1, newHighlights)).toStrictEqual(
        prismaUpdateResponse,
      );
    });

    it('should throw NotFoundException when product is not found', async () => {
      service.throw404IfNonExistent = jest.fn().mockReturnValueOnce(() => {
        throw new NotFoundException();
      });

      await expect(service.addHighlights(1, newHighlights)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
