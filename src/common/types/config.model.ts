export interface NestConfig {
  port: number;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface ImageStorageConfig {
  destination: string;
  storeUrl: string;
}

export interface Config {
  nest: NestConfig;
  swagger: SwaggerConfig;
  imageStore: ImageStorageConfig;
  minioClient: MinioClientConfig;
}

export interface MinioClientConfig {
  endpoint: string;
  port: number;
  accessKey: string;
  secretKey: string;
  bucketName: string;
}
