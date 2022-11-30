import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { ConfigService } from "@nestjs/config";
import { UploadedFileModel } from "../common/types/uploaded-file.model";
import { extname } from "path";

@Injectable()
export class ImagesService {

  readonly defaultDestination = this.configService.get<string>('imageStore.destination') ?? 'default';

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService
  ) {}

  async create(imageFileDto: UploadedFileModel): Promise<number> {
    return this.prismaService.image.create({
      data: {
        destination: this.defaultDestination,
        originalname: imageFileDto.originalname,
        filename: imageFileDto.filename,
        extension: extname(imageFileDto.originalname)
      },
      select: {
        id: true
      }
    }).then(res => res.id);
  }
}
