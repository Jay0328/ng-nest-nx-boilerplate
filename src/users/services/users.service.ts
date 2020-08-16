import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TypeOrmQueryBuilderPipeOperator } from '../../shared/typeorm';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { UserEmailAlreadyUsedException } from '../exceptions/user-email-already-used.exception';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository, FindUserBy } from '../repositories/users.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

export interface UsersServiceMethodOptions {
  findOne: {
    manager?: EntityManager;
    pipe?: TypeOrmQueryBuilderPipeOperator<UserEntity>;
    selectPassword?: boolean;
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private getUsersRepository(manager?: EntityManager): UsersRepository {
    return manager?.getCustomRepository(UsersRepository) ?? this.usersRepository;
  }

  private async findOneForUpdate(id: string, manager: EntityManager) {
    return await this.findOneOrFail({ id }, { manager, pipe: qb => qb.setLock('pessimistic_write') });
  }

  private save(user: UserEntity, manager?: EntityManager): Promise<UserEntity> {
    return this.getUsersRepository(manager).save(user);
  }

  findOne(by: FindUserBy, options: UsersServiceMethodOptions['findOne'] = {}): Promise<UserEntity | undefined> {
    const { manager, pipe, selectPassword = false } = options;
    return this.getUsersRepository(manager)
      .createFindOneBaseQueryBuilder('user', by)
      .pipe(pipe, selectPassword && (qb => qb.addSelect(`${qb.alias}.password`)))
      .getOne();
  }

  async findOneOrFail(by: FindUserBy, options?: UsersServiceMethodOptions['findOne']): Promise<UserEntity> {
    const user = await this.findOne(by, options);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async create(createUserDto: CreateUserDto, manager?: EntityManager): Promise<UserEntity> {
    const { email, password, firstName, lastName } = createUserDto;
    const alreadyExistedUser = await this.findOne({ email });

    if (alreadyExistedUser) {
      throw new UserEmailAlreadyUsedException();
    }

    const user = new UserEntity();
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    return this.save(user, manager);
  }

  async update(id: string, updateUserDto: UpdateUserDto, manager: EntityManager): Promise<UserEntity> {
    const alreadyExistedUser = updateUserDto.email ? await this.findOne({ email: updateUserDto.email }) : undefined;

    if (alreadyExistedUser) {
      throw new UserEmailAlreadyUsedException();
    }

    const user = await this.findOneForUpdate(id, manager);
    const { email = user.email, firstName = user.firstName, lastName = user.firstName } = updateUserDto;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    return this.save(user, manager);
  }

  async updatePassword(id: string, password: string, manager: EntityManager): Promise<UserEntity> {
    const user = await this.findOneForUpdate(id, manager);
    user.password = password;
    return this.getUsersRepository(manager).save(user);
  }

  async delete(id: string, manager: EntityManager): Promise<string> {
    const user = await this.findOneForUpdate(id, manager);
    await this.getUsersRepository(manager).remove(user);
    return id;
  }
}
