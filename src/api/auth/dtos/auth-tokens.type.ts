import { Field, ObjectType } from '@nestjs/graphql';
import { AuthTokensDto } from '../../../core/auth/dtos/auth-tokens.dto';

@ObjectType()
export class AuthTokens implements AuthTokensDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
