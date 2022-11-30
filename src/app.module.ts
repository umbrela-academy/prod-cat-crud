import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import config from './common/config/config';
import { ImagesModule } from './images/images.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ProductsModule,
    CategoriesModule,
    ImagesModule,
  ],
})
export class AppModule {}
