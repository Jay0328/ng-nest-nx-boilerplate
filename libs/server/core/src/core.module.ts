import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config, CONFIG_TOKEN } from '@ng-nest-boilerplate/server/common/config';
import { JwtModule } from '@ng-nest-boilerplate/server/common/jwt/jwt.module';
import { TransactionalConnection } from '@ng-nest-boilerplate/server/common/orm';
import { UserEntity, UsersService } from './users';
import { AuthService } from './auth';

const entities = [UserEntity];
const services = [UsersService, AuthService];
const providers = [TransactionalConnection];

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forRootAsync({
      inject: [CONFIG_TOKEN],
      useFactory: ({ database }: Config) => database
    }),
    TypeOrmModule.forFeature([...entities])
  ],
  providers: [...providers, ...services],
  exports: [...providers, ...services]
})
export class CoreModule {}
