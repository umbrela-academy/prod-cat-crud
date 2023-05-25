import { UploadedFileModel } from './../../common/types/uploaded-file.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/services/prisma.service';
import { ProductCommonsService } from './product-commons.service';
import { ImagesModule } from '../../images/images.module';
import config from '../../common/config/config';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

export const mockFile: UploadedFileModel = {
  fieldname: 'file',
  originalname: '34563.png',
  filename: '88186888b1a0063915290a786343939c.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: 'mock buffer',
  size: 3638506,
};

export const converted = {
  originalname: '34563.png',
  filename: '88186888b1a0063915290a786343939c.png',
  mimetype: 'image/png',
  destination: 'default',
};

describe('ProductCommonsService', () => {
  let prismaService: PrismaService;
  let commonsService: ProductCommonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ImagesModule, ConfigModule.forRoot({ load: [config] })],
      providers: [ProductCommonsService, PrismaService, ConfigService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

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
      jest
        .spyOn(commonsService, 'saveImage')
        .mockResolvedValue('88186888b1a0063915290a786343939c.png');
      expect(
        await commonsService.getImagesPayload([mockFile, mockFile]),
      ).toStrictEqual({
        createMany: {
          data: [converted, converted],
        },
      });
    });
  });
});
