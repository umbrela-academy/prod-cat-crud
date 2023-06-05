import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import {
  RejecthttpResponse,
  httpResponse,
  response,
} from '../csv/mocks/csv-req-res.mock';
import { CsvCommonService } from './csv-commons.service';
import { ImagesModule } from '../images/images.module';
import config from '../common/config/config';
import * as crypto from 'crypto';

describe('CsvCommonService', () => {
  let commonsservice: CsvCommonService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [config] }), ImagesModule],
      providers: [
        CsvCommonService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    commonsservice = module.get<CsvCommonService>(CsvCommonService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(commonsservice).toBeDefined();
  });

  describe('downloadImage', () => {
    const url = 'https://i.imgur.com/2ABGp0Q.png';
    it('should download image and return destination and file metadata', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(httpResponse));

      jest
        .spyOn(crypto, 'randomUUID')
        .mockImplementation(() => 'd477d7e4-5803-4f94-9f78-4cebb05f42d6');

      await expect(commonsservice.downloadImage(url)).resolves.toStrictEqual(
        response,
      );
    });

    it('should throw BadRequestException if the HTTP response status is not OK', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(RejecthttpResponse));

      await expect(() => commonsservice.downloadImage(url)).rejects.toThrow(
        new BadRequestException(`Error downloading image from ${url}`),
      );
    });

    it('should throw BadRequestException if the buffer received is not of image', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(RejecthttpResponse));
      await expect(() => commonsservice.downloadImage(url)).rejects.toThrow(
        new BadRequestException(`Error downloading image from ${url}`),
      );
    });
  });
});
