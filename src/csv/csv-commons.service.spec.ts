import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { CsvCommonService } from './csv-commons.service';

describe('CsvCommonService', () => {
  let service: CsvCommonService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvCommonService, HttpService, ConfigService],
    }).compile();

    service = module.get<CsvCommonService>(CsvCommonService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('downloadImage', () => {
    it('should download and process image from URL successfully', async () => {
      // TODO: Implement the test scenario
    });

    it('should throw BadRequestException if the HTTP response status is not OK', async () => {
      // TODO: Implement the test scenario
    });

    it('should throw BadRequestException if error occurs during image download', async () => {
      // TODO: Implement the test scenario
    });
  });

  describe('getImageMetadata', () => {
    it('should retrieve image metadata successfully', async () => {
      // TODO: Implement the test scenario
    });

    it('should throw BadRequestException if image buffer is not an image');

    it('should throw BadRequestException if error occurs during image metadata retrieval', async () => {
      // TODO: Implement the test scenario
    });
  });

  describe('saveImage', () => {
    it('should save the image successfully', async () => {
      // TODO: Implement the test scenario
    });

    it('should throw an error if error occurs during image saving', async () => {
      // TODO: Implement the test scenario
    });
  });
});
