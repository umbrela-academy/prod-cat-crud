import { Module } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { ImagesModule } from "../images/images.module";

@Module({
  imports: [ImagesModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
