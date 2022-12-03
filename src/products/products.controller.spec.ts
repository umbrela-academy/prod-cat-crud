import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../common/services/prisma.service';
import { ProductRelationsService } from './services/product-relations.service';
import { ProductCommonsService } from './services/product-commons.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './services/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        ProductCommonsService,
        ProductRelationsService,
        PrismaService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
