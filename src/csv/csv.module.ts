import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';
import { PrismaService } from 'src/common/services/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { CsvCommonService } from './csv-commons.service';

@Module({
  imports: [HttpModule],
  controllers: [CsvController],
  providers: [CsvService, PrismaService, CsvCommonService],
})
export class CsvModule {}
