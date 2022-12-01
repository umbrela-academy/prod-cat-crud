import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Response,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Response as Res } from 'express';
import { z } from 'zod';
import { ZImageValidationPipe } from '../common/services/z-image.validator';
import { complainIfInvalid } from '../common/utils/validation-utils';
import { zIdParam, zZeroIndexParam } from './../common/types/z.schema';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreatedCategoryDto } from './dto/created-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('category')
@Controller('categories')
@UsePipes(ZodValidationPipe)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: CreatedCategoryDto,
  })
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
    console.log('start parent conn', createCategoryDto);
    const createdDto = await this.categoriesService.create(
      createCategoryDto,
      image,
    );
    return response
      .set({ Location: '/' + createdDto.id })
      .status(201)
      .json(createdDto);
  }

  @Get()
  findAll(): Promise<GetCategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @Get('/paged/:pageNumber/:pageSize')
  findPaged(
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
    @Param('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<GetCategoryDto[]> {
    complainIfInvalid(() => {
      z.object({
        pageNumber: zZeroIndexParam('page number'),
        pageSize: zIdParam('page size'),
      }).parse({
        pageNumber,
        pageSize,
      });
    });
    return this.categoriesService.findPaged(pageNumber, pageSize);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetCategoryDto | null> {
    complainIfInvalid(() => zIdParam().parse(id));
    return this.categoriesService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    complainIfInvalid(() => zIdParam().parse(id));
    return this.categoriesService.update(id, updateCategoryDto, image);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    complainIfInvalid(() => zIdParam().parse(id));
    return this.categoriesService.remove(id);
  }
}
