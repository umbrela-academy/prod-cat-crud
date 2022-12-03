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
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { ZImageValidationPipe } from '../common/services/z-image.validator';
import { throw400IfInvalid } from '../common/utils/validation-utils';
import { zImageValidator } from './../common/types/z-image.schema';
import { zIdParam, zIdRefined } from './../common/types/z.schema';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreatedCategoryDto } from './dto/created-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('category')
@ApiProduces('application/json')
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
  ): Promise<CreatedCategoryDto> {
    return this.categoriesService.create(createCategoryDto, image);
  }

  @ApiOkResponse({
    type: GetCategoryDto,
    description: 'The following categories were found.',
    isArray: true,
  })
  @Get()
  findAll(): Promise<GetCategoryDto[]> {
    return this.categoriesService.findAll();
  }

  @ApiOkResponse({
    type: GetCategoryDto,
    isArray: true,
    description: 'The following categories were found.',
  })
  @Get('/paged/:pageNumber/:pageSize')
  async findPaged(
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
    @Param('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<GetCategoryDto[]> {
    throw400IfInvalid(() => {
      z.object({
        pageNumber: zIdParam('page number'),
        pageSize: zIdParam('page size'),
      }).parse({
        pageNumber,
        pageSize,
      });
    });
    return this.categoriesService.findPaged(pageNumber, pageSize);
  }

  @ApiOkResponse({
    type: GetCategoryDto,
    description: 'The following category was found. (Empty if none found)',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetCategoryDto | null> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.categoriesService.findOne(id);
  }

  @ApiOkResponse({
    type: GetCategoryDto,
    description: 'The following category was updated.',
  })
  @ApiOperation({
    description: `Updates the provided attributes of the category.
      If image is provided, it replaces the previous one.`,
  })
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile()
    image?: Express.Multer.File,
  ): Promise<GetCategoryDto> {
    throw400IfInvalid(() => zIdParam().parse(id));
    const pid = updateCategoryDto.parentId;
    if (pid !== undefined) {
      throw400IfInvalid(() => zIdRefined(pid, 'parentId'));
    }
    if (image !== undefined) {
      throw400IfInvalid(() => zImageValidator.parse(image));
    }
    return this.categoriesService.update(id, updateCategoryDto, image);
  }

  @ApiOkResponse({
    type: GetCategoryDto,
    description: 'The following category was deleted.',
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<GetCategoryDto> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.categoriesService.remove(id);
  }
}
