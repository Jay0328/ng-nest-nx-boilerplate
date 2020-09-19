import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class FindUserArgs {
  @Field()
  @IsUUID()
  id: string;
}
