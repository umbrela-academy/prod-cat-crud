import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient, Product } from '@prisma/client';
import {
  prismaCategoryFindManyRes,
  prismaProductFindManyRes,
  serviceLayerSearchRes,
} from './mocks/search-service-response.mock';

describe('SearchService', () => {
  let service: SearchService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, PrismaService, ConfigService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<SearchService>(SearchService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    const result = serviceLayerSearchRes;
    it('should return object with array of products and array of categories', async () => {
      const productFindManySpy = jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValueOnce(prismaProductFindManyRes);

      const categoryFindManySpy = jest
        .spyOn(prismaService.category, 'findMany')
        .mockResolvedValueOnce(prismaCategoryFindManyRes);

      expect(await service.search('prodcat')).toStrictEqual(result);
      expect(productFindManySpy).toBeCalledTimes(1);
      expect(categoryFindManySpy).toBeCalledTimes(1);
    });
  });

  it('should return empty array if no match found', async () => {
    const res = {
      products: [],
      categories: [],
    };
    const productFindManySpy = jest
      .spyOn(prismaService.product, 'findMany')
      .mockResolvedValueOnce([]);
    const categoryFindManySpy = jest
      .spyOn(prismaService.category, 'findMany')
      .mockResolvedValueOnce([]);

    expect(await service.search('')).toStrictEqual(res);
    expect(productFindManySpy).toBeCalledTimes(1);
    expect(categoryFindManySpy).toBeCalledTimes(1);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });
});
