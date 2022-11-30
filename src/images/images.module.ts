import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { PrismaService } from "../common/services/prisma.service";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { diskStorage } from "multer";

@Module({
  providers: [ImagesService, PrismaService],
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>("imageStore.destination"),
        }),
      }),
      inject: [ConfigService]
    }),
  ],
  exports: [ImagesService, MulterModule]
})
export class ImagesModule {}
