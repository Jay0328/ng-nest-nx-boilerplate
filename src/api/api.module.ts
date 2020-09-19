import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, Config } from '../config';
import { CoreModule } from '../core/core.module';
import { RequestContextModule } from '../request-context/request-context.module';
import { RequestContextGuard } from './middlewares/request-context.guard';
import { UsersResolver } from './users/users.resolver';
import { AuthResolver } from './auth/auth.resolver';

const resolvers = [UsersResolver, AuthResolver];

@Module({
  imports: [
    CoreModule,
    RequestContextModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigModule.CONFIG_TOKEN],
      useFactory: ({ gql }: Config) => ({
        ...gql
      })
    })
  ],
  providers: [
    ...resolvers,
    {
      provide: APP_GUARD,
      useClass: RequestContextGuard
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class ApiModule {}
