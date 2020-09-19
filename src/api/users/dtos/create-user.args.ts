import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../../../core/users/dtos/create-user.dto';
import { isUsername } from '../../../core/users/validate-decorators/is-username.decorator';

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
