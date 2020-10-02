import { Field, ObjectType } from '@nestjs/graphql';
import { AuthTokensDto } from '@ng-nest-boilerplate/server/core';

@ObjectType()
export class AuthTokens implements AuthTokensDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
