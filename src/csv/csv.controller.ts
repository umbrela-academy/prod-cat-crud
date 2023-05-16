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
  @UseInterceptors(FileInterceptor('csv'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ZCsvValidatorPipe()],
      }),
    )
    csv: Express.Multer.File,
  ): Promise<CreatedProductDto[]> {
    return this.csvService.create(csv.buffer.toString('base64'));
  }

  @ApiOkResponse({
    type: [GetProductDto],
    description: 'The Following products were updtated',
    isArray: true,
  })
  @Patch()
  @UseInterceptors(FileInterceptor('csv'))
  async update(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ZCsvValidatorPipe()],
      }),
    )
    csv: Express.Multer.File,
  ) {
    return this.csvService.update(csv.buffer.toString('base64'));
  }
}
