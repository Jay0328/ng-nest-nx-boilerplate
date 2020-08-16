import { Controller, Param, Get, Post, Put, Delete, Body, BadRequestException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserEmailAlreadyUsedException } from './exceptions/user-email-already-used.exception';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly connection: Connection, private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.usersService.create(createUserDto);
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
  async update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<void> {
    try {
      await this.connection.transaction(transactionalManager =>
        this.usersService.update(userId, updateUserDto, transactionalManager)
      );
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
      await this.connection.transaction(transactionalManager => this.usersService.delete(userId, transactionalManager));
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }
}
