import { Config } from '../types/config.model';

export default (): Config => {
  const isApiDocExposed = Boolean(process.env.SWAGGER_ENABLED);

  const config: Config = {
    nest: {
      port: parseInt(process.env.PORT ?? '3333'),
    },
    swagger: {
      enabled: isApiDocExposed !== undefined ? isApiDocExposed : true,
      title: process.env.SWAGGER_TITLE ?? 'CatProd API',
      description:
        process.env.SWAGGER_DESCRIPTION ??
        'A tiny CRUD API for Categories and Products',
      version: process.env.SWAGGER_VERSION ?? '0.0.1',
      path: process.env.SWAGGER_PATH ?? 'api',
    },
    imageStore: {
      destination: process.env.IMG_DIRECTORY ?? 'default',
      storeUrl:
        process.env.IMG_STORE_URL ?? 'http://localhost:3333/api/images/',
    },
    minioClient: {
      endpoint: process.env.MINIO_ENDPOINT ?? 'localhost',
      port: parseInt(process.env.MINIO_PORT ?? '9000'),
      accessKey: process.env.MINIO_ACCESS_KEY ?? '',
      secretKey: process.env.MINIO_SECRET_KEY ?? '',
      bucketName: process.env.MINIO_BUCKET_NAME ?? 'prodcatcrud',
    },
  };

  return config;
};
