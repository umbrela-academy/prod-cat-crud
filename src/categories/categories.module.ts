import { Module } from '@nestjs/common';
import { ImagesModule } from '../images/images.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  imports: [ImagesModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
