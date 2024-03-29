import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';
import config from './common/config/config';
import { ImagesModule } from './images/images.module';
import { ProductsModule } from './products/products.module';
import { CsvModule } from './csv/csv.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ProductsModule,
    CategoriesModule,
    ImagesModule,
    CsvModule,
    MinioClientModule,
    SearchModule,
  ],
})
export class AppModule {}
