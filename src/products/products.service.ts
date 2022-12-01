import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../common/services/prisma.service';
import { UploadedFileModel } from './../common/types/uploaded-file.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  readonly defaultDestination =
    this.configService.get<string>('imageStore.destination') ?? 'default';

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

    const images = imageFileDtos.map((imageFileDto) => ({
      destination: this.defaultDestination,
      originalname: imageFileDto.originalname,
      filename: imageFileDto.filename,
      mimetype: imageFileDto.mimetype,
    }));

    return this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        ...parentConnector,
        ...categoryConnector,
        status: createProductDto.status,
        images: {
          create: images,
        },
        highlights: {
          create: createProductDto.highlights,
        },
        description: createProductDto.description,
      },
      select: {
        id: true,
      },
    });
  }

  private async getParentConnector(id?: string | null) {
    const parent = id
      ? await this.prismaService.product.findUnique({
          where: { id: +id },
        })
      : null;

    if (id !== undefined && parent === null) {
      throw new NotFoundException(`No product with id: ${id} found`);
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

  private async getCategoryConnector(id?: string | null) {
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

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
