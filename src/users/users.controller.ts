import { Controller, Param, Get, Post, Put, Delete, Body, BadRequestException } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserEmailAlreadyUsedException } from './exceptions/user-email-already-used.exception';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserInput: CreateUserInput): Promise<UserEntity> {
    try {
      return await this.usersService.create(createUserInput);
    } catch (error) {
      if (error instanceof UserEmailAlreadyUsedException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<UserEntity> {
    try {
      return await this.usersService.findOneOrFail({ id: userId });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Put(':userId')
  @Auth({ shouldBeSelfUserIdParam: 'userId' })
  async update(@Param('userId') userId: string, @Body() updateUserInput: UpdateUserInput): Promise<void> {
    try {
      await this.usersService.update(userId, updateUserInput);
    } catch (error) {
      if (error instanceof UserNotFoundException || error instanceof UserEmailAlreadyUsedException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Delete(':userId')
  @Auth({ shouldBeSelfUserIdParam: 'userId' })
  async delete(@Param('userId') userId: string): Promise<void> {
    try {
      await this.usersService.delete(userId);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }
}
