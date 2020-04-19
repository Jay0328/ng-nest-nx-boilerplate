import { APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { CONFIG_TOKEN } from './config/constants/config-token.constant';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Config } from './config/typings/config.typings';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [CONFIG_TOKEN],
      useFactory: (config: Config) => config.database
    }),
    UsersModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}
