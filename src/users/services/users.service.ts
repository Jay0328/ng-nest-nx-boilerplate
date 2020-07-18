import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { UserAlreadyExistedException } from '../exceptions/user-already-existed.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

export interface UserFindOneOptions {
  selectPassword?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly connection: Connection
  ) {}

  private async assertIfUserExistByEmail(email: string): Promise<void> {
    const user = await this.findOneByEmail(email);

    if (user) {
      throw new UserAlreadyExistedException();
    }
  }

  private findOneBySelectQueryBuilder(
    chainSelectQueryBuilder?: (selectQueryBuilder: SelectQueryBuilder<UserEntity>) => SelectQueryBuilder<UserEntity>,
    options?: UserFindOneOptions
  ) {
    let selectQueryBuilder = this.usersRepository.createQueryBuilder('user');

    if (chainSelectQueryBuilder) {
      selectQueryBuilder = chainSelectQueryBuilder(selectQueryBuilder);
    }

    if (options?.selectPassword) {
      selectQueryBuilder = selectQueryBuilder.addSelect('user.password');
    }

    return selectQueryBuilder.getOne();
  }

  findOneById(id: string, options?: UserFindOneOptions): Promise<UserEntity | undefined> {
    return this.findOneBySelectQueryBuilder(
      selectQueryBuilder => selectQueryBuilder.where('user.id = :id', { id }),
      options
    );
  }

  findOneByEmail(email: string, options?: UserFindOneOptions): Promise<UserEntity | undefined> {
    return this.findOneBySelectQueryBuilder(
      selectQueryBuilder => selectQueryBuilder.where('user.email = :email', { email }),
      options
    );
  }

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  create(createUserInput: CreateUserInput): Promise<UserEntity> {
    return this.connection.transaction(async () => {
      await this.assertIfUserExistByEmail(createUserInput.email);

      const user = new UserEntity();

      Object.assign(user, createUserInput);

      return user.save();
    });
  }

  update(id: string, updateUserInput: UpdateUserInput): Promise<UserEntity> {
    return this.connection.transaction(async () => {
      const user = await this.findOneById(id, { selectPassword: true });

      if (!user) {
        throw new UserNotFoundException();
      }

      if (updateUserInput.email) {
        await this.assertIfUserExistByEmail(updateUserInput.email);
      }

      Object.assign(user, updateUserInput);

      return user.save();
    });
  }

  updatePassword(id: string, password: string): Promise<void> {
    return this.connection.transaction(async () => {
      const user = await this.findOneById(id);

      if (!user) {
        throw new UserNotFoundException();
      }

      user.password = password;
      await user.save();
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
