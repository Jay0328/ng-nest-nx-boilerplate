import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Config {
  database: TypeOrmModuleOptions;
  jwt: {
    accessToken: {
      secret: string;
      expiredIn?: string | number;
    };
    refreshToken: {
      secret: string;
      expiredIn?: string | number;
    };
  };
}
