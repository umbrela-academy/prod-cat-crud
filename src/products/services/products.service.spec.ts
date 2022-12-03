import { ConfigService } from '@nestjs/config';
import { ProductCommonsService } from './product-commons.service';
import { PrismaService } from './../../common/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        ProductCommonsService,
        PrismaService,
        ConfigService,
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
