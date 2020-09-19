import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EntityID } from '../../orm';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserEmailAlreadyUsedException } from './exceptions/user-email-already-used.exception';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

function encryptUserPassword(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  private getUsersRepository(manager?: EntityManager): Repository<UserEntity> {
    return manager?.getRepository(UserEntity) ?? this.usersRepository;
  }

  private async findOneForUpdate(id: EntityID, manager: EntityManager): Promise<UserEntity> {
    try {
      return await this.getUsersRepository(manager).findOneOrFail(id, {
        lock: {
          mode: 'pessimistic_write'
        }
      });
    } catch {
      throw new UserNotFoundException();
    }
  }

  findOne(id: EntityID): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne(id);
  }

  async findOneOrFail(id: EntityID): Promise<UserEntity> {
    const user = await this.findOne(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  findOneByEmail(email: string, options?: FindOneOptions<UserEntity>): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ email }, options);
  }

  findOneWithPasswordByEmail(email: string): Promise<UserEntity | undefined> {
    return this.findOneByEmail(email, {
      select: ['password']
    });
  }

  async create(createUserDto: CreateUserDto, manager?: EntityManager): Promise<UserEntity> {
    const { email, password, username } = createUserDto;
    const emailAlreadyUsedUser = await this.findOneByEmail(email);

    if (emailAlreadyUsedUser) {
      throw new UserEmailAlreadyUsedException();
    }

    const user = new UserEntity({
      email,
      username,
      password: encryptUserPassword(password)
    });

    return this.getUsersRepository(manager).save(user);
  }

  async update(updateUserDto: UpdateUserDto, manager: EntityManager): Promise<UserEntity> {
    const { id, email: willUpdatedEmail } = updateUserDto;
    const emailAlreadyUsedUser = willUpdatedEmail ? await this.findOneByEmail(willUpdatedEmail) : undefined;

    if (emailAlreadyUsedUser) {
      throw new UserEmailAlreadyUsedException();
    }

    const user = await this.findOneForUpdate(id, manager);
    const { email = user.email, username = user.username } = updateUserDto;
    user.email = email;
    user.username = username;
    return this.getUsersRepository(manager).save(user, { reload: false });
  }

  async updatePassword(id: string, password: string, manager: EntityManager): Promise<UserEntity> {
    const user = await this.findOneForUpdate(id, manager);
    user.password = encryptUserPassword(password);
    return this.getUsersRepository(manager).save(user, { reload: false });
  }

  async delete(id: string, manager: EntityManager): Promise<string> {
    const user = await this.findOneForUpdate(id, manager);
    await this.getUsersRepository(manager).remove(user);
    return id;
  }
}
