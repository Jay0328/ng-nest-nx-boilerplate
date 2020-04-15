import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UserEntity } from '../user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform<any, Promise<UserEntity>> {
  constructor(private readonly usersService: UsersService) {}

  transform(userId: any) {
    if (typeof userId !== 'string') {
      throw new BadRequestException();
    }

    return this.usersService.findOneById(userId);
  }
}
