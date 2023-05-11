import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';
import { PrismaService } from 'src/common/services/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { CsvCommonService } from './csv-commons.service';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [HttpModule, ConfigModule, ImagesModule],
  controllers: [CsvController],
  providers: [CsvService, CsvCommonService, PrismaService, CsvCommonService],
})
export class CsvModule {}
