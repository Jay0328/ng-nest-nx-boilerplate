import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GqlModuleOptions } from '@nestjs/graphql';

export interface Config {
  database: TypeOrmModuleOptions;
  gql: GqlModuleOptions;
  jwt: {
    accessToken: {
      secret: string;
      expiresIn?: string | number;
    };
    refreshToken: {
      secret: string;
      expiresIn?: string | number;
    };
  };
}
