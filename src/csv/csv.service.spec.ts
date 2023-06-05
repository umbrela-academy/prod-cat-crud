import { Test, TestingModule } from '@nestjs/testing';
import { CsvCommonService } from './csv-commons.service';
import { CsvService } from './csv.service';
import {
  csvProdCreateRequest,
  csvProdCreatedResponse,
  csvProdUpdateRequest,
  csvProdUpdateResponse,
  findImagePrismaResponse,
  prismaCsvCreatedResponse,
  prismaCsvUpdateResponse,
} from './mocks/csv-service-response.mock';
import { PrismaService } from '../common/services/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Category, PrismaClient, Product, ProductImage } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { ImagesModule } from '../images/images.module';
import config from '../common/config/config';
import { ImagesService } from '../images/images.service';
import { mockDeep } from 'jest-mock-extended';

describe('CsvService', () => {
  let service: CsvService;
  let prismaService: PrismaService;
  let commonsService: CsvCommonService;
  let httpService: HttpService;
  let imageService: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [config] }), ImagesModule],
      providers: [
        CsvService,
        PrismaService,
        CsvCommonService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())

      .compile();

    service = module.get<CsvService>(CsvService);
    prismaService = module.get<PrismaService>(PrismaService);
    commonsService = module.get<CsvCommonService>(CsvCommonService);
    httpService = module.get<HttpService>(HttpService);
    imageService = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const result = csvProdCreatedResponse;
    const rowsInCsv = csvProdCreatedResponse.length;

    it('should return array of id, highlights, and image URLs', async () => {
      const categoryFindUniqueSpy = jest
        .spyOn(prismaService.category, 'findUnique')
        .mockResolvedValue({ id: 1 } as Category);

      const imageFindSpy = jest
        .spyOn(prismaService.productImage, 'findFirst')
        .mockResolvedValue(findImagePrismaResponse as ProductImage);

      const transactionSpy = jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValueOnce(prismaCsvCreatedResponse);

      expect(await service.create(csvProdCreateRequest)).toStrictEqual(result);
      expect(categoryFindUniqueSpy).toBeCalledTimes(rowsInCsv);
      expect(transactionSpy).toBeCalledTimes(1);
    });

    it('should throw categoryId is missing', async () => {
      const categoryFindUniqueSpy = jest
        .spyOn(prismaService.category, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.create(csvProdCreateRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    describe('update', () => {
      const result = csvProdUpdateResponse;
      const rowsInCsv = csvProdUpdateRequest.length;

      it('should return array of id, highlights and image urls', async () => {
        const productfindUniqueSpy = jest
          .spyOn(prismaService.product, 'findUnique')
          .mockResolvedValue({ id: 1 } as Product);

        const categoryFindUniqueSpy = jest
          .spyOn(prismaService.category, 'findUnique')
          .mockResolvedValue({ id: 1 } as Category);

        const transactionSpy = jest
          .spyOn(prismaService, '$transaction')
          .mockResolvedValue(prismaCsvUpdateResponse);

        expect(await service.update(csvProdUpdateRequest)).toStrictEqual(
          result,
        );
        expect(transactionSpy).toBeCalledTimes(1);
        expect(categoryFindUniqueSpy).toBeCalledTimes(rowsInCsv);
      });
    });
  });
});
