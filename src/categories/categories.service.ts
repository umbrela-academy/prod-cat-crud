import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/services/prisma.service';
import { UploadedFileModel } from '../common/types/uploaded-file.model';
import { includeImage, toGetCategoryDto, toImageUrl } from './category.utils';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreatedCategoryDto } from './dto/created-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ImagesService } from '../images/images.service';
import * as crypto from 'crypto';

@Injectable()
export class CategoriesService {
  readonly IMG_STORE_URL = this.configService.get<string>(
    'imageStore.storeUrl',
  );

  readonly defaultDestination =
    this.configService.get<string>('imageStore.destination') ?? 'default';

  toDto = toGetCategoryDto(this.IMG_STORE_URL);
  toUrl = toImageUrl(this.IMG_STORE_URL);

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private imageService: ImagesService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    imageFileDto: UploadedFileModel,
  ): Promise<CreatedCategoryDto> {
    const parentConnector = await this.getParentConnector(createCategoryDto);
    const filename = await this.saveImage(
      imageFileDto.buffer,
      imageFileDto.mimetype,
    );

    const response = await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
        ...parentConnector,
        status: createCategoryDto.status,
        categoryImage: {
          create: {
            destination: this.defaultDestination,
            originalname: imageFileDto.originalname,
            filename,
            mimetype: imageFileDto.mimetype,
          },
        },
      },
      select: {
        id: true,
        categoryImage: true,
      },
    });
    return {
      id: response.id,
      ...this.toUrl(response.categoryImage.id),
    };
  }

  private async getParentConnector(createCategoryDto: CreateCategoryDto) {
    const parent = createCategoryDto.parentId
      ? await this.prismaService.category.findUnique({
          where: { id: +createCategoryDto.parentId },
        })
      : null;

    if (createCategoryDto.parentId !== undefined && parent === null) {
      throw new NotFoundException(
        `No parent category with id: ${createCategoryDto.parentId} found`,
      );
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
      skip: (pageNumber - 1) * pageSize,
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
  ): Promise<GetCategoryDto> {
    await this.throwIfNotFound(id);

    const data = await this.buildUpdateData(updateCategoryDto, imageFileDto);

    const res = await this.prismaService.category.update({
      where: {
        id,
      },
      data,
    });
    return { ...res, ...this.toUrl(res.image) };
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

    if (updateCategoryDto.status) {
      data.status = updateCategoryDto.status;
    }

    if (
      updateCategoryDto.parentId !== undefined &&
      updateCategoryDto.parentId !== null
    ) {
      const newParentExists = await this.exists(+updateCategoryDto.parentId);
      if (newParentExists) {
        data.parent = {
          connect: { id: +updateCategoryDto.parentId },
        };
      }
    }

    if (imageFileDto !== undefined) {
      data.categoryImage = {
        create: {
          destination: this.defaultDestination,
          originalname: imageFileDto.originalname,
          filename: imageFileDto.filename,
          mimetype: imageFileDto.mimetype,
        },
      };
    }

    return data;
  }

  async remove(id: number): Promise<GetCategoryDto> {
    await this.throwIfNotFound(id);
    const res = await this.prismaService.category.delete({
      where: {
        id,
      },
    });

    return { ...res, ...this.toUrl(res.image) };
  }

  async throwIfNotFound(id: number) {
    const categoryExists = await this.exists(id);
    if (!categoryExists) {
      throw new NotFoundException(`Category with id: ${id} was not found`);
    }
  }

  async saveImage(buffer: Buffer, mimetype: string): Promise<string> {
    const ext: string = mimetype.split('/')[1];
    const filename: string = crypto.randomUUID() + '.' + ext;
    return await this.imageService.upload(buffer, filename, mimetype);
  }

  async search(query: string) {
    return (
      await this.prismaService.category.findMany({
        where: {
          name: { search: query },
        },
        select: {
          name: true,
          categoryImage: true,
        },
      })
    ).map(this.toDto);
  }
}
