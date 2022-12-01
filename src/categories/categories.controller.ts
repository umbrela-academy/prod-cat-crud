import { zIdParam, zZeroIndexParam } from './../common/types/z.schema';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response as Res } from 'express';
import { ZImageValidationPipe } from '../common/services/z-image.validator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { z } from 'zod';
import { complainIfInvalid } from '../common/utils/validation-utils';

@ApiTags('category')
@Controller('categories')
@UsePipes(ZodValidationPipe)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ZImageValidationPipe()],
      }),
    )
    image: Express.Multer.File,
    @Response() response: Res,
  ) {
    const id = await this.categoriesService.create(createCategoryDto, image);
    return response
      .set({ Location: '/' + id })
      .status(201)
      .json({ id });
  }

  @Get()
  findAll(): Promise<GetCategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @Get('/paged/:pageNumber/:pageSize')
  findPaged(
    @Param('pageNumber') pageNumber: number,
    @Param('pageSize') pageSize: number,
  ): Promise<GetCategoryDto[]> {
    complainIfInvalid(() => {
      z.object({
        pageNumber: zZeroIndexParam('page number'),
        pageSize: zIdParam('page size'),
      }).parse({
        pageNumber: +pageNumber,
        pageSize: +pageSize,
      });
    });
    return this.categoriesService.findPaged(+pageNumber, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<GetCategoryDto | null> {
    complainIfInvalid(() => zIdParam().parse(+id));
    return this.categoriesService.findOne(+id);
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new ZImageValidationPipe()],
      }),
    )
    image?: Express.Multer.File,
  ) {
    complainIfInvalid(() => zIdParam().parse(+id));
    return this.categoriesService.update(+id, updateCategoryDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    complainIfInvalid(() => zIdParam().parse(+id));
    return this.categoriesService.remove(+id);
  }
}
