import { AxiosResponse } from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import { DownloadedFileModel } from 'src/common/types/downloaded-file.model';

const filepath = join('test', '34563.png');
export const mockImage = {
  fieldname: 'file',
  originalname: '34563.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: fs.readFileSync(filepath),
  size: 3638506,
} as Express.Multer.File;

const csvfilePath = join('test', 'mock.csv');
export const mockCSV = {
  buffer: fs.readFileSync(csvfilePath),
} as Express.Multer.File;

const updateCsvFilePath = join('test', 'update_mock.csv');
export const updateMockCSV = {
  buffer: fs.readFileSync(updateCsvFilePath),
} as Express.Multer.File;

export const httpResponse: AxiosResponse<any> = {
  status: 200,
  data: mockImage.buffer,
  statusText: 'OK',
  headers: { 'Content-Disposition': 'attachment; filename=image.png' },
  config: {} as any,
};

export const RejecthttpResponse: AxiosResponse<any> = {
  status: 400,
  data: {
    buffer: Buffer.from(mockCSV.buffer),
  },
  statusText: 'OK',
  headers: { 'Content-Disposition': 'attachment; filename=image.png' },
  config: {} as any,
};
export const response: DownloadedFileModel = {
  destination: 'default',
  filename: '1683818690154.png',
  originalname: 'image.png',
  mimetype: 'image/png',
  url: 'https://i.imgur.com/2ABGp0Q.png',
};
export const metdata = {
  format: 'jpeg',
  width: 800,
  height: 60,
};
