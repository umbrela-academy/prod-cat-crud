import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateCategoryDto, ImageFileDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ImagesService } from "../images/images.service";
import { UploadedFileModel } from "../common/types/uploaded-file.model";

@Injectable()
export class CategoriesService {
  constructor(
    private prismaService: PrismaService,
    private imagesService: ImagesService
  ) {}

  async create(createCategoryDto: CreateCategoryDto, imageFileDto: UploadedFileModel) {
    const imageId = await this.imagesService.create(imageFileDto);
    await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name,
        parentId: createCategoryDto.parentId,
        status: createCategoryDto.status,
        imageId
      }
    });
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
