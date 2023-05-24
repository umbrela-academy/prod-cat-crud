import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '../common/services/prisma.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  providers: [ImagesService, PrismaService],
  imports: [
    // MulterModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     dest: configService.get<string>('imageStore.destination'),
    //   }),
    //   inject: [ConfigService],
    // }),
    MinioClientModule,
  ],
  exports: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
