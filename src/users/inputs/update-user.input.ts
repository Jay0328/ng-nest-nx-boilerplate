import { IsEmail, IsString, IsOptional } from 'class-validator';
import { IsUserEmailNotUsed } from '../decorators/is-user-email-not-used.decorator';

export class UpdateUserInput {
  @IsOptional()
  @IsEmail()
  @IsUserEmailNotUsed()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
