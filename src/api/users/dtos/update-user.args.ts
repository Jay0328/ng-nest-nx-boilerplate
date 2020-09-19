import { ArgsType, Field } from '@nestjs/graphql';
import { IsUUID, IsEmail, IsOptional } from 'class-validator';
import { UpdateUserDto } from '../../../core/users/dtos/update-user.dto';
import { isUsername } from '../../../core/users/validate-decorators/is-username.decorator';

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
