import { Test, TestingModule } from '@nestjs/testing';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { CsvCommonService } from './csv-commons.service';
import { PrismaService } from '../common/services/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { mockCSV, mockImage } from './mocks/csv-req-res.mock';
import { BadRequestException } from '@nestjs/common';
import {
  csvProdCreatedResponse,
  csvProdUpdateResponse,
} from './mocks/csv-service-response.mock';
import { ImagesModule } from '../images/images.module';
import config from '../common/config/config';

describe('CsvController', () => {
  let controller: CsvController;
  let entityService: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ load: [config] }),
        ImagesModule,
      ],
      controllers: [CsvController],
      providers: [CsvService, CsvCommonService, PrismaService],
    }).compile();

    controller = module.get<CsvController>(CsvController);
    entityService = module.get<CsvService>(CsvService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const request = mockCSV;
    const result = csvProdCreatedResponse;
    it('should return array of id, highlights and image URLs', async () => {
      jest
        .spyOn(entityService, 'create')
        .mockImplementation(() => Promise.resolve(result));
      expect(controller.create(request)).resolves.toBe(result);
    });

    it('should throw BadRequestException if file is not a csv', async () => {
      const request = mockImage;
      expect(controller.create(mockImage)).rejects.toThrow(BadRequestException);
    });

    it('should delegate to service layer once', async () => {
      const serviceCreateSpy = jest
        .spyOn(entityService, 'create')
        .mockResolvedValue(result);
      await controller.create(request);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    const request = mockCSV;
    const result = csvProdUpdateResponse;

    it('should return array of id, highlights and image URLs', async () => {
      jest.spyOn(entityService, 'update').mockResolvedValueOnce(result);
      expect(controller.update(request)).resolves.toBe(result);
    });

    it('should throw BadRequestException if file is not a csv', async () => {
      const request = mockImage;
      expect(controller.update(mockImage)).rejects.toThrow(BadRequestException);
    });

    it('should delegate to service layer once', async () => {
      const serviceCreateSpy = jest
        .spyOn(entityService, 'update')
        .mockResolvedValue(result);
      await controller.update(request);
      expect(serviceCreateSpy).toBeCalledTimes(1);
    });
  });
});
