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
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ZImagesValidationPipe } from 'src/common/services/z-images.validator';
import { zIdParam, zZeroIndexParam } from 'src/common/types/z.schema';
import { complainIfInvalid } from 'src/common/utils/validation-utils';
import { z } from 'zod';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Response as Res } from 'express';

@ApiTags('product')
@Controller('products')
@UsePipes(ZodValidationPipe)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: CreateProductDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new ZImagesValidationPipe()],
      }),
    )
    images: Express.Multer.File[],
    @Response() response: Res,
  ) {
    const createdDto = await this.productsService.create(
      createProductDto,
      images,
    );
    return response
      .set({ Location: '/' + createdDto.id })
      .status(201)
      .json(createdDto);
  }

  @Get()
  findAll(): Promise<GetProductDto[]> {
    return this.productsService.findAll();
  }

  @Get('/paged/:pageNumber/:pageSize')
  findPaged(
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
    @Param('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<GetProductDto[]> {
    complainIfInvalid(() => {
      z.object({
        pageNumber: zZeroIndexParam('page number'),
        pageSize: zIdParam('page size'),
      }).parse({
        pageNumber,
        pageSize,
      });
    });
    return this.productsService.findPaged(pageNumber, pageSize);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    complainIfInvalid(() => zIdParam().parse(id));
    return this.productsService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new ZImagesValidationPipe()],
      }),
    )
    images?: Express.Multer.File[],
  ) {
    return this.productsService.update(id, updateProductDto, images);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Delete(':id/image/:imageId')
  removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.productsService.removeImage(id, imageId);
  }

  @Delete(':id/highlight/:highlightId')
  removeHighlight(
    @Param('id', ParseIntPipe) id: number,
    @Param('highlightId', ParseIntPipe) highlightId: number,
  ) {
    return this.productsService.removeHighlight(id, highlightId);
  }
}
