import { Config } from '../types/config.model';

export default (): Config => {
  const isApiDocExposed = Boolean(process.env.SWAGGER_ENABLED);

  const config: Config = {
    nest: {
      port: 3333,
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
  };

  return config;
};
