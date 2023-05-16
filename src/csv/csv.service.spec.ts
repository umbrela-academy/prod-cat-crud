import { Test, TestingModule } from '@nestjs/testing';
import { CsvCommonService } from './csv-commons.service';
import { CsvService } from './csv.service';
import {
  csvProdCreatedResponse,
  csvProdUpdateRequest,
  csvProdUpdateResponse,
  invalidCsv,
  invalidProdUpdateRequest,
  prismaCsvCreatedResponse,
  prismaCsvUpdateResponse,
} from './mocks/csv-service-response.mock';
import { PrismaService } from '../common/services/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Category } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockCSV } from './mocks/csv-req-res.mock';

describe('CsvService', () => {
  let service: CsvService;
  let prismaService: PrismaService;
  let commonsService: CsvCommonService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
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
    }).compile();

    service = module.get<CsvService>(CsvService);
    prismaService = module.get<PrismaService>(PrismaService);
    commonsService = module.get<CsvCommonService>(CsvCommonService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const request = mockCSV;
    const fileBuffer = request.buffer.toString('base64');
    const result = csvProdCreatedResponse;
    const rowsInCsv = csvProdCreatedResponse.length;

    it('should return array of id, highlights, and image URLs', async () => {
      const categoryFindUniqueSpy = jest
        .spyOn(prismaService.category, 'findUnique')
        .mockResolvedValue({ id: 1 } as Category);

      const transactionSpy = jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValueOnce(prismaCsvCreatedResponse);
      expect(await service.create(fileBuffer)).toStrictEqual(result);
      expect(categoryFindUniqueSpy).toBeCalledTimes(rowsInCsv);
      expect(transactionSpy).toBeCalledTimes(1);
    });

    it('should throw categoryId is missing', async () => {
      const categoryFindUniqueSpy = jest
        .spyOn(prismaService.category, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.create(fileBuffer)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequiredException if required header is missing', async () => {
      jest.spyOn(commonsService, 'parseCsv').mockResolvedValueOnce(invalidCsv);
      await expect(service.create(fileBuffer)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    const request = mockCSV;
    const fileBuffer = request.buffer.toString('base64');
    const result = csvProdUpdateResponse;
    const rowsInCsv = csvProdUpdateRequest.length;

    it('should return array of id, highlights and image urls', async () => {
      jest
        .spyOn(commonsService, 'parseCsv')
        .mockResolvedValueOnce(csvProdUpdateRequest);
      const categoryFindUniqueSpy = jest
        .spyOn(prismaService.category, 'findUnique')
        .mockResolvedValue({ id: 1 } as Category);
      const transactionSpy = jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue(prismaCsvUpdateResponse);
      expect(await service.update(fileBuffer)).toStrictEqual(result);
      expect(transactionSpy).toBeCalledTimes(1);
      expect(categoryFindUniqueSpy).toBeCalledTimes(rowsInCsv);
    });

    it('should throw BadRequestException if id is not available', async () => {
      jest
        .spyOn(commonsService, 'parseCsv')
        .mockResolvedValueOnce(invalidProdUpdateRequest);
      expect(service.update(fileBuffer)).rejects.toThrow(BadRequestException);
    });
  });
});
