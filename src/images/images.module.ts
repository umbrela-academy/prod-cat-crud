import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '../common/services/prisma.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  providers: [ImagesService, PrismaService],
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dest: configService.get<string>('imageStore.destination'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ImagesService, MulterModule],
  controllers: [ImagesController],
})
export class ImagesModule {}
