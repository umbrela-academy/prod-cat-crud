import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        endPoint: configService.get<string>('minioClient.endpoint')!,
        port: configService.get<number>('minioClient.port')!,
        useSSL: false,
        accessKey: configService.get<string>('minioClient.accessKey')!,
        secretKey: configService.get<string>('minioClient.secretKey')!,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MinioClientService, ConfigService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
