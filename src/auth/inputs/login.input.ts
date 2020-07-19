import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
