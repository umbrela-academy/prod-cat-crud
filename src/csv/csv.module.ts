import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';
import { PrismaService } from '../common/services/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { CsvCommonService } from './csv-commons.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CsvController],
  providers: [CsvService, CsvCommonService, PrismaService, CsvCommonService],
})
export class CsvModule {}
