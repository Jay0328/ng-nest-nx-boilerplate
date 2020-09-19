import { BadRequestException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { Connection } from 'typeorm';
import { UserNotFoundException } from '../../core/users/exceptions/user-not-found.exception';
import { UserEmailAlreadyUsedException } from '../../core/users/exceptions/user-email-already-used.exception';
import { UserEntity } from '../../core/users/user.entity';
import { UsersService } from '../../core/users/users.service';
import { Auth } from '../decorators/auth.decorator';
import { FindUserArgs } from './dtos/find-user.args';
import { CreateUserArgs } from './dtos/create-user.args';
import { UpdateUserArgs } from './dtos/update-user.args';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly connection: Connection, private readonly usersService: UsersService) {}

  @Query(() => UserEntity)
  async user(@Args() { id }: FindUserArgs): Promise<UserEntity> {
    try {
      return await this.usersService.findOneOrFail(id);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Mutation(() => UserEntity)
  async createUser(@Args() createUserArgs: CreateUserArgs): Promise<UserEntity> {
    try {
      return await this.usersService.create(createUserArgs);
    } catch (error) {
      if (error instanceof UserEmailAlreadyUsedException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Mutation(() => UserEntity)
  @Auth()
  async updateUser(@Args() updateUserArgs: UpdateUserArgs): Promise<UserEntity> {
    try {
      return await this.connection.transaction(transactionalManager =>
        this.usersService.update(updateUserArgs, transactionalManager)
      );
    } catch (error) {
      if (error instanceof UserNotFoundException || error instanceof UserEmailAlreadyUsedException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Mutation(() => ID)
  @Auth()
  async deleteUser(@Args('id') id: string): Promise<string> {
    try {
      return await this.connection.transaction(transactionalManager =>
        this.usersService.delete(id, transactionalManager)
      );
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }
}
