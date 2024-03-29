import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { UploadedFileModel } from '../../common/types/uploaded-file.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreatedProductDto } from '../dto/created-product.dto';
import { GetProductDto } from '../dto/get-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { includeHightsAndImages } from '../product.utils';
import { ProductCommonsService } from './product-commons.service';
import { ProductSearchDto } from 'src/common/utils/product-common.utils';

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

    const images = await this.productCommonsService.getImagesPayload(
      imageFileDtos,
    );

    const res = await this.prismaService.product.create({
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
        images: {
          select: {
            id: true,
          },
        },
        highlights: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    });

    return {
      id: res.id,
      highlights: res.highlights.map(({ id, description }) => ({
        id,
        description,
      })),
      images: res.images.map((image) =>
        this.productCommonsService.toUrl(image.id),
      ),
    };
  }

  private async getParentConnector(id?: number) {
    const parent = id
      ? await this.prismaService.product.findUnique({
          where: { id: +id },
          select: { id: true },
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
          select: { id: true },
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
      skip: (pageNumber - 1) * pageSize,
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

  async updateScalars(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    await this.throwIfNotFound(id);

    const data = await this.buildUpdateData(updateProductDto);

    const res = await this.prismaService.product.update({
      where: {
        id,
      },
      data,
      ...includeHightsAndImages,
    });
    return this.productCommonsService.toDto(res);
  }

  private async buildUpdateData(updateProductDto: UpdateProductDto) {
    const data: any = {};

    if (updateProductDto.name !== undefined) {
      data.name = updateProductDto.name;
    }

    if (updateProductDto.status) {
      data.status = updateProductDto.status;
    }

    if (updateProductDto.categoryId) {
      data.category = (
        await this.getCategoryConnector(updateProductDto.categoryId)
      ).category;
    }

    if (updateProductDto.parentId) {
      const parentConnector = await this.getParentConnector(
        updateProductDto.parentId,
      );

      if (parentConnector.parent) {
        data.parent = parentConnector.parent;
      }
    }

    return data;
  }

  async remove(id: number): Promise<GetProductDto> {
    await this.throwIfNotFound(id);
    const res = await this.prismaService.product.delete({
      where: {
        id,
      },
      ...includeHightsAndImages,
    });
    return this.productCommonsService.toDto(res);
  }

  async throwIfNotFound(id: number) {
    const productExists = await this.productCommonsService.exists(id);
    if (!productExists) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }
  }

  async search(query: string): Promise<ProductSearchDto[]> {
    return (
      await this.prismaService.product.findMany({
        where: { name: { search: query }, description: { search: query } },
        select: {
          name: true,
          description: true,
          highlights: true,
          images: {
            select: {
              id: true,
            },
          },
        },
      })
    ).map(this.productCommonsService.toSearchDto);
  }
}
