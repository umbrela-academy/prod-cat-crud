import { UploadedFileModel } from './../../common/types/uploaded-file.model';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { ProductCommonsService } from './product-commons.service';

export const mockFile: UploadedFileModel = {
  fieldname: 'file',
  originalname: '34563.png',
  filename: '88186888b1a0063915290a786343939c',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: 'mock buffer',
  size: 3638506,
};

export const converted = {
  originalname: '34563.png',
  filename: '88186888b1a0063915290a786343939c',
  mimetype: 'image/png',
  destination: 'default',
};

describe('ProductCommonsService', () => {
  let prismaService: PrismaService;
  let commonsService: ProductCommonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCommonsService, PrismaService, ConfigService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    commonsService = module.get<ProductCommonsService>(ProductCommonsService);
  });

  it('should be defined', () => {
    expect(commonsService).toBeDefined();
  });

  describe('exists', () => {
    it('should return true when product found', () => {
      prismaService.product.findUnique = jest
        .fn()
        .mockReturnValueOnce({ id: 1 });
      expect(commonsService.exists(1, true)).resolves.toStrictEqual(true);
    });

    it('should return true when category found', () => {
      prismaService.category.findUnique = jest
        .fn()
        .mockReturnValueOnce({ id: 1 });
      expect(commonsService.exists(1, false)).resolves.toStrictEqual(true);
    });

    it('should return false when product not found', () => {
      prismaService.product.findUnique = jest.fn().mockReturnValueOnce(null);
      expect(commonsService.exists(1)).resolves.toStrictEqual(false);
    });

    it('should return false when category not found', () => {
      prismaService.category.findUnique = jest.fn().mockReturnValueOnce(null);
      expect(commonsService.exists(1, false)).resolves.toStrictEqual(false);
    });
  });

  describe('getImagesPayload', () => {
    it('should convert files to createMany request payload', async () => {
      expect(
        commonsService.getImagesPayload([mockFile, mockFile]),
      ).toStrictEqual({
        createMany: {
          data: [converted, converted],
        },
      });
    });
  });
});
