import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly connection: Connection
  ) {}

  findOneById(id: string): Promise<UserEntity> {
    return this.usersRepository.findOne(id);
  }

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersRepository.save(createUserDto);
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.connection.transaction(async () => {
      const user = await this.findOneById(id);

      if (!user) {
        throw new UserNotFoundException();
      }

      return this.usersRepository.save({
        ...user,
        ...updateUserDto
      });
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
