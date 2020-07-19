import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserEmailAlreadyUsedException } from '../exceptions/user-email-already-used.exception';
import { UsersService } from '../services/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserEmailNotUsedConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(email: string) {
    const isUsed = await this.usersService.isEmailUsed(email);
    return !isUsed;
  }

  defaultMessage() {
    return UserEmailAlreadyUsedException.message;
  }
}
