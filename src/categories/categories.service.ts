import { category } from './entities/category.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/services/prisma.service';
import { UploadedFileModel } from '../common/types/uploaded-file.model';
import { ImagesService } from '../images/images.service';
import { includeImage, toGetCategoryDto } from './category.utils';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  readonly IMG_STORE_URL = this.configService.get<string>(
    'imageStore.storeUrl',
  );

  toDto = toGetCategoryDto(this.IMG_STORE_URL);

  constructor(
    private prismaService: PrismaService,
    private imagesService: ImagesService,
    private configService: ConfigService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    imageFileDto: UploadedFileModel,
  ): Promise<number> {
    const image = await this.imagesService.create(imageFileDto);
    return this.prismaService.category
      .create({
        data: {
          name: createCategoryDto.name,
          parentId: createCategoryDto.parentId,
          status: createCategoryDto.status,
          image,
        },
        select: {
          id: true,
        },
      })
      .then((res) => res.id);
  }

  async findAll(): Promise<GetCategoryDto[]> {
    return (await this.prismaService.category.findMany(includeImage)).map(
      this.toDto,
    );
  }

  async findPaged(
    pageNumber: number,
    pageSize: number,
  ): Promise<GetCategoryDto[]> {
    const categoriesWithImage = await this.prismaService.category.findMany({
      skip: pageNumber * pageSize,
      take: pageSize,
      ...includeImage,
    });
    return categoriesWithImage.map(this.toDto);
  }

  async findOne(id: number): Promise<GetCategoryDto | null> {
    const categoryWithImage = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      ...includeImage,
    });
    return categoryWithImage ? this.toDto(categoryWithImage) : null;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    imageFileDto?: UploadedFileModel,
  ) {
    const categoryExists = await this.exists(id);

    if (!categoryExists) {
      throw new NotFoundException(`Category with id: ${id} was not found`);
    }

    const data = await this.buildUpdateData(updateCategoryDto, imageFileDto);

    return this.prismaService.category.update({
      where: {
        id,
      },
      data,
    });
  }

  private async exists(id: number): Promise<boolean> {
    const found = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });
    return found !== null;
  }

  private async buildUpdateData(
    updateCategoryDto: UpdateCategoryDto,
    imageFileDto?: UploadedFileModel,
  ) {
    const data: any = {};

    if (updateCategoryDto.name !== undefined) {
      data.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.status !== undefined) {
      data.status = updateCategoryDto.status;
    }

    if (updateCategoryDto.parentId !== undefined) {
      const newParentExists = await this.exists(+updateCategoryDto.parentId);
      if (newParentExists) {
        data.parent = {
          connect: { id: +updateCategoryDto.parentId },
        };
      }
    }

    if (imageFileDto !== undefined) {
      const newCategoryImage = await this.imagesService.create(imageFileDto);
      if (newCategoryImage) {
        data.categoryImage = {
          connect: { id: newCategoryImage },
        };
      }
    }

    return data;
  }

  async remove(id: number) {
    return this.prismaService.category.delete({
      where: {
        id,
      },
    });
  }
}
