import { ArgsType, Field } from '@nestjs/graphql';
import { IsJWT } from 'class-validator';

@ArgsType()
export class RefreshTokenArgs {
  @Field()
  @IsJWT()
  refreshToken: string;
}
