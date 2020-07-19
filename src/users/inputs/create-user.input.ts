import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { IsUserEmailNotUsed } from '../decorators/is-user-email-not-used.decorator';

export class CreateUserInput {
  @IsNotEmpty()
  @IsEmail()
  @IsUserEmailNotUsed()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
