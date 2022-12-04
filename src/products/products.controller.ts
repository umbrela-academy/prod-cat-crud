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
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { ZImagesValidationPipe } from '../common/services/z-images.validator';
import { zIdParam } from '../common/types/z.schema';
import { throw400IfInvalid } from '../common/utils/validation-utils';
import { AddProductImagesDto } from './dto/add-product-images.dto';
import { CreateHightlightsDto } from './dto/create-highlight.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreatedProductDto } from './dto/created-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductHighlightsDto } from './dto/update-product-highlights.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdatedProductHighlightsDto } from './dto/updated-product-highlights.dto';
import { UpdatedProductImagesDto } from './dto/updated-product-images.dto';
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
    description: 'The product has been successfully created.',
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
  ): Promise<CreatedProductDto> {
    return this.productsService.create(createProductDto, images);
  }

  @ApiOkResponse({
    type: GetProductDto,
    description: 'The following products were found.',
    isArray: true,
  })
  @Get()
  findAll(): Promise<GetProductDto[]> {
    return this.productsService.findAll();
  }

  @ApiOkResponse({
    type: GetProductDto,
    description: 'The following products were found.',
    isArray: true,
  })
  @Get('/paged/:pageNumber/:pageSize')
  findPaged(
    @Param('pageNumber', ParseIntPipe) pageNumber: number,
    @Param('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<GetProductDto[]> {
    throw400IfInvalid(() => {
      z.object({
        pageNumber: zIdParam('page number'),
        pageSize: zIdParam('page size'),
      }).parse({
        pageNumber,
        pageSize,
      });
    });
    return this.productsService.findPaged(pageNumber, pageSize);
  }

  @ApiOkResponse({
    type: GetProductDto,
    description: 'The following product was found. (Empty if none found)',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetProductDto | null> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.productsService.findOne(id);
  }

  @ApiOkResponse({
    type: GetProductDto,
    description: 'The following product was deleted.',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<GetProductDto> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.productsService.remove(id);
  }

  @ApiOkResponse({
    type: GetProductDto,
    description: 'The attributes of the following product were updated.',
  })
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.productsService.updateScalars(id, updateProductDto);
  }

  @ApiCreatedResponse({
    description: 'The product images have been added.',
    type: UpdatedProductImagesDto,
    isArray: true,
  })
  @ApiConsumes('multipart/form-data')
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images'))
  async addImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() imagesForm: AddProductImagesDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new ZImagesValidationPipe()],
      }),
    )
    images: Express.Multer.File[],
  ): Promise<UpdatedProductImagesDto[]> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.productRelationsService.addImages(id, images);
  }

  @ApiCreatedResponse({
    description: 'The product highlights have been added.',
    type: UpdatedProductHighlightsDto,
    isArray: true,
  })
  @Post(':id/highlights')
  async addHighlights(
    @Param('id', ParseIntPipe) id: number,
    @Body() highlights: CreateHightlightsDto,
  ): Promise<UpdatedProductHighlightsDto[]> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.productRelationsService.addHighlights(id, highlights);
  }

  @ApiOperation({
    description:
      'Updates or removes only those highlights which already belong to the given product',
  })
  @ApiResponse({
    description: 'The product highlights have been updated.',
    type: UpdatedProductHighlightsDto,
    isArray: true,
  })
  @Put(':id/highlights')
  async updateHighlights(
    @Param('id', ParseIntPipe) id: number,
    @Body() highlightUpdates: UpdateProductHighlightsDto,
  ): Promise<UpdatedProductHighlightsDto[]> {
    throw400IfInvalid(() => zIdParam().parse(id));
    return this.productRelationsService.updateHighlights(id, highlightUpdates);
  }

  @ApiResponse({
    description: 'The product image has been deleted.',
    type: String,
  })
  @Delete(':id/image/:imageId')
  async removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ): Promise<string> {
    throw400IfInvalid(() => {
      z.object({
        id: zIdParam('product id'),
        imageId: zIdParam('image id'),
      }).parse({
        id,
        imageId,
      });
    });
    return this.productRelationsService.removeImage(id, imageId);
  }

  @ApiResponse({
    description: 'The product highlight has been deleted.',
    type: String,
  })
  @Delete(':id/highlight/:highlightId')
  async removeHighlight(
    @Param('id', ParseIntPipe) id: number,
    @Param('highlightId', ParseIntPipe) highlightId: number,
  ): Promise<string> {
    throw400IfInvalid(() => {
      z.object({
        id: zIdParam('product id'),
        highlightId: zIdParam('highlight id'),
      }).parse({
        id,
        highlightId,
      });
    });
    return this.productRelationsService.removeHighlight(id, highlightId);
  }
}
