import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../common/services/prisma.service';
import { UploadedFileModel } from './../common/types/uploaded-file.model';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  includeHightsAndImages,
  toGetProductDto,
  toImageUrl,
} from './product.utils';

@Injectable()
export class ProductsService {
  readonly IMG_STORE_URL = this.configService.get<string>(
    'imageStore.storeUrl',
  );

  readonly defaultDestination =
    this.configService.get<string>('imageStore.destination') ?? 'default';

  toDto = toGetProductDto(this.IMG_STORE_URL);
  toUrl = toImageUrl(this.IMG_STORE_URL);

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    imageFileDtos: UploadedFileModel[],
  ) {
    const categoryConnector = await this.getCategoryConnector(
      createProductDto.categoryId,
    );
    const parentConnector = await this.getParentConnector(
      createProductDto.parentId,
    );

    const images = this.getImagesPayload(imageFileDtos);

    return this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        ...parentConnector,
        ...categoryConnector,
        status: createProductDto.status,
        images,
        highlights: {
          createMany: { data: createProductDto.highlights },
        },
        description: createProductDto.description,
      },
      select: {
        id: true,
      },
    });
  }

  private getImagesPayload(imageFileDtos: UploadedFileModel[]) {
    const data = imageFileDtos.map((imageFileDto) => ({
      destination: this.defaultDestination,
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
    ).map(this.toDto);
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
    return productsWithImage.map(this.toDto);
  }

  async findOne(id: number): Promise<GetProductDto | null> {
    const productWithRelations = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      ...includeHightsAndImages,
    });
    return productWithRelations ? this.toDto(productWithRelations) : null;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    imageFileDtos?: UploadedFileModel[],
  ) {
    const productExists = await this.exists(id);

    if (!productExists) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }

    const data = await this.buildUpdateData(updateProductDto, imageFileDtos);

    return this.prismaService.product.update({
      where: {
        id,
      },
      data,
    });
  }

  private async buildUpdateData(
    updateProductDto: UpdateProductDto,
    imageFileDtos?: UploadedFileModel[],
  ) {
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

    if (imageFileDtos && imageFileDtos.length) {
      data.images = this.getImagesPayload(imageFileDtos);
    }

    return data;
  }

  private async exists(id: number, isProduct = true): Promise<boolean> {
    const whereQuery = {
      where: {
        id,
      },
    };
    const found = isProduct
      ? await this.prismaService.product.findUnique(whereQuery)
      : await this.prismaService.category.findUnique(whereQuery);
    return found !== null;
  }

  remove(id: number) {
    return this.prismaService.product.delete({
      where: {
        id,
      },
    });
  }

  removeHighlight(id: number, highlightId: number) {
    const productWithHighlight = this.prismaService.product.findUnique({
      where: {
        id,
      },
      select: {
        highlights: {
          where: {
            id: highlightId,
          },
        },
      },
    });

    if (productWithHighlight === null) {
      throw new NotFoundException(
        `Highlight with id: ${highlightId} was not found in product with id: ${id}`,
      );
    }

    return this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        highlights: {
          delete: {
            id: highlightId,
          },
        },
      },
    });
  }

  removeImage(id: number, imageId: number) {
    const productWithImage = this.prismaService.product.findUnique({
      where: {
        id,
      },
      select: {
        images: {
          where: {
            id: imageId,
          },
        },
      },
    });

    if (productWithImage === null) {
      throw new NotFoundException(
        `Image with id: ${imageId} was not found in product with id: ${id}`,
      );
    }

    // const imagePath = productWithImage.images
    // TODO
    // unlink()

    return this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        images: {
          delete: {
            id: imageId,
          },
        },
      },
    });
  }
}
