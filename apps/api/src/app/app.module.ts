import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, Config, CONFIG_TOKEN } from '@nnb/server/common/config';
import { RequestContextModule } from '@nnb/server/common/request-context';
import { CoreModule } from '@nnb/server/core';
import { RequestContextGuard } from './middlewares/request-context.guard';
import { UsersResolver } from './users/users.resolver';
import { AuthResolver } from './auth/auth.resolver';

const resolvers = [UsersResolver, AuthResolver];

@Module({
  imports: [
    ConfigModule.register({
      getConfigOptions: async () => (await import('../environments/environment')).environment.config
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
