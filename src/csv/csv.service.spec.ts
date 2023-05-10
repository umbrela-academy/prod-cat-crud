import { Test, TestingModule } from '@nestjs/testing';
import { CsvCommonService } from './csv-commons.service';
import { CsvService } from './csv.service';
import {
  csvProdCreateRequest,
  csvProdCreatedResponse,
  mockCSV,
} from './mocks/csv-req-res.mock';
import { PrismaService } from './../../src/common/services/prisma.service';

describe('CsvService', () => {
  let service: CsvService;
  let prismaService: PrismaService;
  let commonsService: CsvCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvService, PrismaService, CsvCommonService],
    }).compile();

    service = module.get<CsvService>(CsvService);
    prismaService = module.get<PrismaService>(PrismaService);
    commonsService = module.get<CsvCommonService>(CsvCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //TODO
  describe('create', () => {
    const request = mockCSV;
    const fileBuffer = request.buffer.toString('base64');
    const result = csvProdCreatedResponse;

    beforeEach(async () => {
      const createdProductsDto = await service.create(fileBuffer);
      console.log('Returned Value:', createdProductsDto);
      expect(createdProductsDto).toStrictEqual(result);
    });
  });
  // it('should throw and error if required headers is missing');

  // it('should throw and error if the values do not match schema');

  // it('should throw an error if a categoryId or parentId does not exist');

  // it('should throw an error if status is not one of status enums');

  // it('should throw an error ifimage column is not an array');

  // it('should throw and error it an url does not send image buffer as response');

  // it('should connect id of Product Image if an url exists in db');
});
