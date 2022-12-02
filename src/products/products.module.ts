import { ProductCommonsService } from './services/product-commons.service';
import { ProductRelationsService } from './services/product-relations.service';
import { PrismaService } from './../common/services/prisma.service';
import { ImagesModule } from './../images/images.module';
import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [ImagesModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    ProductRelationsService,
    ProductCommonsService,
  ],
})
export class ProductsModule {}
