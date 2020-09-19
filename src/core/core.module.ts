import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, Config } from '../config';
import { UserEntity } from './users/user.entity';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

const entities = [UserEntity];
const services = [UsersService, AuthService];

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigModule.CONFIG_TOKEN],
      useFactory: ({ database }: Config) => database
    }),
    TypeOrmModule.forFeature([...entities])
  ],
  providers: [...services],
  exports: [...services]
})
export class CoreModule {}
