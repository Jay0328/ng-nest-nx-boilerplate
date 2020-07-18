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
    synchronize: true
  },
  jwt: {
    accessToken: {
      secret: 'secret',
      expiredIn: 900
    },
    refreshToken: {
      secret: 'secret',
      expiredIn: '180 days'
    }
  }
};
