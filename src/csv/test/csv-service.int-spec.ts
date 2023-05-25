import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../common/services/prisma.service';
import { mockCSV, mockImage, updateMockCSV } from '../mocks/csv-req-res.mock';
import { CsvService } from '../csv.service';
import {
  ProdCreateResIntegration,
  ProdUpdateResIntegration,
} from '../mocks/csv-service-response.mock';
import resetDb from '../../common/utils/resetDb';
import { mockFile } from '../../products/mocks/product-req-res.mock';
import { BadRequestException } from '@nestjs/common';

describe('CsvService (Integration)', () => {
  let prismaService: PrismaService;
  let csvService: CsvService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    csvService = moduleRef.get(CsvService);
  });

  describe('create', () => {
    const request = mockCSV.buffer.toString('base64');
    const response = ProdCreateResIntegration;

    it('should create category', async () => {
      await prismaService.category.create({
        data: {
          name: 'Category 1',
          status: 'ACTIVE',
          categoryImage: {
            create: {
              destination: 'default',
              originalname: mockImage.originalname,
              filename: mockImage.fieldname,
              mimetype: mockImage.mimetype,
            },
          },
        },
      });
    });

    it('should create products from csv data', async () => {
      const createdProduct = await csvService.create(request);
      expect(createdProduct).toStrictEqual(response);
    });

    it('should throw BadRequestException if uploaded file is not valid', async () => {
      const request = mockFile.buffer.toString();
      expect(csvService.create(request)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const request = updateMockCSV.buffer.toString('base64');
    const response = ProdUpdateResIntegration;

    it('should update products from csv data and return id, highlights and images', async () => {
      const updatedProduct = await csvService.update(request);
      expect(updatedProduct).toStrictEqual(response);
    });

    it('should throw BadRequestException if id not present in csv', async () => {
      const request = mockCSV.buffer.toString('base64');
      expect(csvService.update(request)).rejects.toThrow(BadRequestException);
    });
  });
});
