import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID, IsEmail, IsOptional } from 'class-validator';
import { UpdateUserDto, isUsername } from '@nnb/server/core';

@ArgsType()
export class UpdateUserArgs implements UpdateUserDto {
  @Field()
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @isUsername({ nullable: true })
  username?: string;
}
