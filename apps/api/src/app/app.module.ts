import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, Config, CONFIG_TOKEN } from '@ng-nest-boilerplate/server/common/config';
import { RequestContextModule } from '@ng-nest-boilerplate/server/common/request-context';
import { CoreModule } from '@ng-nest-boilerplate/server/core';
import { RequestContextGuard } from './middlewares/request-context.guard';
import { UsersResolver } from './users/users.resolver';
import { AuthResolver } from './auth/auth.resolver';

const resolvers = [UsersResolver, AuthResolver];

@Module({
  imports: [
    ConfigModule.register({
      getConfigFile: async () => (await import('../environments/environment')).config
    }),
    CoreModule,
    RequestContextModule,
    GraphQLModule.forRootAsync({
      inject: [CONFIG_TOKEN],
      useFactory: ({ gql }: Config) => gql
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
export class AppModule {}
