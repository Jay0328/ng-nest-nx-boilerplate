import * as path from 'path';
import { getMetadataArgsStorage } from 'typeorm';
import { Config } from '@nnb/server/common/config';

const config: Config = {
  database: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'username',
    password: 'password',
    database: 'database',
    entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
    synchronize: false
  },
  gql: {
    autoSchemaFile: path.resolve(__dirname, '..', 'schema.gql'),
    debug: false,
    playground: true,
    sortSchema: true
  },
  jwt: {
    accessToken: {
      secret: 'secret',
      expiresIn: 900
    },
    refreshToken: {
      secret: 'secret',
      expiresIn: '180 days'
    }
  }
};

export const environment = {
  production: false,
  config
};
