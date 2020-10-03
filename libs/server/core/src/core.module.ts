import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config, CONFIG_TOKEN } from '@nnb/server/common/config';
import { JwtModule } from '@nnb/server/common/jwt/jwt.module';
import { TransactionalConnection } from '@nnb/server/common/orm';
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
