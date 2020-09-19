import * as path from 'path';
import { Config } from './config.typings';

export const config: Config = {
  database: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'username',
    password: 'password',
    database: 'database',
    entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
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
