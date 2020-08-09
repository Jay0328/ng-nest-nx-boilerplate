import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { pick } from 'lodash';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { UserEmailAlreadyUsedException } from '../exceptions/user-email-already-used.exception';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { addSelectUserPassword } from '../operators/add-select-user-password.operator';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';

export interface FindUserOptions {
  selectPassword?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly usersRepository: UsersRepository
  ) {}

  private async assertIfEmailUsed(email: string | undefined) {
    if (email && (await this.isEmailUsed(email))) {
      throw new UserEmailAlreadyUsedException();
    }
  }

  async isEmailUsed(email: string): Promise<boolean> {
    const user = await this.findOne({ email });
    return !!user;
  }

  findOne(by: { id: string } | { email: string }, options?: FindUserOptions): Promise<UserEntity | undefined> {
    const alias = 'user';

    return this.usersRepository
      .createQueryBuilder(alias)
      .pipe(qb => {
        const key = 'id' in by ? 'id' : 'email';
        return qb.where(`${alias}.${key} = :${key}`, by);
      }, options?.selectPassword && addSelectUserPassword(alias))
      .getOne();
  }

  async findOneOrFail(...params: Parameters<UsersService['findOne']>) {
    const user = await this.findOne(...params);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
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
      const user = await this.findOneOrFail({ id });
      Object.assign(user, pick(updateUserInput, ['email', 'firstName', 'lastName']));
      return manager.save(user);
    });
  }

  updatePassword(id: string, password: string): Promise<UserEntity> {
    return this.manager.transaction(async manager => {
      const user = await this.findOneOrFail({ id });
      user.password = password;
      return manager.save(user);
    });
  }

  delete(id: string): Promise<string> {
    return this.manager.transaction(async () => {
      await this.findOneOrFail({ id });
      await this.usersRepository.delete(id);
      return id;
    });
  }
}
