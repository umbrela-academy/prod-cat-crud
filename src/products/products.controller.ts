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
  Put,
  Response,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Response as Res } from 'express';
import { z } from 'zod';
import { ZImagesValidationPipe } from '../common/services/z-images.validator';
import { zIdParam, zZeroIndexParam } from '../common/types/z.schema';
import { complainIfInvalid } from '../common/utils/validation-utils';
import {
  CreateHighlightDto,
  CreateHightlightsDto,
} from './dto/create-highlight.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreatedProductDto } from './dto/created-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductHighlightsDto } from './dto/update-product-highlights.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRelationsService } from './services/product-relations.service';
import { ProductsService } from './services/products.service';

@ApiTags('product')
@Controller('products')
@UsePipes(ZodValidationPipe)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productRelationsService: ProductRelationsService,
  ) {}

  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: CreatedProductDto,
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
    console.log('received', createProductDto);
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

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateScalars(id, updateProductDto);
  }

  @ApiConsumes('multipart/form-data')
  @Post(':id/images')
  addImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new ZImagesValidationPipe()],
      }),
    )
    images: Express.Multer.File[],
  ) {
    return this.productRelationsService.addImages(id, images);
  }

  @Post(':id/highlights')
  addHighlights(
    @Param('id', ParseIntPipe) id: number,
    @Body() highlights: CreateHightlightsDto,
  ) {
    return this.productRelationsService.addHighlights(id, highlights);
  }

  @Put(':id/highlights')
  updateHighlights(
    @Param('id', ParseIntPipe) id: number,
    @Body() highlightUpdates: UpdateProductHighlightsDto,
  ) {
    return this.productRelationsService.updateHighlights(id, highlightUpdates);
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
    return this.productRelationsService.removeImage(id, imageId);
  }

  @Delete(':id/highlight/:highlightId')
  removeHighlight(
    @Param('id', ParseIntPipe) id: number,
    @Param('highlightId', ParseIntPipe) highlightId: number,
  ) {
    return this.productRelationsService.removeHighlight(id, highlightId);
  }
}
