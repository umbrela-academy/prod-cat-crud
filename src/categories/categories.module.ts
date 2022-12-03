import { Module } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { ImagesModule } from '../images/images.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [ImagesModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
