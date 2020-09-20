import { Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RequestContext } from '../../request-context/request-context';
import { EntityID, TransactionalConnection } from '../../orm';
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
  constructor(private readonly connection: TransactionalConnection) {}

  findOne(ctx: RequestContext, id: EntityID): Promise<UserEntity | undefined> {
    return this.connection.getRepository(ctx, UserEntity).findOne(id);
  }

  async findOneOrFail(ctx: RequestContext, id: EntityID): Promise<UserEntity> {
    const user = await this.findOne(ctx, id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  findOneByEmail(
    ctx: RequestContext,
    email: string,
    options?: FindOneOptions<UserEntity>
  ): Promise<UserEntity | undefined> {
    return this.connection.getRepository(ctx, UserEntity).findOne({ email }, options);
  }

  findOneForLogin(ctx: RequestContext, email: string): Promise<UserEntity | undefined> {
    return this.findOneByEmail(ctx, email, {
      select: ['password']
    });
  }

  async create(ctx: RequestContext, createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, username } = createUserDto;
    const emailAlreadyUsedUser = await this.findOneByEmail(ctx, email);

    if (emailAlreadyUsedUser) {
      throw new UserEmailAlreadyUsedException();
    }

    const user = new UserEntity({
      email,
      username,
      password: encryptUserPassword(password)
    });

    return this.connection.getRepository(ctx, UserEntity).save(user);
  }

  async update(ctx: RequestContext, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const { id, email: willUpdatedEmail } = updateUserDto;
    const emailAlreadyUsedUser = willUpdatedEmail ? await this.findOneByEmail(ctx, willUpdatedEmail) : undefined;

    if (emailAlreadyUsedUser) {
      throw new UserEmailAlreadyUsedException();
    }

    const user = await this.findOneOrFail(ctx, id);
    const { email = user.email, username = user.username } = updateUserDto;
    user.email = email;
    user.username = username;
    return this.connection.getRepository(ctx, UserEntity).save(user, { reload: false });
  }

  async updatePassword(ctx: RequestContext, id: string, password: string): Promise<UserEntity> {
    const user = await this.findOneOrFail(ctx, id);
    user.password = encryptUserPassword(password);
    return this.connection.getRepository(ctx, UserEntity).save(user, { reload: false });
  }

  async delete(ctx: RequestContext, id: string): Promise<string> {
    const user = await this.findOneOrFail(ctx, id);
    await this.connection.getRepository(ctx, UserEntity).remove(user);
    return id;
  }
}
