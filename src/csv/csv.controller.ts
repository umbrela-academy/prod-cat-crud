import {
  Controller,
  Post,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { CsvService } from './csv.service';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZCsvValidatorPipe } from '../common/services/z-csv.validator';
import { CreatedProductDto } from '../products/dto/created-product.dto';
import { GetProductDto } from '../products/dto/get-product.dto';
import { ExcelTransformationPipe } from '../common/services/excel-csv.pipe';
import { CreateCsvDto } from './dto/create-csv.dto';
import { UpdateCsvDto } from './dto/update-csv.dto';

@ApiTags('csv')
@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @ApiCreatedResponse({
    description: 'The csv has been uploaded to database successfullly',
    type: CreatedProductDto,
    isArray: true,
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file', {}))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ZCsvValidatorPipe()],
      }),
      new ExcelTransformationPipe(),
    )
    csv: CreateCsvDto[],
  ): Promise<CreatedProductDto[]> {
    return this.csvService.create(csv);
  }

  @ApiOkResponse({
    type: [GetProductDto],
    description: 'The Following products were updtated',
    isArray: true,
  })
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ZCsvValidatorPipe()],
      }),
      new ExcelTransformationPipe(false),
    )
    csv: UpdateCsvDto[],
  ) {
    return this.csvService.update(csv);
  }
}
