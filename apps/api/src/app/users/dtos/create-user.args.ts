import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto, isUsername } from '@nnb/server/core';

@ArgsType()
export class CreateUserArgs implements CreateUserDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @isUsername()
  username: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}
