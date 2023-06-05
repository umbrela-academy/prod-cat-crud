import { Module } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MinioClientModule } from '../minio-client/minio-client.module';
import { ConfigModule } from '@nestjs/config';

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
    ConfigModule,
  ],
  exports: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
