import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform<any, Promise<User>> {
  constructor(private readonly usersService: UsersService) {}

  transform(userId: any) {
    if (typeof userId !== 'string') {
      throw new BadRequestException();
    }

    return this.usersService.findOneById(userId);
  }
}
