import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { DownloadedFileModel } from '../common/types/downloaded-file.model';
import { CreatedProductDto } from '../products/dto/created-product.dto';
import { GetProductDto } from '../products/dto/get-product.dto';
import { includeHightsAndImages } from '../products/product.utils';
import { CsvCommonService } from './csv-commons.service';
import { CreateCsvDto, zCsvCreateSchema } from './dto/create-csv.dto';
import { UpdateCsvDto, zCsvUpdateSchema } from './dto/update-csv.dto';

@Injectable()
export class CsvService {
  constructor(
    private prismaService: PrismaService,
    private csvCommonService: CsvCommonService,
  ) {}

  async create(fileBuffer: String): Promise<CreatedProductDto[]> {
    const records: CreateCsvDto[] = await this.csvCommonService.parseCsv(
      fileBuffer,
    );
    const products: any[] = [];
    await Promise.all(
      records.map(async (record: CreateCsvDto) => {
        const data: CreateCsvDto = this.validateRow(record);
        const { name, description, highlight, status, categoryId, parentId } =
          data;

        const categoryConnector = await this.getCategoryConnector(categoryId);
        const parentConnector = parentId
          ? await this.getParentConnector(parentId)
          : null;
        const images = await this.getImageConnector(data.images);

        const product = this.prismaService.product.create({
          data: {
            name,
            description,
            ...categoryConnector,
            ...parentConnector,
            images: {
              connect: images.connect,
              create: images.create,
            },
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

  async update(fileBuffer: String): Promise<GetProductDto[]> {
    const records: UpdateCsvDto[] = await this.csvCommonService.parseCsv(
      fileBuffer,
    );
    const products: any[] = [];
    await Promise.all(
      records.map(async (record: UpdateCsvDto) => {
        const toUpdate: UpdateCsvDto = this.validateUpdateRow(record);
        await this.throwIfNotFound(toUpdate.id);
        const data = await this.buildUpdateData(toUpdate);
        const product = this.prismaService.product.update({
          where: { id: toUpdate.id },
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

    if (record.images) {
      data.images = {
        deleteMany: {},
        ...(await this.getImageConnector(record.images)),
      };
    }
    return data;
  }

  private validateUpdateRow(record: UpdateCsvDto): UpdateCsvDto {
    const parseResult = zCsvUpdateSchema.safeParse(record);

    if (!parseResult.success) {
      throw new BadRequestException(parseResult.error.issues[0]);
    }
    return parseResult.data;
  }

  private validateRow(record: CreateCsvDto): CreateCsvDto {
    const parseResult = zCsvCreateSchema.safeParse(record);

    if (!parseResult.success) {
      throw new BadRequestException(parseResult.error.issues[0].message);
    }
    return parseResult.data;
  }

  private async getImageConnector(urlArray: string[]) {
    const uniqueUrls = [...new Set(urlArray)];
    const connect: any[] = [];
    const create: any[] = [];
    await Promise.all(
      uniqueUrls.map(async (url: string) => {
        const image = await this.findImage(url);
        image
          ? connect.push({ id: image.id })
          : create.push(await this.csvCommonService.downloadImage(url));
      }),
    );
    return {
      connect,
      create: create.map((imageFile: DownloadedFileModel) => ({
        destination: imageFile.destination,
        originalname: imageFile.originalname,
        filename: imageFile.filename,
        mimetype: imageFile.mimetype,
        url: imageFile.url,
      })),
    };
  }
  async findImage(url: string) {
    return this.prismaService.productImage.findFirst({
      where: { url },
      select: { id: true },
    });
  }
}
