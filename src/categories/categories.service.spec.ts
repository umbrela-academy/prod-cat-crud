import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../common/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';

const mockFile = {
  fieldname: 'file',
  originalname: '34563.png',
  encoding: '7bit',
  mimetype: 'image/png',
  buffer: Buffer.from(__dirname + '../../test/34563.png'),
  size: 3638506,
} as Express.Multer.File;

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, PrismaService, ConfigService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
