import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly connection: Connection
  ) {}

  findOneById(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDto);
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.connection.transaction(async () => {
      const user = await this.findOneById(id);

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
