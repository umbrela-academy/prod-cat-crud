import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { DownloadedFileModel } from '../common/types/downloaded-file.model';
import { CreatedProductDto } from '../products/dto/created-product.dto';
import { GetProductDto } from '../products/dto/get-product.dto';
import { includeHightsAndImages } from '../products/product.utils';
import { CsvCommonService } from './csv-commons.service';
import { CreateCsvDto } from './dto/create-csv.dto';
import { UpdateCsvDto } from './dto/update-csv.dto';

@Injectable()
export class CsvService {
  constructor(
    private prismaService: PrismaService,
    private csvCommonService: CsvCommonService,
  ) {}

  async create(records: CreateCsvDto[]): Promise<CreatedProductDto[]> {
    const products: any[] = [];
    await Promise.all(
      records.map(async (record: CreateCsvDto) => {
        const { name, description, highlight, status, categoryId, parentId } =
          record;

        const categoryConnector = await this.getCategoryConnector(categoryId);
        const parentConnector = parentId
          ? await this.getParentConnector(parentId)
          : null;

        const images = await this.getImageConnector(record.images);

        const product = this.prismaService.product.create({
          data: {
            name,
            description,
            ...categoryConnector,
            ...parentConnector,
            images,
            highlights: { create: { description: highlight } },
            status,
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

        products.push(product);
      }),
    );

    return (await this.prismaService.$transaction(products)).map(
      this.csvCommonService.toDto,
    );
  }

  async update(records: UpdateCsvDto[]): Promise<GetProductDto[]> {
    const products: any[] = [];
    await Promise.all(
      records.map(async (record: UpdateCsvDto) => {
        await this.throwIfNotFound(record.id);
        const data = await this.buildUpdateData(record);
        const product = this.prismaService.product.update({
          where: { id: record.id },
          data,
          ...includeHightsAndImages,
        });
        products.push(product);
      }),
    );
    return (await this.prismaService.$transaction(products)).map(
      this.csvCommonService.toDto,
    );
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

  private async getParentConnector(id?: number) {
    const parent = id
      ? await this.prismaService.product.findUnique({
          where: { id: +id },
          select: { id: true },
        })
      : null;

    if (id !== null && parent === null) {
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

  private async throwIfNotFound(id?: number) {
    const productExists = id
      ? await this.prismaService.product.findUnique({
          where: { id },
          select: { id: true },
        })
      : null;
    if (!productExists) {
      throw new NotFoundException(`Product with id: ${id} was not found`);
    }
  }

  private async buildUpdateData(record: UpdateCsvDto) {
    const data: any = {};
    if (record.name) {
      data.name = record.name;
    }

    if (record.description) {
      data.description = record.description;
    }
    if (record.categoryId) {
      data.category = (
        await this.getCategoryConnector(record.categoryId)
      ).category;
    }
    if (record.parentId) {
      data.parent = (await this.getParentConnector(record.parentId)).parent;
    }

    if (record.status) {
      data.status = record.status;
    }
    if (record.images) {
      data.images = {
        deleteMany: {},
        ...(await this.getImageConnector(record.images)),
      };
    }
    return data;
  }

  private async getImageConnector(urlArray: string[]) {
    const uniqueUrls = [...new Set(urlArray)];
    const create: DownloadedFileModel[] = [];
    await Promise.all(
      uniqueUrls.map(async (url: string) => {
        const image = await this.findImage(url);

        image
          ? create.push(image)
          : create.push(await this.csvCommonService.downloadImage(url));
      }),
    );
    const data = create.map((imageFile: DownloadedFileModel) => ({
      destination: imageFile.destination,
      originalname: imageFile.originalname,
      filename: imageFile.filename,
      mimetype: imageFile.mimetype,
      url: imageFile.url,
    }));

    return { createMany: { data } };
  }
  private async findImage(url: string) {
    const image = await this.prismaService.productImage.findFirst({
      where: { url },
      select: {
        destination: true,
        originalname: true,
        filename: true,
        mimetype: true,
        url: true,
      },
    });
    return image
      ? {
          ...image,
        }
      : null;
  }
}
