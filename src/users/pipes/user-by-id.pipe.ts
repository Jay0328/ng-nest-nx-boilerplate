import { PipeTransform, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform<any, Promise<UserEntity>> {
  constructor(private readonly usersService: UsersService) {}

  async transform(userId: any) {
    if (typeof userId !== 'string') {
      throw new BadRequestException();
    }

    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
