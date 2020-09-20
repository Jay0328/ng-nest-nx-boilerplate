import { BadRequestException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, ID } from '@nestjs/graphql';
import { Ctx } from '../decorators/request-context.decorator';
import { RequestContext } from '../../request-context/request-context';
import { EntityID } from '../../orm';
import { UserNotFoundException } from '../../core/users/exceptions/user-not-found.exception';
import { UserEmailAlreadyUsedException } from '../../core/users/exceptions/user-email-already-used.exception';
import { UserEntity } from '../../core/users/user.entity';
import { UsersService } from '../../core/users/users.service';
import { Auth } from '../decorators/auth.decorator';
import { Transaction } from '../decorators/transaction.decorator';
import { FindUserArgs } from './dtos/find-user.args';
import { CreateUserArgs } from './dtos/create-user.args';
import { UpdateUserArgs } from './dtos/update-user.args';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserEntity)
  async user(@Ctx() ctx: RequestContext, @Args() { id }: FindUserArgs): Promise<UserEntity> {
    try {
      return await this.usersService.findOneOrFail(ctx, id);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Transaction()
  @Mutation(() => UserEntity)
  async createUser(@Ctx() ctx: RequestContext, @Args() createUserArgs: CreateUserArgs): Promise<UserEntity> {
    try {
      return await this.usersService.create(ctx, createUserArgs);
    } catch (error) {
      if (error instanceof UserEmailAlreadyUsedException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Auth()
  @Transaction()
  @Mutation(() => UserEntity)
  async updateUser(@Ctx() ctx: RequestContext, @Args() updateUserArgs: UpdateUserArgs): Promise<UserEntity> {
    try {
      return await this.usersService.update(ctx, updateUserArgs);
    } catch (error) {
      if (error instanceof UserNotFoundException || error instanceof UserEmailAlreadyUsedException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Auth()
  @Transaction()
  @Mutation(() => ID)
  async deleteUser(@Ctx() ctx: RequestContext, @Args('id') id: string): Promise<EntityID> {
    try {
      return await this.usersService.delete(ctx, id);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }
}
