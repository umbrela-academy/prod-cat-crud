import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  UploadedFiles,
  UsePipes,
} from '@nestjs/common';
import { CsvService } from './csv.service';
import { CreateCsvDto } from './dto/create-csv.dto';
import { UpdateCsvDto } from './dto/update-csv.dto';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZCsvValidatorPipe } from 'src/common/services/z-csv.validator';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { CreatedProductDto } from 'src/products/dto/created-product.dto';
import { GetProductDto } from 'src/products/dto/get-product.dto';

@ApiTags('csv')
@Controller('csv')
@UsePipes(ZodValidationPipe)
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
