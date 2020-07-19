import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { pick } from 'lodash';
import { withPipe, TypeOrmQueryBuilderPipeOperator } from '../../shared/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { addSelectUserPassword } from '../operators/add-select-user-password.operator';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { UserEmailAlreadyUsedException } from '../exceptions/user-email-already-used.exception';

async function abstractFindOneOrFail(find: () => Promise<UserEntity | undefined>) {
  const user = await find();

  if (!user) {
    throw new UserNotFoundException();
  }

  return user;
}

export interface FindUserOptions {
  selectPassword?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>
  ) {}

  private async assertIfEmailUsed(email: string | undefined) {
    if (email && (await this.isEmailUsed(email))) {
      throw new UserEmailAlreadyUsedException();
    }
  }

  private find(alias: string, where: TypeOrmQueryBuilderPipeOperator<UserEntity>, options?: FindUserOptions) {
    return withPipe(this.manager.createQueryBuilder(UserEntity, alias))
      .pipe(where, options?.selectPassword && addSelectUserPassword(alias))
      .getOne();
  }

  async isEmailUsed(email: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    return !!user;
  }

  findOneById(id: string, options?: FindUserOptions): Promise<UserEntity | undefined> {
    return this.find('user', qb => qb.where('user.id = :id', { id }), options);
  }

  findOneByIdOrFail(id: string, options?: FindUserOptions): Promise<UserEntity> {
    return abstractFindOneOrFail(() => this.findOneById(id, options));
  }

  findOneByEmail(email: string, options?: FindUserOptions): Promise<UserEntity | undefined> {
    return this.find('user', qb => qb.where('user.email = :email', { email }), options);
  }

  findOneByEmailOrFail(email: string, options?: FindUserOptions): Promise<UserEntity> {
    return abstractFindOneOrFail(() => this.findOneByEmail(email, options));
  }

  create(createUserInput: CreateUserInput): Promise<UserEntity> {
    return this.manager.transaction(async manager => {
      await this.assertIfEmailUsed(createUserInput.email);
      const user = new UserEntity();
      Object.assign(user, pick(createUserInput, ['email', 'password', 'firstName', 'lastName']));
      return manager.save(user);
    });
  }

  update(id: string, updateUserInput: UpdateUserInput): Promise<UserEntity> {
    return this.manager.transaction(async manager => {
      await this.assertIfEmailUsed(updateUserInput.email);
      const user = await this.findOneByIdOrFail(id);
      Object.assign(user, pick(updateUserInput, ['email', 'firstName', 'lastName']));
      return manager.save(user);
    });
  }

  updatePassword(id: string, password: string): Promise<UserEntity> {
    return this.manager.transaction(async manager => {
      const user = await this.findOneByIdOrFail(id);
      user.password = password;
      return manager.save(user);
    });
  }

  async delete(id: string): Promise<string> {
    return this.manager.transaction(async () => {
      await this.findOneByIdOrFail(id);
      await this.usersRepository.delete(id);
      return id;
    });
  }
}
