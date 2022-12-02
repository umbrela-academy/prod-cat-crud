import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UploadedFileModel } from '../../common/types/uploaded-file.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreatedProductDto } from '../dto/created-product.dto';
import { GetProductDto } from '../dto/get-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { includeHightsAndImages } from '../product.utils';
import { ProductCommonsService } from './product-commons.service';

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
    private productCommonsService: ProductCommonsService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    imageFileDtos: UploadedFileModel[],
  ): Promise<CreatedProductDto> {
    const categoryConnector = await this.getCategoryConnector(
      createProductDto.categoryId,
    );
    const parentConnector = await this.getParentConnector(
      createProductDto.parentId,
    );

    const images = this.getImagesPayload(imageFileDtos);

    return this.prismaService.product
      .create({
        data: {
          name: createProductDto.name,
          ...parentConnector,
          ...categoryConnector,
          status: createProductDto.status,
          images,
          highlights: {
            create: { description: createProductDto.highlight },
          },
          description: createProductDto.description,
        },
        select: {
          id: true,
          images: true,
          highlights: {
            select: {
              id: true,
              description: true,
            },
          },
        },
      })
      .then(({ id, images, highlights }) => ({
        id,
        highlights: highlights.map(({ id, description }) => ({
          id,
          description,
        })),
        images: images.map((image) =>
          this.productCommonsService.toUrl(image.id),
        ),
      }));
  }

  getImagesPayload(imageFileDtos: UploadedFileModel[]) {
    const data = imageFileDtos.map((imageFileDto) => ({
      destination: this.productCommonsService.defaultDestination,
      originalname: imageFileDto.originalname,
      filename: imageFileDto.filename,
      mimetype: imageFileDto.mimetype,
    }));
    return { createMany: { data } };
  }

  private async getParentConnector(id?: number) {
    const parent = id
      ? await this.prismaService.product.findUnique({
          where: { id: +id },
        })
      : null;

    if (id !== undefined && parent === null) {
      throw new NotFoundException(`No parent product with id: ${id} found`);
    }

    return parent !== null
      ? {
          parent: {
            connect: {
              id: parent.id,
            },
          },
        }
      : {};
  }

  private async getCategoryConnector(id?: number) {
    const category = id
      ? await this.prismaService.category.findUnique({
          where: { id: +id },
        })
      : null;

    if (category === null) {
      throw new NotFoundException(`No category with id: ${id} found`);
    }

    return {
      category: {
        connect: {
          id: category.id,
        },
      },
    };
  }

  async findAll(): Promise<GetProductDto[]> {
    return (
      await this.prismaService.product.findMany(includeHightsAndImages)
    ).map(this.productCommonsService.toDto);
  }

  async findPaged(
    pageNumber: number,
    pageSize: number,
  ): Promise<GetProductDto[]> {
    const productsWithImage = await this.prismaService.product.findMany({
      skip: pageNumber * pageSize,
      take: pageSize,
      ...includeHightsAndImages,
    });
    return productsWithImage.map(this.productCommonsService.toDto);
  }

  async findOne(id: number): Promise<GetProductDto | null> {
    const productWithRelations = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      ...includeHightsAndImages,
    });
    return productWithRelations
      ? this.productCommonsService.toDto(productWithRelations)
      : null;
  }

  async updateScalars(id: number, updateProductDto: UpdateProductDto) {
    const productExists = await this.productCommonsService.exists(id);

    if (!productExists) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }

    const data = await this.buildUpdateData(updateProductDto);

    return this.prismaService.product.update({
      where: {
        id,
      },
      data,
    });
  }

  private async buildUpdateData(updateProductDto: UpdateProductDto) {
    const data: any = {};

    if (updateProductDto.name !== undefined) {
      data.name = updateProductDto.name;
    }

    if (updateProductDto.status) {
      data.status = updateProductDto.status;
    }

    data.category = await this.getCategoryConnector(
      updateProductDto.categoryId,
    );

    const parentConnector = await this.getParentConnector(
      updateProductDto.parentId,
    );

    if (parentConnector.parent) {
      data.parent = parentConnector.parent;
    }

    return data;
  }

  remove(id: number) {
    return this.prismaService.product.delete({
      where: {
        id,
      },
    });
  }
}
