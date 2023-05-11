import { HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { CsvCommonService } from './csv-commons.service';
import { Observable, of } from 'rxjs';
import { HttpModule } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { DownloadedFileModel } from 'src/common/types/downloaded-file.model';
import { HttpStatus } from '@nestjs/common';

export const httpResponse = {
  status: HttpStatus.OK,
  data: {
    buffer: 'image buffer',
  },
  statusText: 'OK',
  headers: { 'Content-Disposition': 'attachment; filename=image.jpg' },
};

export const response: DownloadedFileModel = {
  destination: '',
  filename: '1683280411774.jpg',
  originalname: '1683280411774.jpg',
  mimetype: 'image/jpg',
  url: 'https://i.imgur.com/2ABGp0Q.jpeg',
};
export const metdata = {
  format: 'jpeg',
  width: 800,
  height: 60,
};

describe('CsvCommonService', () => {
  let commonsservice: CsvCommonService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [CsvCommonService],
    }).compile();

    commonsservice = module.get<CsvCommonService>(CsvCommonService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(commonsservice).toBeDefined();
  });

  describe('downloadImage', () => {
    const url = 'https://i.imgur.com/2ABGp0Q.jpeg';
    it('should download image and return destination and file metadata', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(httpResponse));

      expect(commonsservice.downloadImage(url)).resolves.toStrictEqual(
        response,
      );
    });

    it('should throw BadRequestException if the HTTP response status is not OK', async () => {
      // TODO: Implement the test scenario
    });

    it('should throw BadRequestException if the buffer received is not of image', async () => {
      // TODO: Implement the test scenario
    });
  });
});
